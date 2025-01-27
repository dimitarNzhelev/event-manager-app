"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "../components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useEffect, useState } from "react"
import type { Pod, Alert, AlertPrometheus } from "~/types"
import Link from "next/link"
import { getAllAlerts, getNamespaces, getPods } from "./actions"


export default function DashboardPage() {
  const [pods, setPods] = useState<Pod[]>([])
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const data = await getPods();
        setPods(data)
      } catch (e) {
        console.error(e);
      }
    }

    const fetchNamespaces = async () => {
      try {
        const data = await getNamespaces();
        setNamespaces(data)
      } catch (e) {
        console.error(e);
      }
    }

    const fetchAlerts = async () => {
      try {
        const data = await getAllAlerts();      
        setAlerts(data) 
      } catch (e) {
        console.error(e);
      }
    }

    fetchPods();
    fetchNamespaces();
    fetchAlerts();
  }, [])

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Cluster Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Total Pods</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-400">{pods.length}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Namespaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-400">{namespaces.length}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link href="/alerts">
              <Card className="bg-gray-800 border-gray-700 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-gray-100">Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-red-400">{alerts.length}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}

