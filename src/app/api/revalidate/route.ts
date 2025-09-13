import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret') || ''
  const path = request.nextUrl.searchParams.get('path') || ''

  if (!process.env.REVALIDATION_KEY) {
    return NextResponse.json({ message: 'Missing REVALIDATION_KEY' }, { status: 500 })
  }

  if (secret !== process.env.REVALIDATION_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!path) {
    return NextResponse.json({ message: 'Path parameter is required' }, { status: 400 })
  }

  try {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path, now: Date.now() })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ message: 'Error revalidating', error: message }, { status: 500 })
  }
}

