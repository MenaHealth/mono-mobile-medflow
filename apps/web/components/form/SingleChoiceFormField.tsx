import React, { useState, useCallback } from "react"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useFormContext, Controller } from "react-hook-form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/utils/classNames"
import {DoctorSpecialtyList} from "@/data/doctorSpecialty.enum";

interface SingleChoiceFormFieldProps {
    fieldName: string
    fieldLabel?: string
    choices: string[] | DoctorSpecialtyList[];
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
    className?: string // New prop for additional class names
}

export function SingleChoiceFormField({
                                          fieldName,
                                          fieldLabel,
                                          choices,
                                          value: propValue,
                                          onChange: propOnChange,
                                          disabled = false,
                                          className, // Destructure the new prop
                                      }: SingleChoiceFormFieldProps) {
    const formContext = useFormContext()
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredChoices = choices.filter((choice) => choice.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleSelect = useCallback(
        (selectedChoice: string) => {
            if (propOnChange) {
                propOnChange(selectedChoice)
            }
            setOpen(false)
        },
        [propOnChange],
    )

    const renderField = ({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
        <FormItem className="flex flex-col">
            {fieldLabel && <FormLabel>{fieldLabel}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <div
                            className={cn(
                                "w-full p-2 border rounded-md bg-white text-left flex justify-between items-center",
                                !field.value && "text-muted-foreground",
                                "min-h-[40px]",
                                disabled && "opacity-50 cursor-not-allowed pointer-events-none", // Add pointer-events-none
                                className
                            )}
                            style={{
                                whiteSpace: "pre-wrap",
                                overflowWrap: "break-word",
                                wordWrap: "break-word",
                                maxHeight: "200px",
                                overflowY: "auto",
                            }}
                            // Remove onClick logic entirely when disabled
                            onClick={!disabled ? () => setOpen(true) : undefined}
                            role="combobox"
                            aria-expanded={!disabled && open ? true : false} // Reflect ARIA states correctly
                            aria-controls={`listbox-${fieldName}`}
                        >
                            <span>{field.value || `Select ${fieldLabel || "option"}`}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </div>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" id={`listbox-${fieldName}`}>
                    <Command>
                        {choices.length >= 10 && (
                            <CommandInput
                                placeholder={`Search ${fieldLabel?.toLowerCase() || "option"}...`}
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                            />
                        )}
                        <CommandList>
                            <CommandEmpty>No {fieldLabel?.toLowerCase() || "option"} found.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-72">
                                    {filteredChoices.map((choice) => (
                                        <CommandItem
                                            key={choice}
                                            onSelect={() => {
                                                field.onChange(choice)
                                                handleSelect(choice)
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", field.value === choice ? "opacity-100" : "opacity-0")} />
                                            {choice}
                                        </CommandItem>
                                    ))}
                                </ScrollArea>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    )

    if (formContext) {
        return <Controller control={formContext.control} name={fieldName} render={renderField} />
    }

    // Fallback for cases where FormProvider is not available
    return renderField({ field: { value: propValue || "", onChange: propOnChange || (() => {}) } })
}