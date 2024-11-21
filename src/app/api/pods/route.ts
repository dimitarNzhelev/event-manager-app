import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { promises as fs } from 'fs'
import {Pod } from '~/types'

function calculateAge(timestamp: string): string {
  const creationDate = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - creationDate.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export async function GET(req: NextRequest, res: NextResponse) {
  const filePath = join(process.cwd(), 'public', 'pods.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const result = JSON.parse(fileContents)
  let pods: Pod[] = []
  pods = result.map((pod: any) => {
    return {
      name: pod.metadata.name,
      namespace: pod.metadata.namespace,
      status: pod.status.phase,
      nodeName: pod.spec.nodeName,
      restarts: pod.status.containerStatuses[0].restartCount,
      age: calculateAge(pod.metadata.creationTimestamp),
    }
  })

  return NextResponse.json(pods)
}