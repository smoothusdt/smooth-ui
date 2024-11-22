import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check } from 'lucide-react'
import { PageContainer } from './PageContainer'

export function Receive() {
  const [copied, setCopied] = useState(false)
  const walletAddress = 'TRX1234567890123456789012345678901234' // Replace with actual wallet address

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageContainer title="Receive USDT">
      <div className="flex-grow flex flex-col items-center justify-start p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 rounded-lg mb-6"
        >
          <QRCodeSVG value={walletAddress} size={200} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="text-center mb-4"
        >
          Show this QR code to receive USDT
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-gray-800 p-4 rounded-lg w-full mb-4"
        >
          <p className="text-sm text-gray-400 mb-1">Your wallet address:</p>
          <p className="font-medium break-all">{walletAddress}</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <Check size={20} className="mr-2" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <Copy size={20} className="mr-2" />
                Copy Address
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </PageContainer>
  )
}

