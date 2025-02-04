"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AnimatedLogo() {
    return (
        <motion.div
            className="w-48 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
        >
            <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
            />
            <motion.div
                className="relative"
                whileHover={{
                    filter: "drop-shadow(0 0 8px rgba(5, 110, 115, 0.3))",
                }}
                transition={{ duration: 0.3 }}
            >
                <Image
                    src="/assets/images/mena_health_logo.svg"
                    alt="MENA Health Logo"
                    width={192}
                    height={48}
                    className="relative z-10 mt-48"
                    priority
                />
            </motion.div>
        </motion.div>
    )
}

