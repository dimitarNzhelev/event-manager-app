"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

interface Pod {
  name: string
  namespace: string
  status: string
  restarts: number
  age: string
}

export function PodList({ pods }: { pods: Pod[] }) {

  return (
    <div className="max-h-[300px] relative overflow-auto">

    <Table>
      <TableHeader className="sticky top-0 bg-gray-800">
        <TableRow className="border-gray-700">
          <TableHead className="text-gray-300">Name</TableHead>
          <TableHead className="text-gray-300">Namespace</TableHead>
          <TableHead className="text-gray-300">Status</TableHead>
          <TableHead className="text-gray-300">Restarts</TableHead>
          <TableHead className="text-gray-300">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pods.map((pod) => (
          <TableRow key={pod.name} className="border-gray-700">
            <TableCell className="text-gray-300">{pod.name}</TableCell>
            <TableCell className="text-gray-300">{pod.namespace}</TableCell>
            <TableCell className="text-gray-300">{pod.status}</TableCell>
            <TableCell className="text-gray-300">{pod.restarts}</TableCell>
            <TableCell className="text-gray-300">{pod.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}

