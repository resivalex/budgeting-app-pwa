export function convertCurrencyCodeToSymbol(currencyCode: string): string {
  switch (currencyCode) {
    case 'USD':
      return '$'
    case 'EUR':
      return '€'
    case 'RUB':
      return '₽'
    case 'KZT':
      return '₸'
    case 'TRY':
      return '₺'
    default:
      return currencyCode
  }
}

export function formatFinancialAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  })
    .format(amount)
    .replace(/,/g, ' ') // Replace all commas with spaces
}

export function formatFinancialAmountRounded(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  })
    .format(amount)
    .replace(',', ' ') // Replace commas with spaces
}
