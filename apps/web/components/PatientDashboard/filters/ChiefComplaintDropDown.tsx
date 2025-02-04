// components/PatientDashboard/ChiefComplaintDropDown.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { ChevronsDown, ChevronsUp } from 'lucide-react';

interface ChiefComplaintDropdownProps {
    expandState: boolean;
    onChange: (value: boolean) => void;
}

export function ChiefComplaintDropdown({ expandState, onChange }: ChiefComplaintDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    {expandState ? <ChevronsDown className="h-4 w-4" /> : <ChevronsUp className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={expandState ? 'Expand All' : 'Collapse All'}
                    onValueChange={(value) => onChange(value === 'Expand All')}
                >
                    <DropdownMenuRadioItem value="Expand All">Expand All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Collapse All">Collapse All</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
