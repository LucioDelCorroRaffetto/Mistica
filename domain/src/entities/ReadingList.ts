export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description: string;
  bookIds: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
