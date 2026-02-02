import { ReadingList } from "@domain/src/entities/ReadingList";

export let readingListsDB: ReadingList[] = [
  {
    id: "list-001",
    userId: "user-001",
    name: "Clásicos Argentinos",
    description: "Obras maestras de la literatura argentina",
    bookIds: ["libro-001", "libro-002", "libro-003"],
    isPublic: true,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-01"),
  },
  {
    id: "list-002",
    userId: "user-002",
    name: "Para leer después",
    description: "Mis próximas lecturas",
    bookIds: ["libro-004"],
    isPublic: false,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-15"),
  },
];

export function createReadingList(list: ReadingList): ReadingList {
  readingListsDB.push(list);
  return list;
}

export function getReadingListsByUser(userId: string): ReadingList[] {
  return readingListsDB.filter((l) => l.userId === userId);
}

export function getPublicReadingLists(): ReadingList[] {
  return readingListsDB.filter((l) => l.isPublic);
}

export function getReadingListById(listId: string): ReadingList | undefined {
  return readingListsDB.find((l) => l.id === listId);
}

export function addBookToList(listId: string, bookId: string): void {
  const list = getReadingListById(listId);
  if (!list) throw new Error("Reading list not found");
  if (!list.bookIds.includes(bookId)) {
    list.bookIds.push(bookId);
    list.updatedAt = new Date();
  }
}

export function removeBookFromList(listId: string, bookId: string): void {
  const list = getReadingListById(listId);
  if (!list) throw new Error("Reading list not found");
  list.bookIds = list.bookIds.filter((id) => id !== bookId);
  list.updatedAt = new Date();
}

export function deleteReadingList(listId: string): void {
  const index = readingListsDB.findIndex((l) => l.id === listId);
  if (index > -1) {
    readingListsDB.splice(index, 1);
  }
}
