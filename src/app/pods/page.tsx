'use client'
import React from 'react';
import {Sidebar} from '~/components/sidebar';
import {motion} from 'framer-motion';
import {PodList} from '~/components/pod-list';
import { useEffect, useState } from 'react';
import { PodStatistics } from '~/components/pod-statistics';
import { Pod } from '~/types';

export default function PodsPage() {
    const [pods, setPods] = useState<Pod[]>([])

    useEffect(() => {
        const fetchPods = async () => {
            try {
                const response = await fetch('api/pods')
                const data = await response.json()
                setPods(data)
            } catch (e) {
                console.error(e);
            }
        }
        fetchPods();
    }, [])
    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-semibold text-gray-100 mb-6">Pods Overview</h1>
              <PodStatistics pods={pods} />
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Pod List</h2>
                <PodList pods={pods} />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
}