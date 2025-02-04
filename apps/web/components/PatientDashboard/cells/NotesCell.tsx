import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Edit, Check, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { TextFormField } from '@/components/ui/TextFormField';
import { useSession } from 'next-auth/react';

type AccountType = 'Doctor' | 'Triage' | 'Evac';

interface NotesCellProps {
    notes: string;
    onUpdate: (notes: string) => void;
    drawerColor: string;
    badgeColor: string;
    iconTextColor: string;
    iconBackgroundColor: string;
}

export const NotesCell: React.FC<NotesCellProps> = ({
    notes,
    onUpdate,
    drawerColor,
    badgeColor,
    iconTextColor,
    iconBackgroundColor,
}) => {
    const { data: session } = useSession();
    const accountType = session?.user?.accountType as AccountType;

    const [isOpen, setIsOpen] = useState(false);
    const [savedNote, setSavedNote] = useState(notes);

    const methods = useForm({
        defaultValues: { notes },
    });

    useEffect(() => {
        setSavedNote(notes);
    }, [notes]);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => setIsOpen(false);

    const handleSave = (data: { notes: string }) => {
        if (accountType === 'Triage') {
            onUpdate(data.notes);
            setSavedNote(data.notes);
        }
        handleClose();
    };

    // Determine permissions based on account type
    const isDoctor = accountType === 'Doctor';
    const isTriage = accountType === 'Triage';

    return (
        <>
            <td className="relative">
                <div className="flex items-center justify-center space-x-2">
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`p-2 bg-${iconBackgroundColor} hover:bg-opacity-80 transition-colors duration-200`}
                            onClick={handleOpen}
                        >
                            {savedNote ? (
                                <>
                                    <FileText className={`h-5 w-5 text-${iconTextColor}`} />
                                    <div
                                        className={`absolute -top-2 -right-2 flex items-center justify-center bg-${badgeColor} text-white rounded-full`}
                                        style={{ width: '18px', height: '18px' }}
                                    >
                                        <span className="text-xs font-bold">!</span>
                                    </div>
                                </>
                            ) : (
                                <Edit className={`h-5 w-5 text-${iconTextColor}`} />
                            )}
                        </Button>
                    </div>
                </div>
            </td>

            <Drawer isOpen={isOpen} onClose={handleClose}>
                <DrawerContent size="80%" className={`bg-white`}>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSave)}>
                            <DrawerHeader>
                                <DrawerTitle>{isTriage ? 'Edit Notes' : 'View Notes'}</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4">
                                {savedNote && (
                                    <div className="mb-4 p-3 border border-gray-300 rounded-md bg-gray-50">
                                        <strong>{isTriage ? 'Previously Saved Note:' : 'Note from Triage:'}</strong>
                                        <p>{savedNote}</p>
                                    </div>
                                )}

                                {isTriage && (
                                    <TextFormField
                                        fieldName="notes"
                                        fieldLabel="Notes"
                                        multiline
                                        rows={5}
                                        value={methods.watch('notes')}
                                        onChange={(e) => methods.setValue('notes', e.target.value)}
                                    />
                                )}
                            </div>
                            <DrawerFooter>
                                <Button type="button" variant="outline" onClick={handleClose}>
                                    <X className="mr-2 h-4 w-4" />
                                    {isTriage ? 'Cancel' : 'Close'}
                                </Button>
                                {isTriage && (
                                    <Button className={'mb-4'} type="submit">
                                        <Check className="mr-2 h-4 w-4" />
                                        Save
                                    </Button>
                                )}
                            </DrawerFooter>
                        </form>
                    </FormProvider>
                </DrawerContent>
            </Drawer>
        </>
    );
};
