import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// 로컬 테스트용 랭킹 DB JSON 파일 경로
const DB_FILE = path.resolve(__dirname, 'local-rankings.json')

function getLocalRankings() {
  if (!fs.existsSync(DB_FILE)) {
    return [
      { id: '다람쥐대장', stage: 25 },
      { id: '도토리도둑', stage: 18 },
      { id: '햄스터박사', stage: 14 },
      { id: '씨앗수집가', stage: 10 },
      { id: '빠른쳇바퀴', stage: 7 }
    ]
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
  } catch (e) {
    return []
  }
}

function saveLocalRankings(rankings: any[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(rankings, null, 2))
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const url = env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  const hasCredentials = !!(url && token)

  return {
    base: './',
    plugins: [
      vue(),
      {
        name: 'rankings-api-mock',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/rankings')) {
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

              if (req.method === 'OPTIONS') {
                res.statusCode = 200
                res.end()
                return
              }

              if (req.method === 'GET') {
                if (hasCredentials) {
                  try {
                    const response = await fetch(`${url}`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(['ZREVRANGE', 'yabawi_rankings', 0, 9, 'WITHSCORES'])
                    })
                    if (response.ok) {
                      const data = (await response.json()) as any
                      const rawResult: string[] = data.result || []
                      const rankings = []
                      for (let i = 0; i < rawResult.length; i += 2) {
                        const id = rawResult[i]
                        const stage = parseInt(rawResult[i + 1], 10)
                        rankings.push({ id, stage })
                      }
                      if (rankings.length > 0) {
                        res.end(JSON.stringify(rankings))
                        return
                      }
                    }
                  } catch (e) {
                    console.error('Error contacting Upstash Redis from local Vite dev:', e)
                  }
                }

                const rankings = getLocalRankings()
                res.end(JSON.stringify(rankings))
              } else if (req.method === 'POST') {
                let body = ''
                req.on('data', chunk => {
                  body += chunk
                })
                req.on('end', async () => {
                  try {
                    const newRecord = JSON.parse(body)
                    if (newRecord.id && typeof newRecord.stage === 'number') {
                      if (hasCredentials) {
                        try {
                          const response = await fetch(`${url}`, {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify([
                              ['ZADD', 'yabawi_rankings', 'GT', newRecord.stage, newRecord.id],
                              ['ZREMRANGEBYRANK', 'yabawi_rankings', 0, -101]
                            ])
                          })
                          if (response.ok) {
                            const listResponse = await fetch(`${url}`, {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(['ZREVRANGE', 'yabawi_rankings', 0, 9, 'WITHSCORES'])
                            })
                            if (listResponse.ok) {
                              const listData = (await listResponse.json()) as any
                              const rawResult: string[] = listData.result || []
                              const rankings = []
                              for (let i = 0; i < rawResult.length; i += 2) {
                                const id = rawResult[i]
                                const stage = parseInt(rawResult[i + 1], 10)
                                rankings.push({ id, stage })
                              }
                              res.end(JSON.stringify({ success: true, rankings }))
                              return
                            }
                          }
                        } catch (e) {
                          console.error('Error updating Upstash Redis from local Vite dev:', e)
                        }
                      }

                      let rankings = getLocalRankings()
                      const existingIdx = rankings.findIndex((r: any) => r.id === newRecord.id)
                      if (existingIdx !== -1) {
                        if (newRecord.stage > rankings[existingIdx].stage) {
                          rankings[existingIdx].stage = newRecord.stage
                        }
                      } else {
                        rankings.push({ id: newRecord.id, stage: newRecord.stage })
                      }
                      rankings.sort((a: any, b: any) => b.stage - a.stage)
                      rankings = rankings.slice(0, 10)
                      saveLocalRankings(rankings)
                      res.end(JSON.stringify({ success: true, rankings }))
                    } else {
                      res.statusCode = 400
                      res.end(JSON.stringify({ error: 'Invalid data' }))
                    }
                  } catch (err) {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: 'Internal server error' }))
                  }
                })
              }
            } else {
              next()
            }
          })
        }
      }
    ],
    server: {
      host: true,
      port: 5173,
    },
  }
})
