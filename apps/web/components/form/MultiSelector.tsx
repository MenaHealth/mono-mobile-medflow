// apps/web/components/form/MultiSelector.tsx
"use client"

import { Badge } from "../ui/Badge"
import { Command, CommandItem, CommandEmpty, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { RemoveFormattingIcon as RemoveIcon, Check } from "lucide-react"
import React, {
    type KeyboardEvent,
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useState,
    type ReactNode,
    type HTMLAttributes,
    type InputHTMLAttributes,
    type RefObject,
} from "react"
import type { ForwardRefExoticComponent, RefAttributes } from "react"

// ─── FIX 1: Use HTMLAttributes<HTMLDivElement> so that children, className, dir, etc. are allowed ───

interface MultiSelectorProps extends HTMLAttributes<HTMLDivElement> {
    values: string[]
    onValuesChange: (value: string[]) => void
    loop?: boolean
}

interface MultiSelectContextProps {
    value: string[]
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (value: boolean) => void
    inputValue: string
    setInputValue: React.Dispatch<React.SetStateAction<string>>
    activeIndex: number
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>
    // ── FIX 2: Allow null in the ref type
    ref: RefObject<HTMLInputElement | null>
    handleSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null)

const useMultiSelect = () => {
    const context = useContext(MultiSelectContext)
    if (!context) {
        throw new Error("useMultiSelect must be used within MultiSelectProvider")
    }
    return context
}

const MultiSelector = ({
                           values: value,
                           onValuesChange: onValueChange,
                           loop = false,
                           className,
                           children,
                           dir,
                           ...props
                       }: MultiSelectorProps) => {
    const [inputValue, setInputValue] = useState("")
    const [open, setOpen] = useState<boolean>(false)
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [isValueSelected, setIsValueSelected] = useState(false)
    const [selectedValue, setSelectedValue] = useState("")

    const onValueChangeHandler = useCallback(
        (val: string) => {
            if (value.includes(val)) {
                onValueChange(value.filter((item) => item !== val))
            } else {
                onValueChange([...value, val])
            }
        },
        [value, onValueChange],
    )

    const handleSelect = useCallback(
        (e: React.SyntheticEvent<HTMLInputElement>) => {
            e.preventDefault()
            const target = e.currentTarget
            const selection = target.value.substring(target.selectionStart ?? 0, target.selectionEnd ?? 0)

            setSelectedValue(selection)
            setIsValueSelected(selection === inputValue)
        },
        [inputValue],
    )

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            e.stopPropagation()
            const target = inputRef.current
            if (!target) return

            const moveNext = () => {
                const nextIndex = activeIndex + 1
                setActiveIndex(nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex)
            }

            const movePrev = () => {
                const prevIndex = activeIndex - 1
                setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex)
            }

            const moveCurrent = () => {
                const newIndex = activeIndex - 1 <= 0 ? (value.length - 1 === 0 ? -1 : 0) : activeIndex - 1
                setActiveIndex(newIndex)
            }

            switch (e.key) {
                case "ArrowLeft":
                    if (dir === "rtl") {
                        if (value.length > 0 && (activeIndex !== -1 || loop)) {
                            moveNext()
                        }
                    } else {
                        if (value.length > 0 && target.selectionStart === 0) {
                            movePrev()
                        }
                    }
                    break

                case "ArrowRight":
                    if (dir === "rtl") {
                        if (value.length > 0 && target.selectionStart === 0) {
                            movePrev()
                        }
                    } else {
                        if (value.length > 0 && (activeIndex !== -1 || loop)) {
                            moveNext()
                        }
                    }
                    break

                case "Backspace":
                case "Delete":
                    if (value.length > 0) {
                        if (activeIndex !== -1 && activeIndex < value.length) {
                            onValueChangeHandler(value[activeIndex])
                            moveCurrent()
                        } else {
                            if (target.selectionStart === 0) {
                                if (selectedValue === inputValue || isValueSelected) {
                                    onValueChangeHandler(value[value.length - 1])
                                }
                            }
                        }
                    }
                    break

                case "Enter":
                    setOpen(true)
                    break

                case "Escape":
                    if (activeIndex !== -1) {
                        setActiveIndex(-1)
                    } else if (open) {
                        setOpen(false)
                    }
                    break
            }
        },
        [value, inputValue, activeIndex, loop, dir, onValueChangeHandler, selectedValue, isValueSelected, open],
    )

    return (
        <MultiSelectContext.Provider
            value={{
                value,
                onValueChange: onValueChangeHandler,
                open,
                setOpen,
                inputValue,
                setInputValue,
                activeIndex,
                setActiveIndex,
                ref: inputRef,
                handleSelect,
            }}
        >
            <CommandWithChildren
                onKeyDown={handleKeyDown}
                className={cn("overflow-visible bg-transparent flex flex-col space-y-2", className)}
                {...(dir ? { dir } : {})}
                {...props}
            >
                {children}
            </CommandWithChildren>
        </MultiSelectContext.Provider>
    )
}

// ─── MultiSelectorTrigger ───

const MultiSelectorTrigger = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        const { value, onValueChange, activeIndex } = useMultiSelect()

        const mousePreventDefault = useCallback((e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }, [])

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-wrap gap-1 p-2 rounded-md border border-input",
                    { "ring-2 ring-ring": activeIndex === -1 },
                    className,
                )}
                {...props}
            >
                {value.map((item, index) => (
                    <Badge
                        key={item}
                        className={cn("px-1 rounded-md flex items-center gap-1", activeIndex === index && "ring-2 ring-ring")}
                        variant="secondary"
                    >
                        <span className="text-xs truncate max-w-[100px]">{item}</span>
                        <button
                            aria-label={`Remove ${item} option`}
                            type="button"
                            onMouseDown={mousePreventDefault}
                            onClick={() => onValueChange(item)}
                            className="h-4 w-4 rounded-sm flex items-center justify-center hover:bg-muted"
                        >
                            <RemoveIcon className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                {children}
            </div>
        )
    },
)

MultiSelectorTrigger.displayName = "MultiSelectorTrigger"

// ─── MultiSelectorInput ───
// Because CommandPrimitive.Input’s types may not match standard JSX types,
// we “re-cast” it as an Input element. (Alternatively, you could use your own <input>.)
const CommandInput = CommandPrimitive.Input as unknown as React.ForwardRefExoticComponent<
    InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>
>
// Recast Command as a component that accepts children.
const CommandWithChildren = Command as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>

const CommandListWithChildren = CommandList as unknown as ForwardRefExoticComponent<
    HTMLAttributes<HTMLDivElement> &
    RefAttributes<HTMLDivElement> & {
    children?: ReactNode
}
>

const CommandEmptyWithChildren = CommandEmpty as unknown as React.FC<
    React.HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode
}
>

const CommandItemWithChildren = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }
>((props, ref) => <CommandItem ref={ref} {...props} />);

CommandItemWithChildren.displayName = "CommandItemWithChildren";

const MultiSelectorInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        const {
            setOpen,
            inputValue,
            setInputValue,
            activeIndex,
            setActiveIndex,
            handleSelect,
            ref: inputRef, // from context
        } = useMultiSelect()

        return (
            <CommandInput
                {...props}
                tabIndex={0}
                // Use the context’s ref; if you need to also forward the parent’s ref,
                // you might merge the two refs.
                ref={inputRef}
                value={inputValue}
                // Only allow onValueChange when nothing is “active”
                onChange={activeIndex === -1 ? (e) => setInputValue(e.currentTarget.value) : undefined}
                onSelect={handleSelect}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onClick={() => setActiveIndex(-1)}
                className={cn(
                    "flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm",
                    className,
                    activeIndex !== -1 && "caret-transparent",
                )}
            />
        )
    },
)

MultiSelectorInput.displayName = "MultiSelectorInput"

// ─── MultiSelectorContent ───

const MultiSelectorContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => {
        const { open } = useMultiSelect()
        return (
            <div ref={ref} className={cn("relative mt-2", className)} {...props}>
                {open && children}
            </div>
        )
    },
)

MultiSelectorContent.displayName = "MultiSelectorContent"

// ─── MultiSelectorList ───
// In our version, we’ll use the already typed CommandList component.
const MultiSelectorList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <CommandListWithChildren className={cn("max-h-[200px] overflow-y-auto p-1 text-sm", className)}>
                {children}
                <CommandEmptyWithChildren>
                    <span className="text-muted-foreground">No results found</span>
                </CommandEmptyWithChildren>
            </CommandListWithChildren>
        )
    },
)

MultiSelectorList.displayName = "MultiSelectorList"

// ─── MultiSelectorItem ───
const MultiSelectorItem = forwardRef<HTMLDivElement, { value: string } & HTMLAttributes<HTMLDivElement>>(
    ({ className, value, children, ...props }, ref) => {
        const { value: Options, onValueChange, setInputValue } = useMultiSelect()

        const mousePreventDefault = useCallback((e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }, [])

        const isIncluded = Options.includes(value)
        return (
            <CommandItemWithChildren
                ref={ref}
                {...props}
                onSelect={() => {
                    onValueChange(value)
                    setInputValue("")
                }}
                className={cn(
                    "cursor-pointer px-2 py-1.5 text-sm rounded-sm flex items-center justify-between",
                    className,
                    isIncluded && "opacity-50",
                )}
                onMouseDown={mousePreventDefault}
            >
                {children}
                {isIncluded && <Check className="h-4 w-4 opacity-100" />}
            </CommandItemWithChildren>
        )
    },
)

MultiSelectorItem.displayName = "MultiSelectorItem"

export {
    MultiSelector,
    MultiSelectorTrigger,
    MultiSelectorInput,
    MultiSelectorContent,
    MultiSelectorList,
    MultiSelectorItem,
}

