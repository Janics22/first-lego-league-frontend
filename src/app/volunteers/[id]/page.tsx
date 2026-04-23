import { VolunteersService } from "@/api/volunteerApi";
import EmptyState from "@/app/components/empty-state";
import ErrorAlert from "@/app/components/error-alert";
import { serverAuthProvider } from "@/lib/authProvider";
import { parseErrorMessage } from "@/types/errors";
import { Volunteer } from "@/types/volunteer";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function VolunteerDetailPage(props: Readonly<Props>) {
    const { id } = await props.params;

    const service = new VolunteersService(serverAuthProvider);

    let volunteer: Volunteer | null = null;
    let error: string | null = null;

    try {
        const data = await service.getVolunteers();
        const all = [...data.judges, ...data.referees, ...data.floaters];

        volunteer =
            all.find(v => {
                const candidate = `${v.type}-${v.name}`;
                return encodeURIComponent(candidate) === id;
            }) ?? null;

    } catch (e) {
        console.error(e);
        error = parseErrorMessage(e);
    }

    if (error) return <ErrorAlert message={error} />;
    if (!volunteer) return <EmptyState title="Not found" description="Volunteer does not exist" />;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-3xl px-4 py-10">
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-black">

                    <h1 className="text-2xl font-semibold mb-2">
                        {volunteer.name || "Unnamed volunteer"}
                    </h1>

                    <div className="space-y-1 text-sm text-muted-foreground mb-6">
                        <p><strong>Role:</strong> {volunteer.type}</p>
                        <p><strong>Email:</strong> {volunteer.emailAddress}</p>
                        <p><strong>Phone:</strong> {volunteer.phoneNumber}</p>
                    </div>

                    {volunteer.type === "Judge" && (
                        <div>
                            <h2 className="font-semibold">Judge Info</h2>
                            <p><strong>Expert:</strong> {volunteer.expert ? "Yes" : "No"}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}