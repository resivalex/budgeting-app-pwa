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
