"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricData {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  networkIn: number
  networkOut: number
}

export function ClusterMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Error fetching metrics:', error)
      }
    }
  
    fetchMetrics()
    const intervalId = setInterval(() => {
      fetchMetrics().catch(error => console.error('Error fetching metrics:', error))
    }, 60000) // Update every minute
  
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#888" />
          <YAxis yAxisId="left" stroke="#888" />
          <YAxis yAxisId="right" orientation="right" stroke="#888" />
          <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="cpuUsage" stroke="#8884d8" name="CPU Usage (%)" />
          <Line yAxisId="left" type="monotone" dataKey="memoryUsage" stroke="#82ca9d" name="Memory Usage (%)" />
          <Line yAxisId="right" type="monotone" dataKey="networkIn" stroke="#ffc658" name="Network In (MB/s)" />
          <Line yAxisId="right" type="monotone" dataKey="networkOut" stroke="#ff7300" name="Network Out (MB/s)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

