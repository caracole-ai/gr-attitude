import {
  MissionStatus,
  HelpType,
  Urgency,
  Visibility,
  MissionCategory,
} from '../constants/enums';

export interface IMission {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: MissionCategory;
  helpType: HelpType;
  urgency: Urgency;
  visibility: Visibility;
  locationLat?: number;
  locationLng?: number;
  locationRadiusKm: number;
  status: MissionStatus;
  progressPercent: number;
  tags: string[];
  createdAt: string;
  expiresAt: string;
  closedAt?: string;
  closureFeedback?: string;
  closureThanks?: string;
  // Populated relations
  creator?: import('./user').IUser;
  contributionCount?: number;
}

export interface ICreateMission {
  title: string;
  description: string;
  category: MissionCategory;
  helpType: HelpType;
  urgency: Urgency;
  visibility: Visibility;
  locationLat?: number;
  locationLng?: number;
  locationRadiusKm?: number;
  tags?: string[];
}

export interface ICloseMission {
  feedback?: string;
  thanks?: string;
}

export interface IMissionFilters {
  category?: MissionCategory;
  helpType?: HelpType;
  urgency?: Urgency;
  status?: MissionStatus;
  tags?: string[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  search?: string;
  page?: number;
  limit?: number;
}
