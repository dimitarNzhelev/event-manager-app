import { env } from '~/env'
import { NextRequest, NextResponse } from 'next/server'

export function GET(req: NextRequest) {
  const grafanaUrl = env.GRAFANA_URL

  if (!grafanaUrl) {
    return NextResponse.json({ error: 'GRAFANA_URL is not set' }, { status: 500 })
  }

  return NextResponse.json({ grafanaUrl })
}