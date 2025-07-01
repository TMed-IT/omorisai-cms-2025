export const validateEmail = (email: string): string | true => {
  if (!email) {
    return 'メールアドレスは必須です'
  }
  
  const emailPattern = /^[mn]\d{5}[a-z]@st\.toho-u\.ac\.jp$/
  if (!emailPattern.test(email)) {
    const oldDomainPattern = /^[mn]\d{5}[a-z]@st\.toho-u\.jp$/
    if (oldDomainPattern.test(email)) {
      return '2022年度以前に入学の方は、@st.toho-u.ac.jp のエイリアスアドレスをご利用ください。'
    }
    return 'st.toho-u.ac.jp ドメインの有効なメールアドレスを入力してください'
  }
  
  return true
} 