export interface Buchung {
  id: number;
  datum: Date;
  typ: string;
  beschreibung: string;
  betragnetto: number;
  locked: boolean;
  steuersatzid: number;
  partnerid: number;
  kostenstelleid: number;
  kategorieid: number;
}