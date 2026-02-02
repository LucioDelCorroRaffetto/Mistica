import { ReadingList } from "../entities/ReadingList";

// Mock data for reading lists
const readingListsDB: ReadingList[] = [];

function createReadingList(list: ReadingList): ReadingList {
  readingListsDB.push(list);
  return list;
}

function getReadingListsByUser(userId: string): ReadingList[] {
  return readingListsDB.filter((l) => l.userId === userId);
}

function getPublicReadingLists(): ReadingList[] {
  return readingListsDB.filter((l) => l.isPublic);
}

function getReadingListById(listId: string): ReadingList | undefined {
  return readingListsDB.find((l) => l.id === listId);
}

function addBookToList(listId: string, bookId: string): void {
  const list = getReadingListById(listId);
  if (!list) throw new Error("Reading list not found");
  if (!list.bookIds.includes(bookId)) {
    list.bookIds.push(bookId);
    list.updatedAt = new Date();
  }
}

function removeBookFromList(listId: string, bookId: string): void {
  const list = getReadingListById(listId);
  if (!list) throw new Error("Reading list not found");
  list.bookIds = list.bookIds.filter((id) => id !== bookId);
  list.updatedAt = new Date();
}

function deleteReadingList(listId: string): void {
  const index = readingListsDB.findIndex((l) => l.id === listId);
  if (index > -1) {
    readingListsDB.splice(index, 1);
  }
}

export function createList(
  userId: string,
  name: string,
  description: string,
  isPublic: boolean = false
): ReadingList {
  const list: ReadingList = {
    id: `list-${Date.now()}`,
    userId,
    name,
    description,
    bookIds: [],
    isPublic,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return createReadingList(list);
}

export function getMyLists(userId: string): ReadingList[] {
  return getReadingListsByUser(userId);
}

export function getPublicLists(): ReadingList[] {
  return getPublicReadingLists();
}

export function addBookToMyList(listId: string, bookId: string): void {
  addBookToList(listId, bookId);
}

export function removeBookFromMyList(listId: string, bookId: string): void {
  removeBookFromList(listId, bookId);
}

export function removeList(listId: string): void {
  deleteReadingList(listId);
}
