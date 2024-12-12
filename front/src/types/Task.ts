// types.ts
export type MissionType =
  | 'SUBSCRIBE_TG'
  | 'NUMBER_OF_RACES'
  | 'RACE_VICTORIES'
  | 'RECEIVED_OF_CLAIMS'
  | 'ADVERTISING_VIEWED'
  | 'INVITE_FRIENDS'
  | 'UPGRADE_CAR'
  | 'CONNECT_WALLET'
  | 'WALLET_TRANSACTION'
  | 'UPGRADE_BUSINESS';

export type Task = {
  id: number;
  title: string;
  reward: number;
  description: string;
  isCompleted: boolean;
  type: MissionType;
  needCount: number;
  url: string;
  details: TaskDetails | null;
};

export type TaskDetails = {
  token: string,
  amount: string,
  address: string,
  type: string,
};