import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { promises as fs } from 'fs'

export async function GET(req: NextRequest, res: NextResponse) {
  const filePath = join(process.cwd(), 'public', 'alerts.json')
  const fileContents = await fs.readFile(filePath, 'utf8')

  const result = JSON.parse(fileContents)

  return NextResponse.json(result)
}