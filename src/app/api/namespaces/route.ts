import { NextRequest, NextResponse } from 'next/server'
import { env } from '~/env'

export async function GET(req: NextRequest) {
  const response = await fetch(`${env.BACKEND_URL}/namespaces`)
  const namespaces = await response.json()
  return NextResponse.json(namespaces)
}