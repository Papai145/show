import { ScheduleDocument } from '../models/schedule.models';

interface RoomBase {
  room: number;
}

interface UserBase {
  name: string;
  phone: string;
}

// interface ScheduleBase {
//   startDay: string;
//   _id: string;
//   __v: number;
// }

// 2. Интерфейс для распополученного документа
export interface PopulatedSchedule
  extends Omit<ScheduleDocument, 'roomId' | 'userId'> {
  roomId: Pick<RoomBase, 'room'>;
  userId: Pick<UserBase, 'name' | 'phone'>;
}
