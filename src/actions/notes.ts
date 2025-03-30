"use server";
import { getUser } from "@/Auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import "@/styles/ai-response.css";


//* Create Notes 
export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You Must be logged in to Create a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

//* Update Notes
export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You Must be logged in to Update a note");

    await prisma.note.update({
      where: { id: noteId },
      data: {
        text,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};


//* Delete Notes
export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You Must be logged in to Update a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
