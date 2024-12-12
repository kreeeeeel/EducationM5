import {UserRef} from "./UserRef.ts";

export interface RefInfo {
    url: string;
    bonus: number;
    numberOfInvitees: number;
    users: UserRef[];
}