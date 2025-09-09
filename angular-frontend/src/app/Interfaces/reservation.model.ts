import { ReservedSeat } from "./reservedseat.model";

export interface Reservation {
  id: number;
  userId: number;
  showtimeId: number;
  createdAt: string;    
  seats: ReservedSeat[]; 
}
