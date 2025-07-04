import { motion } from "framer-motion";

interface ValueDisplayProps {
    value: string;
    unit?: string;
    title: string;
}

export function ValueDisplay({ value, unit, title }: ValueDisplayProps) {
    return (
        <div className="relative z-10 space-y-4">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <h3 className="text-sm font-semibold text-gray-600 leading-tight tracking-wide uppercase mb-2">
                    {title}
                </h3>
            </motion.div>

            {/* Value */}
            <motion.div className="flex items-baseline space-x-2">
                <motion.span
                    key={value}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                    }}
                    className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                >
                    {value}
                </motion.span>
                {unit && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-lg font-medium text-gray-500"
                    >
                        {unit}
                    </motion.span>
                )}
            </motion.div>
        </div>
    );
}
