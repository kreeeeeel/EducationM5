export interface DailyReward {
    day: number;
    isCompleted: boolean;
    isCanTake: boolean;
    isCanTakeInFuture: boolean;
    reward: number;
}