// components/auth/adminDashboard/sections/ExistingDoctorsTriageEvacView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Minus, Edit, Search, X, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/Table/Table";
import { TableColumn } from "@/components/ui/Table/types";
import { Input } from "@/components/ui/input";
import { useExistingDoctorsAndTriageViewModel, User } from './ExistingDoctorsTriageEvacViewModel';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserProfileView } from "@/components/user-profile/UserProfileView";

export default function ExistingDoctorsTriageEvacView() {
    const {
        existingUsers,
        searchedUsers,
        loadingExistingUsers,
        handleMoveToDenied,
        isCountryVisible,
        isDoctorSpecialtyVisible,
        toggleCountryVisibility,
        toggleDoctorSpecialtyVisibility,
        handleEditUser,
        searchTerm,
        setSearchTerm,
        exportToCSV,
    } = useExistingDoctorsAndTriageViewModel();

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const columns: TableColumn<User>[] = [
        {
            key: 'name',
            header: 'Name',
            render: (value: any, user: User) => `${user.firstName} ${user.lastName}`
        },
        {
            key: 'email',
            header: 'Email',
            render: (value: string) => (
                <div className="flex items-center">
                    <span className="truncate max-w-[150px] sm:max-w-none">{value}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setSearchTerm(value)}
                    >
                        <Search className="w-4 h-4" />
                    </Button>
                </div>
            )
        },
        { key: 'accountType', header: 'User Type' },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: any, user: User) => (
                <div className="flex space-x-2">
                    <Button
                        onClick={() => handleMoveToDenied(user._id)}
                        variant="outline"
                        size="sm"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => setEditingUser(user)}
                        variant="outline"
                        size="sm"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            )
        },
        {
            key: 'approvalDate',
            header: 'Approval Date',
            render: (value: string | undefined) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            key: 'doctorSpecialty',
            header: 'Doctor Specialty',
            hidden: !isDoctorSpecialtyVisible,
            render: (value: string | undefined) => value || 'N/A'
        },
        {
            key: 'countries',
            header: 'Country',
            hidden: !isCountryVisible,
            render: (value: string[] | undefined) => value?.join(', ') || 'N/A'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
            <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <div className="relative w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder="Search by email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`w-full bg-white text-darkBlue pr-10 ${
                            isSearchFocused ? 'absolute z-10 left-0 right-0' : ''
                        }`}
                    />
                    {searchTerm && (
                        <Button
                            onClick={() => setSearchTerm('')}
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                            <X className="w-4 h-4"/>
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <Button
                        onClick={toggleCountryVisibility}
                        variant="ghost"
                        className="w-full sm:w-auto"
                    >
                        {isCountryVisible ? 'Hide Country' : 'Show Country'}
                    </Button>
                    <Button
                        onClick={toggleDoctorSpecialtyVisibility}
                        variant="ghost"
                        className="w-full sm:w-auto"
                    >
                        {isDoctorSpecialtyVisible ? 'Hide Doctor Specialty' : 'Show Doctor Specialty'}
                    </Button>
                    <Button
                        onClick={exportToCSV}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Download className="w-4 h-4 mr-2"/>
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                {loadingExistingUsers ? (
                    <div className="text-center py-4 text-orange-950 bg-orange-100">Loading users...</div>
                ) : existingUsers.length > 0 ? (
                    <Table
                        data={searchTerm ? searchedUsers : existingUsers}
                        columns={columns}
                        backgroundColor="bg-orange-100"
                        textColor="text-orange-950"
                        borderColor="border-orange-500"
                        headerBackgroundColor="bg-orange-200"
                        headerTextColor="text-orange-950"
                        hoverBackgroundColor="hover:bg-white"
                        hoverTextColor="hover:text-darkBlue"
                    />
                ) : (
                    <div className="text-center py-4 text-orange-950 bg-orange-100">
                        No existing users found.
                    </div>
                )}
            </div>

            {editingUser && (
                <Dialog
                    open={!!editingUser}
                    onOpenChange={(open) => {
                        if (!open) setEditingUser(null);
                    }}
                >
                    <DialogContent className={'bg-gradient-to-t from-white to-orange-100'}>
                        <DialogTitle className={'text-center text-darkBlue'}>
                            {`Admin Edit: ${editingUser.firstName} ${editingUser.lastName}`}
                        </DialogTitle>
                        <UserProfileView
                            isAdmin={true}
                            userId={editingUser._id}
                            key={editingUser._id}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}