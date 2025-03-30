"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { createNoteAction } from "@/actions/notes";
import { debounceTimeout } from "@/lib/constants";

type Props = {
  user: User | null;
};

const NewNoteButton = ({ user }: Props) => 
  {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClickNewNoteButton = async() => {
    if (!user) {
      router.push("/login");
    }else{
        setLoading(true);
        await new Promise((resolve)=>{
            toast.success("Saving Your current work...");
            setTimeout(resolve, debounceTimeout+500)
        })
        toast.dismiss();
        const uuid = uuidv4();
        await createNoteAction(uuid)
        toast.dismiss();
        router.push(`/?noteId=${uuid}`);

        toast.info("A New Note has been created");
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
};

export default NewNoteButton;
