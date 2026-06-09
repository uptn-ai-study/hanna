export interface AverageDownResult {
  finalPrice: number;
  totalQty: number;
  totalAmount: number;
}

export interface TargetBuyResult {
  buyQty: number;
  totalAmount: number;
  isValid: boolean;
  message?: string;
}

/**
 * Calculates the final average price and total holdings after adding more coins.
 */
export function calculateAverageDown(
  currentPrice: number,
  currentQty: number,
  buyPrice: number,
  buyQty: number
): AverageDownResult {
  if (currentPrice <= 0 || currentQty <= 0) {
    return {
      finalPrice: buyPrice > 0 ? buyPrice : 0,
      totalQty: buyQty > 0 ? buyQty : 0,
      totalAmount: buyQty > 0 ? buyPrice * buyQty : 0,
    };
  }

  const currentAmount = currentPrice * currentQty;
  const buyAmount = (buyPrice > 0 && buyQty > 0) ? buyPrice * buyQty : 0;
  
  const totalQty = currentQty + (buyQty > 0 ? buyQty : 0);
  const totalAmount = currentAmount + buyAmount;
  const finalPrice = totalQty > 0 ? totalAmount / totalQty : 0;

  return {
    finalPrice,
    totalQty,
    totalAmount,
  };
}

/**
 * Calculates how much more coins need to be bought at a certain price to achieve a target average price.
 */
export function calculateTargetBuy(
  currentPrice: number,
  currentQty: number,
  targetPrice: number,
  buyPrice: number
): TargetBuyResult {
  // Check basic inputs
  if (currentPrice <= 0 || currentQty <= 0 || targetPrice <= 0 || buyPrice <= 0) {
    return { buyQty: 0, totalAmount: 0, isValid: false, message: '모든 입력값은 0보다 커야 합니다.' };
  }

  if (currentPrice === targetPrice) {
    return { buyQty: 0, totalAmount: 0, isValid: true, message: '현재 평단가와 목표 평단가가 이미 동일합니다.' };
  }

  // 1. Water Down (물타기) - Lowering average price
  if (targetPrice < currentPrice) {
    if (buyPrice >= targetPrice) {
      return {
        buyQty: 0,
        totalAmount: 0,
        isValid: false,
        message: `평단가를 ${targetPrice.toLocaleString()}원으로 낮추려면, 추가 매수 단가는 목표 평단가보다 낮아야 합니다.`,
      };
    }
  } 
  // 2. Fire Up (불타기) - Raising average price
  else if (targetPrice > currentPrice) {
    if (buyPrice <= targetPrice) {
      return {
        buyQty: 0,
        totalAmount: 0,
        isValid: false,
        message: `평단가를 ${targetPrice.toLocaleString()}원으로 높이려면, 추가 매수 단가는 목표 평단가보다 높아야 합니다.`,
      };
    }
  }

  // Formula: buyQty = currentQty * (currentPrice - targetPrice) / (targetPrice - buyPrice)
  const buyQty = currentQty * (currentPrice - targetPrice) / (targetPrice - buyPrice);
  const totalAmount = buyQty * buyPrice;

  if (buyQty < 0 || isNaN(buyQty) || !isFinite(buyQty)) {
    return {
      buyQty: 0,
      totalAmount: 0,
      isValid: false,
      message: '현재 조건으로는 목표 평단가를 달성할 수 없습니다.',
    };
  }

  return {
    buyQty,
    totalAmount,
    isValid: true,
  };
}
