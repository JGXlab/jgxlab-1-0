import { motion } from 'framer-motion';

interface StatusLegendProps {
  data: Array<{
    name: string;
    percentage: string;
  }>;
  colors: string[];
}

export const StatusLegend = ({ data, colors }: StatusLegendProps) => {
  return (
    <motion.div 
      className="grid grid-cols-2 gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {data.map((item, index) => (
        <motion.div 
          key={item.name}
          className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="font-medium text-sm">{item.name}</span>
          </div>
          <span className="text-sm text-gray-600">{item.percentage}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};