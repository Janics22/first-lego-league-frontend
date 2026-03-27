import { Resource } from "halfred";
 
export interface ScientificProjectEntity {
    uri?: string;
    score?: number;
    comments?: string;
}
 
export type ScientificProject = ScientificProjectEntity & Resource;
 