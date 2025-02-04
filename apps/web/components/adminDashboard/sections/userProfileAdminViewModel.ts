// components/adminDashboard/sections/userProfileAdminViewModel.ts

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserProfileFormValues, userProfileSchema, UserProfileViewModel } from "@/components/user-profile/UserProfileViewModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useToast } from '@/components/hooks/useToast';
import {DoctorSpecialtyList} from "@/data/doctorSpecialty.enum";

export function useUserProfileAdminViewModel(userId?: string): UserProfileViewModel {
    const { data: session } = useSession();
    const { setToast } = useToast();
    const methods = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
    });
    const [profile, setProfile] = useState<UserProfileFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [specialties, setSpecialties] = useState<string[]>([]); // Add specialties state


    const fetchProfile = useCallback(async () => {
        if (userId && session?.user?.token) {
            setIsLoading(true);
            setStatus('loading');
            try {
                const res = await fetch(`/api/admin/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`,
                    }
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await res.json();
                setProfile(data);
                setSpecialties(data.doctorSpecialty || []); // Set specialties
                methods.reset(data);
                setStatus('success');
            } catch (error) {
                console.error('Error fetching user:', error);
                setStatus('error');
            } finally {
                setIsLoading(false);
            }
        } else {
            setStatus('error');
        }
    }, [userId, session?.user?.token, methods]);

    // Add useEffect to call fetchProfile when component mounts or userId/session changes
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile, userId, session?.user?.token]);

    const handleEdit = useCallback(() => setIsEditing(true), []);

    const handleCancelEdit = useCallback(() => {
        setIsEditing(false);
        methods.reset(profile || undefined);
    }, [methods, profile]);

    const handleSpecialtyChange = useCallback((index: number, value: DoctorSpecialtyList) => {
        setSpecialties((prevSpecialties) => {
            const updatedSpecialties = [...prevSpecialties]
            updatedSpecialties[index] = value
            return updatedSpecialties
        })
    }, [])

    const handleSubmit = useCallback(async (data: UserProfileFormValues) => {
        if (!session?.user?.token) {
            setToast({
                title: 'Error',
                description: 'No authorization token available.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/user/${data._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                methods.reset(updatedProfile);
                setToast({
                    title: 'Success',
                    description: 'User updated successfully.',
                    variant: 'default',
                });
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setToast({
                    title: 'Error',
                    description: errorData.message || 'Failed to update user.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            setToast({
                title: 'Error',
                description: error.message || 'Failed to update user.',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    }, [session?.user?.token, setToast, methods]);

    const copyToClipboard = useCallback(() => {
        if (profile) {
            navigator.clipboard.writeText(profile._id).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    }, [profile]);

    const handleLinkGoogleAccount = useCallback(() => {
        console.warn('Linking Google account is not available in admin view');
    }, []);

    const handleUnlinkGoogleAccount = useCallback(() => {
        console.warn('Unlinking Google account is not available in admin view');
    }, []);

    const handleRemoveSpecialty = useCallback(
        async (specialty: string) => {
            if (!profile || !specialty) return;

            setIsLoading(true);

            try {
                const response = await fetch(`/api/admin/user/${profile._id}/remove-specialty`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ specialty }),
                });

                if (response.ok) {
                    const updatedProfile = await response.json();
                    setProfile(updatedProfile);
                    setSpecialties(updatedProfile.doctorSpecialty || []); // Update specialties
                } else {
                    console.error('Failed to remove specialty');
                }
            } catch (error) {
                console.error('Error removing specialty:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [profile]
    );

    return {
        setProfile,
        profile,
        specialties,
        setSpecialties,
        handleSpecialtyChange,
        handleRemoveSpecialty,
        isEditing,
        isLoading,
        isCopied,
        methods,
        handleEdit,
        handleCancelEdit,
        handleSubmit,
        copyToClipboard,
        status,
        googleImage: profile?.googleImage || '',
        googleEmail: profile?.googleEmail || '',
        googleId: profile?.googleId || '',
        handleLinkGoogleAccount,
        handleUnlinkGoogleAccount,
    };
}



