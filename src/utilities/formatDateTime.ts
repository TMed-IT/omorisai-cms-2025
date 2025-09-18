export const formatDateTime = (timestamp: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date()
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo',
  }).format(date)
}

export const formatDateByPattern = (date: Date, pattern: string): string => {
  if (!pattern) {
    return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo' }).format(date)
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const YYYY = year.toString()
  const MM = month < 10 ? `0${month}` : month.toString()
  const DD = day < 10 ? `0${day}` : day.toString()
  
  return pattern
    .replace('YYYY', YYYY)
    .replace('MM', MM)
    .replace('DD', DD)
}

export const formatDateByLocale = (date: Date, locale: string = 'ja-JP', options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  }
  const fmt = new Intl.DateTimeFormat(locale, options ? { timeZone: 'Asia/Tokyo', ...options } : defaultOptions)
  return fmt.format(date)
}

export const formatDateByISOFormat = (date: Date, format: string): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const YYYY = year.toString()
  const YY = year.toString().slice(-2)
  const MM = month < 10 ? `0${month}` : month.toString()
  const M = month.toString()
  const DD = day < 10 ? `0${day}` : day.toString()
  const D = day.toString()
  
  return format
    .replace('YYYY', YYYY)
    .replace('YY', YY)
    .replace('MM', MM)
    .replace('M', M)
    .replace('DD', DD)
    .replace('D', D)
}

export const formatDateShortJP = (date: Date): string => {
  const dtf = new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo',
  })
  return dtf.format(date)
}
