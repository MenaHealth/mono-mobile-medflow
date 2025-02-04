'use client'

import { motion } from 'framer-motion'
import { ArrowRightLeft } from 'lucide-react'

interface RotatingArrowsProps {
    isRotating?: boolean;
    size?: number;
    className?: string;
}

export function RotatingArrows({ isRotating = false, size = 20, className = "" }: RotatingArrowsProps) {
    return (
        <motion.div
            animate={{
                rotate: isRotating ? 360 : 0
            }}
            transition={{
                duration: 2,
                repeat: isRotating ? Infinity : 0,
                ease: "linear"
            }}
            className={className}
        >
            <ArrowRightLeft size={size} />
        </motion.div>
    )
}

