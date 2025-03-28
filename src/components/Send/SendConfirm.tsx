import { motion } from 'framer-motion'
import { PageContainer } from "../PageContainer";
import { useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { useLocation } from 'wouter';
import { transferViaApi } from '@/smoothApi';
import { useWallet } from '@/hooks/useWallet';
import { BigNumber } from 'tronweb';
import { useTranslation } from 'react-i18next';
import { useSigner } from '@/hooks/useSigner';
import { InfoTooltip } from '../shared/InfoTooltip';
import { itemVariants, stepVariants } from '../animations';

export function SendConfirm() {
  const { t } = useTranslation("", { keyPrefix: "sendFlow" })
  const [, navigate] = useLocation()
  const [sending, setSending] = useState(false)
  const { signTransaction } = useSigner();
  const { wallet, addTransactions, refreshBalance } = useWallet();
  const search = new URLSearchParams(window.location.search)

  const recipient = search.get("recipient")!
  const rawTransferAmount = search.get("transferAmount")!
  const rawFeeAmount = search.get("feeAmount")!

  const transferAmount = new BigNumber(rawTransferAmount)
  const feeAmount = new BigNumber(rawFeeAmount)
  const totalAmount = transferAmount.plus(feeAmount)

  const onSend = async () => {
    setSending(true)
    const txID = await transferViaApi({
      toBase58: recipient,
      transferAmount: transferAmount,
      feeAmount: feeAmount,
      userAddress: wallet.tronAddress,
      signTransaction,
    })
    addTransactions([{ // add this transaction to local history
      amount: transferAmount,
      fee: feeAmount,
      from: wallet.tronAddress,
      to: recipient,
      timestamp: Date.now(),
      txID,
    }])
    refreshBalance()
    navigate(`/tx-receipt?txID=${txID}&sentNow=true`)
  }

  const buttonContent = sending ? <><Loader className="animate-spin mr-2" /> {t("sending")}</> : <>{t("send")} {rawTransferAmount} USDT <ArrowRight size={20} className="ml-2" /></>

  return (
    <PageContainer title={t("sendUsdt")}>
      <motion.div
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">{t("confirmTransfer")}</h3>
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">{t("recipientAddress")}</p>
            <input
              type="text"
              readOnly
              id="recipient"
              value={recipient}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="text-sm text-gray-400 mb-1">
              <InfoTooltip content={t("networkTooltip")} />
              {t("network")}
            </div>
            <input
              type="text"
              readOnly
              id="networkTitle"
              value="TRC-20"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">{t("amount")}</p>
            <input
              type="text"
              readOnly
              id="amount"
              value={`${rawTransferAmount} USDT`}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="text-sm text-gray-400 mb-1">
              <InfoTooltip content={t("networkFeeTooltip")} />
              {t("networkFee")}
            </div>
            <input
              type="text"
              readOnly
              id="networkFee"
              value={`${feeAmount.toString()} USDT`}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">{t("total")}</p>
            <input
              type="text"
              readOnly
              id="totalAmount"
              value={`${totalAmount.toString()} USDT`}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.button
            variants={itemVariants}
            whileHover={sending ? {} : { scale: 1.05 }}
            whileTap={sending ? {} : { scale: 0.95 }}
            className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4 disabled:bg-[#2a7475] disabled:text-gray-300"
            onClick={onSend}
            disabled={sending}
          >
            {buttonContent}
          </motion.button>
        </div>
      </motion.div>
    </PageContainer>
  );
}