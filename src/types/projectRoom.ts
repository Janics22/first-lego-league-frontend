import { Resource } from "halfred";

export interface ProjectRoomEntity {
    roomNumber?: string;
}

export type ProjectRoom = ProjectRoomEntity & Resource;
