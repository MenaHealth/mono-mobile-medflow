// components/PatientDashboard/StatusDropdown.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { STATUS } from '@/components/ui/Table/filters';
import { ChevronDown } from 'lucide-react';
import { CircleLoader } from "react-spinners";

interface StatusDropdownProps {
    status: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
}

export function StatusDropdown({ status, onChange, isLoading = false }: StatusDropdownProps) {
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
                            {status ?? 'Not Started'}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={status} onValueChange={onChange}>
                    {STATUS.map((s) => s !== 'Archived' && (
                        <DropdownMenuRadioItem key={s} value={s}>{s}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
