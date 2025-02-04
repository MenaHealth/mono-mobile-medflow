// components/PatientDashboard/PriorityDropdown.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { PRIORITIES } from '@/components/ui/Table/filters';
import { ChevronDown } from 'lucide-react';
import { CircleLoader } from "react-spinners";

interface PriorityDropdownProps {
    priority: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
}

export function PriorityDropdown({ priority, onChange, isLoading = false }: PriorityDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircleLoader size={16} color="#888888" />
                    ) : (
                        <>
                            {priority}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={priority} onValueChange={onChange}>
                    {PRIORITIES.map((p) => (
                        <DropdownMenuRadioItem key={p} value={p}>{p}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

