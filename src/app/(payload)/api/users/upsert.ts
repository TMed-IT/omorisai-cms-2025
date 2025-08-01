import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'
import { validateEmail } from '@/utilities/validateEmail'
import { EmailValidationError, NameValidationError, AdminUserCannotBeChangedToEditorError } from '@/utilities/errors'

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function POST(req: NextRequest) {
  const secret = process.env.USERS_API_SECRET
  const authHeader = req.headers.get('authorization')
  if (!secret || !authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: '認証エラー' }, { status: 401 })
  }

  const body = await req.json()
  const { email, name, nameRoman, role } = body

  const emailValidation = validateEmail(email)
  if (emailValidation !== true) {
    throw new EmailValidationError(emailValidation as string)
  }
  if (!name || !name.includes(' ')) {
    throw new NameValidationError('姓名の間は半角スペースで区切ってください')
  }
  if (!nameRoman || !nameRoman.includes(' ')) {
    throw new NameValidationError('姓名（ローマ字）の間は半角スペースで区切ってください')
  }

  const user = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (user.docs.length > 0) {
    const existingUser = user.docs[0]
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (existingUser.role === 'admin' && role === 'editor') {
      const adminUsers = await payload.find({
        collection: 'users',
        where: { role: { equals: 'admin' } },
        limit: 1,
      })
      
      if (adminUsers.docs.length <= 1) {
        throw new AdminUserCannotBeChangedToEditorError()
      }
    }
    
    const updated = await payload.update({
      collection: 'users',
      id: existingUser.id,
      data: { name, nameRoman, role },
    })
    return NextResponse.json({ updated: true })
  } else {
    const password = generatePassword()
    await payload.create({
      collection: 'users',
      data: { email, name, nameRoman, role, password },
    })
    return NextResponse.json({ created: true, password })
  }
}