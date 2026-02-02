import { Router, Request, Response } from "express";
import {
  createList,
  getMyLists,
  getPublicLists,
  addBookToMyList,
  removeBookFromMyList,
  removeList,
} from "@domain/src/use-cases/manage-reading-lists";

export const readingListsRouter = Router();

readingListsRouter.get("/reading-lists", (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    const lists = getMyLists(userId);
    res.json(lists);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

readingListsRouter.get("/reading-lists/public", (req: Request, res: Response) => {
  try {
    const lists = getPublicLists();
    res.json(lists);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

readingListsRouter.post("/reading-lists", (req: Request, res: Response) => {
  try {
    const { userId, name, description, isPublic } = req.body;
    if (!userId || !name) {
      res.status(400).json({ error: "userId and name required" });
      return;
    }
    const list = createList(userId, name, description || "", isPublic || false);
    res.status(201).json(list);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

readingListsRouter.post("/reading-lists/:listId/books", (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const { bookId } = req.body;
    if (!bookId) {
      res.status(400).json({ error: "bookId required" });
      return;
    }
    addBookToMyList(listId, bookId);
    res.json({ message: "Book added to list" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

readingListsRouter.delete("/reading-lists/:listId/books/:bookId", (req: Request, res: Response) => {
  try {
    const { listId, bookId } = req.params;
    removeBookFromMyList(listId, bookId);
    res.json({ message: "Book removed from list" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

readingListsRouter.delete("/reading-lists/:listId", (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    removeList(listId);
    res.json({ message: "List deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
