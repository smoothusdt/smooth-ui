import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check } from 'lucide-react'
import { PageContainer } from './PageContainer'
import { useWallet } from '@/hooks/useWallet'
import { useTranslation } from 'react-i18next'

export function Receive() {
  const { t } = useTranslation("", { keyPrefix: "receiveWindow" })
  const [copied, setCopied] = useState(false);
  const { wallet } = useWallet();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet.tronAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageContainer title={t("receiveUsdt")}>
      <div className="flex-grow flex flex-col items-center justify-start p-4 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 rounded-lg mb-6"
        >
          <QRCodeSVG value={wallet.tronAddress} size={200} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="text-center mb-4"
        >
          {t("walletQrLabel")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-gray-800 p-4 rounded-lg w-full mb-4"
        >
          <p className="text-sm text-gray-400 mb-1">{t("yourWalletAddress")}</p>
          <div className="flex items-center">
            <p className="font-medium break-all flex-grow">{wallet.tronAddress}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={copyToClipboard}
              className="ml-2 p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check size={16} className="text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
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
            <motion.div
              key="copy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              {copied ?
                <><Check size={20} className="mr-2" />{t("copied")}</> :
                <><Copy size={20} className="mr-2" />{t("copyAddress")}</>
              }
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </PageContainer>
  )
}

