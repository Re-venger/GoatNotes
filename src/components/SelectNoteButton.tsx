"use client";
import useNote from "@/hooks/useNote";
import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
  note: Note;
};
const SelectNoteButton = ({ note }: Props) => {
  const noteId = useSearchParams().get("noteId") || "";
  const { noteText: selectedNoteText } = useNote();
  const [localNoteText, setlocalNoteText] = useState(note.text);
  const [shouldUseGlobalNoteText, setshouldUseGlobalNoteText] = useState(false);

  useEffect(() => {
    if (noteId === note.id) {
      setshouldUseGlobalNoteText(true);
    } else {
      setshouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);

  useEffect(() => {
    if (shouldUseGlobalNoteText) {
      setlocalNoteText(selectedNoteText);
    }
  }, [shouldUseGlobalNoteText, selectedNoteText]);

  const blankNoteText = "EMPTY NOTE";
  let noteText = localNoteText || blankNoteText;
  if (shouldUseGlobalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }
  return (

    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${
        note.id === noteId && "bg-sidebar-accent/50"
      }`}
    >
      <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
      <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
        {noteText}
      </p>
      <p className="text-muted-foreground text-xs">{note.updatedAt.toLocaleDateString()}</p>
      </Link>
    </SidebarMenuButton>
  );
};

export default SelectNoteButton;
