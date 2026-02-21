import {
  OfferType,
  OfferStatus,
  Visibility,
  MissionCategory,
} from '../constants/enums';

export interface IOffer {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: MissionCategory;
  offerType: OfferType;
  visibility: Visibility;
  locationLat?: number;
  locationLng?: number;
  locationRadiusKm: number;
  status: OfferStatus;
  tags: string[];
  availability?: string;
  createdAt: string;
  expiresAt: string;
  closedAt?: string;
  // Populated
  creator?: import('./user').IUser;
}

export interface ICreateOffer {
  title: string;
  description: string;
  category: MissionCategory;
  offerType: OfferType;
  visibility: Visibility;
  locationLat?: number;
  locationLng?: number;
  locationRadiusKm?: number;
  tags?: string[];
  availability?: string;
}
