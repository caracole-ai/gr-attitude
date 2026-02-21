export interface ICorrelation {
  id: string;
  missionId: string;
  offerId: string;
  score: number;
  createdAt: string;
  // Populated
  mission?: import('./mission').IMission;
  offer?: import('./offer').IOffer;
}
