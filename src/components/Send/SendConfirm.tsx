import { motion } from 'framer-motion'
import { PageContainer } from "../PageContainer";
import { useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { useLocation } from 'wouter';
import { SmoothFee } from '@/constants';
import { transferViaApi } from '@/smoothApi';
import { useWallet } from '@/hooks/useWallet';
import { usePrivy } from '@privy-io/react-auth';
import { BigNumber } from 'tronweb';
import { Hex } from 'viem';
import { addTransaction } from '@/storage';

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function SendConfirm() {
  const [, navigate] = useLocation()
  const [sending, setSending] = useState(false)
  const { tronUserAddress } = useWallet();
  const { user, signMessage } = usePrivy();
  const search = new URLSearchParams(window.location.search)

  const recipient = search.get("recipient")!
  const rawAmount = search.get("amount")!
  const amount = new BigNumber(rawAmount)

  const onSend = async () => {
    setSending(true)
    const txID = await transferViaApi({
      tronUserAddress: tronUserAddress!,
      toBase58: recipient,
      signerAddress: user?.wallet?.address! as Hex,
      transferAmount: amount,
      signMessage: (message) => signMessage(message, { showWalletUIs: false })
    })
    addTransaction(tronUserAddress!, { // add transaction to local history
      amount,
      fee: SmoothFee,
      from: tronUserAddress!,
      to: recipient,
      timestamp: Date.now(),
      txID,
    })
    navigate(`/tx-receipt?txID=${txID}&sentNow=true`)
  }

  const buttonContent = sending ? <><Loader className="animate-spin mr-2"/> Sending...</> : <>Send {rawAmount} USDT <ArrowRight size={20} className="ml-2" /></>

  return (
    <PageContainer title="Send">
      <motion.div
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Information</h3>
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">Recipient Address:</p>
            <input
              type="text"
              readOnly
              id="recipient"
              value={recipient}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192] disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">Network:</p>
            <input
              type="text"
              readOnly
              id="recipient"
              value="TRC-20"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192] disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">Amount:</p>
            <input
              type="text"
              readOnly
              id="recipient"
              value={`${rawAmount} USDT`}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192] disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-400 mb-1">Network Fee:</p>
            <input
              type="text"
              readOnly
              id="recipient"
              value={`${SmoothFee.toString()} USDT`}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192] disabled:text-gray-300"
              disabled={sending}
            />
          </motion.div>
          <motion.button
            variants={itemVariants}
            whileHover={sending ? {} : { scale: 1.05 }}
            whileTap={sending ? {} : { scale: 0.95 }}
            className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4  disabled:text-gray-300"
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