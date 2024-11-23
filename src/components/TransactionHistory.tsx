import { HistoricalTransaction } from '@/chainQuery';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/util';
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useLocation } from 'wouter';

function TransactionComponent(props: { transaction: HistoricalTransaction, index: number }) {
  const [, navigate] = useLocation()
  const { wallet } = useWallet();

  const isSend = props.transaction.from === wallet!.tronAddress
  const counterpaty = isSend ? props.transaction.to : props.transaction.from

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: props.index * 0.1 }}
      className="flex items-center justify-between bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors mb-2"
      onClick={() => navigate(`/tx-receipt?txID=${props.transaction.txID}`)}
    >
      <div className="flex items-center space-x-3">
        {isSend ? (
          <ArrowUpRight size={20} className="text-white" />
        ) : (
          <ArrowDownLeft size={20} className="text-green-400" />
        )}
        <div>
          <p className="font-medium">{isSend ? 'Sent' : 'Received'}</p>
          <p className="text-sm text-gray-400">{shortenAddress(counterpaty)}</p>
        </div>
      </div>
      <span className={`font-semibold ${isSend ? 'text-white' : 'text-green-400'}`}>
        {isSend ? '-' : '+'}${props.transaction.amount.toFixed(2)}
      </span>
    </motion.div>
  );
}

export function TransactionHistory() {
  const { wallet } = useWallet();

  let historyBlock;
  if (wallet.history.length === 0) {
    historyBlock = (
      <p className="text-muted-foreground text-center">Your transfers will be displayed here</p>
    );
  } else {
    historyBlock = (
      wallet.history.map((transaction, index) => (
        <TransactionComponent key={index} transaction={transaction} index={index} />
      ))
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#339192]">Recent Transfers</h2>
      </div>
      <AnimatePresence>
        {historyBlock}
      </AnimatePresence>
    </motion.section>
  );
}