export interface Buchung {
  id: number;
  datum: Date;
  typ: string;
  beschreibung: string;
  betragNetto: number;
  locked: boolean;
  steuersatzId: number;
  partnerId: number;
  kostenstelleId: number;
  kategorieId: number;
}