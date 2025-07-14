export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`
}

export const formatDateByPattern = (date: Date, pattern: string): string => {
  if (!pattern) {
    return date.toLocaleDateString('ja-JP')
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
  }
  
  return date.toLocaleDateString(locale, options || defaultOptions)
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
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${month}/${day} ${hour}:${minute.toString().padStart(2, '0')}`
}
