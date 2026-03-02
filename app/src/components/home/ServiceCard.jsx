import { motion } from 'framer-motion';

export default function ServiceCard({ title, desc, Icon }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(27, 42, 74, 0.08)' }}
      className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm transition-colors group cursor-default h-full"
    >
      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-navy to-blue flex items-center justify-center mb-5 group-hover:from-gold group-hover:to-gold-light transition-all duration-300">
        <Icon className="w-6 h-6 text-white group-hover:text-navy transition-colors duration-300" />
      </div>
      <h3 className="text-navy font-bold text-lg mb-2">{title}</h3>
      <p className="text-text-light text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
