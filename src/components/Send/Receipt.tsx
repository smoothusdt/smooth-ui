import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Copy, Check, X } from 'lucide-react'
import { PageContainer } from '../PageContainer'
import { useWallet } from '@/hooks/useWallet'
import { getTronScanLink } from '@/util'
import { useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/hooks/usePreferences'
import { InfoTooltip } from '../shared/InfoTooltip'
import { WhatsNext } from './WhatsNext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Receipt() {
  const { t } = useTranslation("", { keyPrefix: "receiptWindow" })
  const { language } = usePreferences()
  const [copiedFields, setCopiedFields] = useState<{ [key: string]: boolean }>({})
  const { wallet, findTransaction } = useWallet();
  const [, navigate] = useLocation();

  const search = new URLSearchParams(window.location.search)
  const txID = search.get("txID")!
  const sentNow = search.get("sentNow") === "true"
  const transaction = findTransaction(txID)

  if (!transaction) return (
    <PageContainer title={t("receipt")}>
      <motion.div
        className="flex-grow flex flex-col items-center justify-start p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {t("transferNotFound")}
      </motion.div>
    </PageContainer>
  );

  const isSend = transaction && transaction.from === wallet!.tronAddress
  const counterparty = isSend ? transaction.to : transaction.from

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFields({ ...copiedFields, [field]: true })
    setTimeout(() => setCopiedFields({ ...copiedFields, [field]: false }), 2000)
  }

  let customBackComponent = undefined;
  if (sentNow) {
    customBackComponent = (
      <button onClick={() => navigate("/home")} className="text-gray-400 hover:text-white">
        <X size={24} />
      </button>
    );
  }

  return (
    <PageContainer customBackComponent={customBackComponent} title={t("receipt")}>
      <motion.div
        className="flex-grow flex flex-col items-center justify-start md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="w-full bg-gray-800 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-xl font-semibold">
                {isSend ? t("sent") : t("received")}
              </span>
            </div>
            <motion.span
              className={`text-xl font-bold ${isSend ? 'text-primary' : 'text-green-400'}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {isSend ? '-' : '+'}${transaction.amount.toFixed(2)}
            </motion.span>
          </div>
          <motion.div className="space-y-2" variants={itemVariants}>
            <p className="text-gray-400">{t("status")} <span className="text-white">{t("completed")}</span></p>
            <p className="text-gray-400">{t("date")} <span className="text-white">{new Date(transaction.timestamp).toLocaleString(language)}</span></p>
          </motion.div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="w-full bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">{t("transferDetails")}</h3>
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <p className="text-sm text-gray-400 mb-1">{isSend ? t("recipientAddress") : t("senderAddress")}</p>
              <div className="flex items-center">
                <p className="font-medium break-all flex-grow">{counterparty}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(counterparty, 'address')}
                  className="ml-2 p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedFields['address'] ? (
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
            <motion.div variants={itemVariants}>
              <div className="text-sm text-gray-400 mb-1">
                <InfoTooltip content={t("transactionIdTooltip")} />
                {t("transactionId")}
              </div>
              <div className="flex items-center">
                <p className="font-medium break-all flex-grow">{transaction.txID}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(transaction.txID, 'txHash')}
                  className="ml-2 p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedFields['txHash'] ? (
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
            {isSend && <WhatsNext />}
            <motion.a
              href={getTronScanLink(transaction.txID)}
              target="_blank"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4"
            >
              {t("viewOnTronscan")} <ExternalLink size={20} className="ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}

