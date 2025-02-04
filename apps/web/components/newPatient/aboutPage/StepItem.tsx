// components/newPatient/aboutPage/StepItem.tsx
import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Step {
    title: string;
    description: string;
}

interface StepItemProps {
    step: Step;
    index: number;
    controls: any;
    isRTL: boolean;
}

const StepItem = React.memo(function StepItem({ step, index, controls, isRTL }: StepItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ["#CCE6E7", "#66B5B7", "#056E73"]
    );

    return (
        <motion.div
            ref={ref}
            key={index}
            className={`relative flex items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'} w-full`}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
        >
            <motion.div
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-white font-bold border-2 ${isRTL ? 'ml-4' : 'mr-4'}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.4,
                    delay: 0.6 + index * 0.2,
                    ease: "easeOut",
                }}
                style={{
                    backgroundColor: useTransform(
                        scrollYProgress,
                        [0, 0.5, 1],
                        ["#CCE6E7", "#00696C", "#056E73"]
                    ),
                }}
            >
                {index + 1}
            </motion.div>
            <div className={`flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold text-lg text-gray-800 pb-1">
                    {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
            </div>
        </motion.div>
    );
});

StepItem.displayName = "StepItem";

export default StepItem;
