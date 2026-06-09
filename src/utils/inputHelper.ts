export const cleanNumber = (val: any): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = val.toString().replace(/,/g, '');
  const num = Number(str);
  return isNaN(num) ? 0 : num;
};

export const formatWithCommas = (val: number | string | null | undefined): string => {
  if (val === undefined || val === null || val === '') return '';
  const parts = val.toString().split('.');
  parts[0] = parts[0].replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const handleNumberInput = (
  e: Event,
  updateValue: (num: number | '') => void
) => {
  const target = e.target as HTMLInputElement;
  const rawValue = target.value;
  
  // Clean all characters except digits and a single decimal point
  const cleanValue = rawValue.replace(/[^0-9.]/g, '');
  const parts = cleanValue.split('.');
  const sanitized = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
  
  const selectionStart = target.selectionStart;
  const oldLength = target.value.length;
  
  // Call the update callback with parsed number or empty string
  updateValue(sanitized === '' ? '' : Number(sanitized));
  
  // Format the value with commas
  const formatted = formatWithCommas(sanitized);
  target.value = formatted;
  
  // Adjust selection start
  const newLength = formatted.length;
  const lengthDiff = newLength - oldLength;
  let newSelectionStart = (selectionStart || 0) + lengthDiff;
  
  newSelectionStart = Math.max(0, Math.min(newSelectionStart, newLength));
  target.setSelectionRange(newSelectionStart, newSelectionStart);
};

export const handleKeydown = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement;
  if (e.key === 'Backspace') {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start === end && start !== null && start > 0) {
      if (target.value[start - 1] === ',') {
        e.preventDefault();
        const val = target.value;
        const newVal = val.slice(0, start - 2) + val.slice(start);
        target.value = newVal;
        target.setSelectionRange(start - 2, start - 2);
        target.dispatchEvent(new Event('input'));
      }
    }
  } else if (e.key === 'Delete') {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start === end && start !== null && start < target.value.length) {
      if (target.value[start] === ',') {
        e.preventDefault();
        const val = target.value;
        const newVal = val.slice(0, start) + val.slice(start + 2);
        target.value = newVal;
        target.setSelectionRange(start, start);
        target.dispatchEvent(new Event('input'));
      }
    }
  }
};
