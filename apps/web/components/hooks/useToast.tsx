// components/hooks/useToast.ts
import React, { createContext, useContext, useState, useCallback } from 'react';
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/utils/classNames"
import {createApiWrapper} from "@/utils/apiWrapper";

export type ToastProps = {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success' | 'error';
};

type ToastContextType = {
    toast: ToastProps | null;
    setToast: (toast: ToastProps | null) => void;
    api: ReturnType<typeof createApiWrapper>; // Add the `api` property
};

export const ToastContext = createContext<ToastContextType>({
    toast: null,
    setToast: () => {}, // Default no-op function
    api: createApiWrapper(() => {}), // Provide a default API wrapper
});

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const useToastState = () => {
    const [toast, setToastState] = useState<ToastProps | null>(null);

    const setToast = useCallback((newToast: ToastProps | null) => {
        setToastState(newToast);
        if (newToast) {
            setTimeout(() => setToastState(null), 5000);
        }
    }, []);

    return { toast, setToast };
};

export const ToastComponent: React.FC = () => {
    const { toast, setToast } = useToast();

    return (
        <ToastPrimitives.Provider>
            {toast && (
                <ToastPrimitives.Root
                    className={cn(
                        "fixed bottom-4 right-4 z-[9999] flex items-center justify-between space-x-4 rounded-lg p-6 shadow-2xl transition-transform",

                        // Shared styles for all non-destructive toasts
                        "border-t-2 border-l-2 drop-shadow-lg bg-white",

                        toast.variant === 'destructive' &&
                        "border-orange-700 text-orange-700",

                        toast.variant === 'error' &&
                        "border-orange-900 text-orange-900",

                        toast.variant === 'success' &&
                        "border-orange-500 text-orange-500",

                        toast.variant === 'default' &&
                        "border-darkBlue text-darkBlue"
                    )}
                >
                    <div className="grid gap-1">
                        {toast.title && <ToastPrimitives.Title className="text-sm font-semibold">{toast.title}</ToastPrimitives.Title>}
                        {toast.description && <ToastPrimitives.Description className="text-sm opacity-90">{toast.description}</ToastPrimitives.Description>}
                    </div>
                    <ToastPrimitives.Close
                        className="rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                        onClick={() => setToast(null)}
                    >
                        <X className="h-4 w-4" />
                    </ToastPrimitives.Close>
                </ToastPrimitives.Root>
            )}
            <ToastPrimitives.Viewport />
        </ToastPrimitives.Provider>
    );
};