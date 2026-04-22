'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { updateTeam } from '@/app/teams/new/actions';
import { TEAM_CATEGORY_OPTIONS, Team } from '@/types/team';

interface TeamEditSectionProps {
    readonly team: Team;
}

export default function TeamEditSection({ team }: TeamEditSectionProps) {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);

            const payload = {
                id: team.id,
                name: formData.get('name')?.toString().trim() || null,
                city: formData.get('city') || null,
                educationalCenter: formData.get('educationalCenter') || null,
                category: String(formData.get('category') || ''),
                foundationYear: formData.get('foundationYear')
                    ? Number(formData.get('foundationYear'))
                    : null,
                inscriptionDate: formData.get('inscriptionDate') || null,
            };

            const result = await updateTeam(payload);

            if (!result?.success) {
                throw new Error(result?.error || 'Failed to update team.');
            }

            router.refresh();
            setIsEditing(false);
            setSuccessMessage('Team updated successfully.');
            setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-4">
            {successMessage && (
                <p className="mb-4 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {successMessage}
                </p>
            )}

            {!isEditing ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setError(null);
                        setIsEditing(true);
                    }}
                >
                    Edit team
                </Button>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg border border-border bg-card p-5 shadow-sm"
                >
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Edit team details
                    </h2>

                    {error && (
                        <p className="mb-4 text-sm text-red-500">{error}</p>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input name="name" defaultValue={team.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>City</Label>
                            <Input name="city" defaultValue={team.city ?? ''} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Educational center</Label>
                            <Input
                                name="educationalCenter"
                                defaultValue={team.educationalCenter ?? ''}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <select
                                name="category"
                                defaultValue={team.category}
                                className="border p-2"
                            >
                                {TEAM_CATEGORY_OPTIONS.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Foundation year</Label>
                            <Input
                                name="foundationYear"
                                type="number"
                                defaultValue={team.foundationYear ?? ''}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Inscription date</Label>
                            <Input
                                name="inscriptionDate"
                                type="date"
                                defaultValue={team.inscriptionDate ?? ''}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}