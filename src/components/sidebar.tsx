import Link from "next/link"
import { Home, OctagonMinus, BellOff, Bell, Server } from 'lucide-react'
import { motion } from "framer-motion"

const menuItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/alert-rules", icon: OctagonMinus, label: "Alert Rules" },
  { href: "/pods", icon: Server, label: "Pods" },
  { href: "/active-alerts", icon: Bell, label: "Active Alerts" },
  { href: "/silenced-alerts", icon: BellOff, label: "Silenced Alerts" },
  { href: "/all-alerts", icon: Bell, label: "All Alerts" },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-100">Admin Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

