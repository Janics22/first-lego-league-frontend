import type { AuthStrategy } from "@/lib/authProvider";
import { Award } from "@/types/award";
import { fetchHalCollection } from "./halClient";

export class AwardsService {
    constructor(private readonly authStrategy: AuthStrategy) {}

    async getAwardsOfEdition(editionUri: string): Promise<Award[]> {
        const encodedEditionUri = encodeURIComponent(editionUri);
        return fetchHalCollection<Award>(
            `/awards/search/findByEdition?edition=${encodedEditionUri}`,
            this.authStrategy,
            "awards"
        );
    }
}
