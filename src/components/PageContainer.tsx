import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'


export function PageContainer(props: { title: string; children: any; customBackComponent?: JSX.Element }) {
   const backButton = (
      <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white">
         <ArrowLeft size={24} />
      </button>
   );
   
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="h-full text-white flex flex-col max-w-md mx-auto pb-4 px-4"
      >
         <div className="flex justify-between items-center p-4 pl-0">
            {props.customBackComponent ? props.customBackComponent : backButton}
            <h2 className="text-2xl font-bold text-[#339192]">{props.title}</h2>
            <div className="w-6"></div> {/* Spacer for alignment */}
         </div>
         {props.children}
      </motion.div>
   );
}