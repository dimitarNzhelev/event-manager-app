"use client"

import { motion } from 'framer-motion'
import { Pod } from '~/types'
import { Check, AlertTriangle, XCircle, Activity } from 'lucide-react'

interface PodStatisticsProps {
  pods: Pod[]
}

export function PodStatistics({ pods }: PodStatisticsProps) {
  const runningPods = pods.filter(pod => pod.status === 'Running').length
  const pendingPods = pods.filter(pod => pod.status === 'Pending').length
  const failedPods = pods.filter(pod => pod.status === 'Failed').length
  const totalPods = pods.length

  const stats = [
    { title: "Total Pods", value: totalPods, icon: Activity, color: "bg-blue-600" },
    { title: "Running", value: runningPods, icon: Check, color: "bg-green-600" },
    { title: "Pending", value: pendingPods, icon: AlertTriangle, color: "bg-yellow-600" },
    { title: "Failed", value: failedPods, icon: XCircle, color: "bg-red-700" },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className={`${stat.color} rounded-lg shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center mr-4">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium uppercase">{stat.title}</p>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

