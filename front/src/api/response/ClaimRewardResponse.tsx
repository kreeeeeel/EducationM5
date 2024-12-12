import {ExpResponse} from "./ExpResponse.tsx";

export interface ClaimRewardResponse {
    currentFuel: number;
    dateNextClaim: number,
    exp: ExpResponse;
}