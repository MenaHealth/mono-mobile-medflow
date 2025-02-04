// components/adminDashboard/AdminDashboardView.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import NewSignupsView from './sections/NewSignupsView';
import DeniedDoctorsAndTriage from './sections/DeniedDoctorsTriageEvacView';
import ExistingDoctorsTriageEvacView from './sections/ExistingDoctorsTriageEvacView';
import MedOrdersView from './sections/MedOrdersView';
import ForgotPasswordView from "@/components/adminDashboard/sections/ForgotPasswordView";
import AdminManagement from "@/components/adminDashboard/sections/AdminManagementView";
import ChangeAccountTypeView from "./sections/ChangeAccountTypeView";
import { Loader2, RefreshCw, Users, UserCheck, UserX, BriefcaseMedical, ShieldCheck, RotateCcw, ArrowRightLeft, Search, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Tooltip from "@/components/form/Tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const sections = [
    { id: 'newSignups', title: 'New Signups', icon: Users, color: 'bg-orange-50 text-orange-800', component: NewSignupsView },
    { id: 'existing', title: 'Existing Doctors, Triage and Evac', icon: UserCheck, color: 'bg-orange-100 text-orange-500', component: ExistingDoctorsTriageEvacView },
    { id: 'denied', title: 'Denied Doctors, Triage and Evac', icon: UserX, color: 'bg-gray-100 text-gray-800', component: DeniedDoctorsAndTriage },
    { id: 'addAdmin', title: 'Admin Management', icon: ShieldCheck, color: 'bg-darkBlue text-orange-100', component: AdminManagement },
    { id: 'pwReset', title: 'Password Reset', icon: RotateCcw, color: 'bg-orange-800 text-white', component: ForgotPasswordView },
    { id: 'medOrder', title: 'Medical Orders', icon: BriefcaseMedical, color: 'bg-orange-950 text-white', component: MedOrdersView },
    { id: 'changeAcctType', title: 'Change Account Type', icon: ArrowRightLeft, color: 'bg-gray-200 text-gray-900', component: ChangeAccountTypeView },
] as const;

type Section = (typeof sections)[number];

const AdminDashboardContent = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSections, setFilteredSections] = useState<Section[]>([...sections]);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const filtered = sections.filter(section =>
            section.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSections(filtered);
    }, [searchTerm]);

    const handleToggleSection = (sectionId: typeof sections[number]['id']) => {
        setOpenSection(prev => prev === sectionId ? null : sectionId);
    };

    const handleRefreshAll = () => {
        setIsRefreshing(true);
        // Implement refresh logic for all sections
        setTimeout(() => setIsRefreshing(false), 1000); // Simulated refresh
    };

    const renderSection = (section: Section) => {
        const isOpen = openSection === section.id;
        const SectionComponent = section.component;

        return (
            <div key={section.id} id={section.id} className="mb-6 rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
                <div className={`sticky top-0 z-10 ${section.color}`}>
                    <button
                        className="w-full p-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        onClick={() => handleToggleSection(section.id)}
                        aria-expanded={isOpen}
                        aria-controls={`content-${section.id}`}
                    >
                        <div className="flex items-center">
                            <section.icon className="mr-2 h-5 w-5" />
                            <h2 className="text-xl font-semibold">{section.title}</h2>
                        </div>
                        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}> ▼ </span>
                    </button>
                </div>
                <div
                    id={`content-${section.id}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className={`p-4 ${section.color}`}>
                        {isOpen && <SectionComponent isDialog={false} />}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold text-darkBlue">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search sections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <Tooltip tooltipText="Refresh all sections" showTooltip={showTooltip}>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefreshAll}
                            disabled={isRefreshing}
                            className="text-orange-500 hover:border-orange-500 border-transparent border-2 focus:outline-none focus:border-orange-500"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin"/>
                            ) : (
                                <RefreshCw className="h-4 w-4"/>
                            )}
                        </Button>
                    </Tooltip>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <HelpCircle className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Admin Dashboard Help</DialogTitle>
                                <DialogDescription>
                                    This dashboard allows you to manage various aspects of the system. Click on each section to expand and view details. Use the search bar to quickly find specific sections.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {filteredSections.map(section => renderSection(section))}

            {filteredSections.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No sections match your search.</p>
            )}
        </div>
    );
};

const AdminDashboardView = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AdminDashboardContent />
        </QueryClientProvider>
    );
};

export default AdminDashboardView;
