import { ContributionType, ContributionStatus } from '../constants/enums';

export interface IContribution {
  id: string;
  userId: string;
  missionId: string;
  type: ContributionType;
  message?: string;
  status: ContributionStatus;
  createdAt: string;
  // Populated
  user?: import('./user').IUser;
}

export interface ICreateContribution {
  type: ContributionType;
  message?: string;
}
