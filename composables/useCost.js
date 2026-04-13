/**
 * @param {number|string} cost - Число или строка из числа.
 * @param {boolean} isHideSign - Скрывает знак рубля. @default false
 * @returns {string} Например: '100 000₽'
 */
export function useCost(cost, isHideSign = false) {
  return cost
    ? `${String(cost).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${isHideSign ? '' : ' ₽'}`
    : `0${isHideSign ? '' : ' ₽'}`;
}
