// components/ui/Spotlight.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightProps = {
    className?: string;
    fill?: string;
    isInView: boolean;
};

export const Spotlight = ({ className, fill, isInView }: SpotlightProps) => {
    return (
        <motion.div
            className={cn("absolute inset-0 pointer-events-none", className)}
            initial={{ opacity: 0, x: 200, y: -100 }}
            animate={isInView ? { opacity: 1, x: 0, y: -50 } : { opacity: 0, x: 200, y: -100 }}
            transition={{ duration: 1 }}
        >
            <svg
                className="absolute w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3787 2842"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
            >
                <g filter="url(#filter)">
                    <ellipse
                        cx="1924.71"
                        cy="273.501"
                        rx="1924.71"
                        ry="273.501"
                        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                        fill={fill || "#66B5B7"}
                        fillOpacity="0.15"
                    ></ellipse>
                </g>
                <defs>
                    <filter
                        id="filter"
                        x="0.860352"
                        y="0.838989"
                        width="3785.16"
                        height="2840.26"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        ></feBlend>
                        <feGaussianBlur
                            stdDeviation="151"
                            result="effect1_foregroundBlur_1065_8"
                        ></feGaussianBlur>
                    </filter>
                </defs>
            </svg>
        </motion.div>
    );
};