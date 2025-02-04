import React from 'react';
import { BlankNote } from '../CombinedNotesViewModel';
import {TextFormField} from "../../../ui/TextFormField";
import {ScrollArea} from "../../../ui/scroll-area";

interface BlankNoteViewProps {
    note: BlankNote;
    onChange: (name: string, value: string) => void;
}

export const BlankNoteView: React.FC<BlankNoteViewProps> = ({ note, onChange }) => {
    return (
        <div className="space-y-4">
            <ScrollArea className="h-full w-full">
            <TextFormField
                fieldName="date"
                fieldLabel="Date"
                value={note.date}
                onChange={(e) => onChange('date', e.target.value)}
                type="date"
            />
            <TextFormField
                fieldName="time"
                fieldLabel="Time"
                value={note.time}
                onChange={(e) => onChange('time', e.target.value)}
                type="time"
            />
            <TextFormField
                fieldName="noteField"
                fieldLabel="Note"
                value={note.noteField}
                onChange={(e) => onChange('noteField', e.target.value)}
            />
            </ScrollArea>
        </div>
    );
};