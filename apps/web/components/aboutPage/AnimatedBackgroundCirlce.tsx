"use client"

import { motion } from "framer-motion"
import clsx from "clsx"

interface AnimatedBackgroundCircleProps {
    variant?: "light" | "medium" | "dark"
}

const COLOR_VARIANTS = {
    light: {
        border: ["border-orange-100/40", "border-orange-200/30", "border-orange-300/20"],
        gradient: "from-orange-100/20",
    },
    medium: {
        border: ["border-orange-200/40", "border-orange-300/30", "border-orange-400/20"],
        gradient: "from-orange-200/20",
    },
    dark: {
        border: ["border-orange-300/40", "border-orange-400/30", "border-orange-500/20"],
        gradient: "from-orange-300/20",
    },
} as const

export function AnimatedBackgroundCircle({ variant = "medium" }: AnimatedBackgroundCircleProps) {
    const variantStyles = COLOR_VARIANTS[variant]

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="relative"
                    style={{
                        width: "100vmin",
                        height: "100vmin",
                        maxWidth: "485px",
                        maxHeight: "485px",
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={clsx(
                                "absolute inset-0 rounded-full",
                                "border-2 bg-gradient-to-br to-transparent",
                                variantStyles.border[i],
                                variantStyles.gradient,
                            )}
                            animate={{
                                rotate: 360,
                                scale: [1, 1.05 + i * 0.05, 1],
                                opacity: [0.6, 0.8, 0.6],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <div
                                className={clsx(
                                    "absolute inset-0 rounded-full mix-blend-screen",
                                    `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient
                                        .replace("from-", "")
                                        .replace("/20", "/10")},transparent_70%)]`,
                                )}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

