import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { promises as fs } from 'fs'

export async function GET(req: NextRequest, res: NextResponse) {
  const filePath = join(process.cwd(), 'public', 'namespaces.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const result = JSON.parse(fileContents)
  let namespaces: string[] = []
  namespaces = result.map((namespace: any) => {
    return namespace.metadata.name
  })

  return NextResponse.json(namespaces)
}