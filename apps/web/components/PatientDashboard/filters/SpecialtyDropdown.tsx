// components/PatientDashboard/filters/SpecialtyDropdown.tsx
import React from "react"
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum"
import { CircleLoader } from "react-spinners"
import { SingleChoiceFormField } from "@/components/form/SingleChoiceFormField"

interface SpecialtyDropdownProps {
    specialty: DoctorSpecialtyList | "Not Selected"
    onChange: (value: DoctorSpecialtyList) => void
    isLoading: boolean
    disabled: boolean
}

export function SpecialtyDropdown({ specialty, onChange, isLoading, disabled }: SpecialtyDropdownProps) {
    if (isLoading) {
        return <CircleLoader size={16} color="#888888" />
    }

    return (
        <SingleChoiceFormField
            fieldName="specialty"
            fieldLabel="Specialty"
            choices={Object.values(DoctorSpecialtyList)}
            value={specialty}
            onChange={(value) => onChange(value as DoctorSpecialtyList)}
            disabled={disabled}
        />
    )
}

