'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [team, setTeam] = useState(searchParams.get('teamName') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (team) params.set('teamName', team);
        else params.delete('teamName');
        router.push(`/scientific-projects?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input 
                type="text" 
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Search by team name..."
                className="border p-2 rounded-md w-full max-w-sm"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Search</button>
        </form>
    );
}