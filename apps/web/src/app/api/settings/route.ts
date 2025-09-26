import { getSettings } from '@nathy/web/server/settings'
import { NextResponse } from 'next/server'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings, { status: 200 })
}
