import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, QrCode, Settings } from 'lucide-react'
import { TransactionHistory } from './TransactionHistory'
import { SettingsModal } from './SettingsModal'
import { useLocation } from 'wouter'
import { useWallet } from '@/hooks/useWallet'

export function Home() {
  const [showSettings, setShowSettings] = useState(false)
  // const [balance, refreshBalance] = useUSDTBalance();
  const [, navigate] = useLocation();
  const {wallet, refreshHistory, refreshBalance} = useWallet();

  useEffect(() => {
    // Fire and forget when the page loads
    refreshBalance()
    refreshHistory()
  }, []);


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-md mx-auto min-h-screen text-white flex flex-col"
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-[#339192]"
          >
            Smooth USDT
          </motion.h1>
          <button
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={24} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-start p-4 space-y-8 overflow-y-auto w-full">
          {/* Balance Display */}
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-lg text-gray-400 mb-2">Total Balance</h2>
            <p className="text-5xl font-bold">{wallet.balance.toFixed(2)} USDT</p>
          </motion.section>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-[#339192] rounded-lg shadow-md"
              onClick={() => navigate("/send")}
            >
              <Send size={24} />
              <span>Send</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-[#339192] rounded-lg shadow-md"
              onClick={() => navigate("/receive")}
            >
              <QrCode size={24} />
              <span>Receive</span>
            </motion.button>
          </div>

          <TransactionHistory/>
        </main>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onLogout={() => {}}
        />
      </motion.div>

    </AnimatePresence>
  )
}

