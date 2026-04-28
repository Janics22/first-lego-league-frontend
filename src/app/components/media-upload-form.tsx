'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MediaUploadForm({ editionId }: { editionId: string }) {
    const router = useRouter();
    const [rows, setRows] = useState([{ url: '', type: 'IMAGE' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addRow = () => setRows([...rows, { url: '', type: 'IMAGE' }]);
    
    const removeRow = (index: number) => {
        if (rows.length > 1) setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: 'url' | 'type', value: string) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`/editions/${editionId}/media/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rows),
            });

            if (response.ok) {
                alert('Media uploaded successfully!');
                router.refresh(); 
            } else {
                throw new Error('Failed to upload media');
            }
        } catch (error) {
            alert('Error: ' + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {rows.map((row, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <input className="border p-2 rounded" placeholder="URL" value={row.url} onChange={(e) => updateRow(index, 'url', e.target.value)} required />
                    <select className="border p-2 rounded" value={row.type} onChange={(e) => updateRow(index, 'type', e.target.value)}>
                        <option value="IMAGE">IMAGE</option>
                        <option value="VIDEO">VIDEO</option>
                    </select>
                    <button type="button" className="text-red-500" onClick={() => removeRow(index)}>Delete</button>
                </div>
            ))}
            <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={addRow}>+ Add Row</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded ml-2" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Submit Batch'}
            </button>
        </form>
    );
}