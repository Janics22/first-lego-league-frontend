import type { AuthStrategy } from "@/lib/authProvider";
import { ScientificProject } from "@/types/scientificProject";
import { getHal, mergeHalArray } from "./halClient";

export class ScientificProjectsService {
    constructor(private readonly authStrategy: AuthStrategy) {}

    async getScientificProjects(): Promise<ScientificProject[]> {
        const resource = await getHal('/scientific-projects', this.authStrategy);
        const embedded = resource.embeddedArray('scientificProjects') || [];
        return mergeHalArray<ScientificProject>(embedded);
    }
}