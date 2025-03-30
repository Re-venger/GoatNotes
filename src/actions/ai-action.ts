"use server"
import { getUser } from "@/Auth/server";
import { prisma } from "@/db/prisma";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

type Note = {
  text: string;
  createdAt: Date;
  updatedAt: Date;
};



const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[]
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to use AskAI.");

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true, createdAt: true, updatedAt: true },
    });

    if (notes.length === 0) {
      return "You don't have any notes.";
    }

    const formattedNotes = notes
      .map((note:Note ) =>
        `
            Text: ${note.text}
            Created At: ${note.createdAt}
            Last Updated: ${note.updatedAt}
            `.trim()
      )
      .join("\n");

      const chat: ChatSession = model.startChat({
        history: [
      {
        role: "user",
        parts: [{ text: `You are a helpful assistant that answers questions about a user's notes.
        Assume all questions are related to the user's notes.
        Make sure that your answers are not too verbose and you speak succinctly.
        Your responses MUST be formatted in clean, valid HTML with proper structure.
        Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate.
        Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph.
        Avoid inline styles, JavaScript, or custom attributes.
            
        Rendered like this in JSX:
        <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

        Here are the user's notes:
        ${formattedNotes}` }],
      },
      ...newQuestions.map((question, index) => ({
        role: "user",
        parts: [{ text: question }],
        ...(responses[index] ? { role: "model", parts: [{ text: responses[index] }] } : {}),
      })),
    ],
      });
    
      const result = await chat.sendMessage(newQuestions[newQuestions.length - 1]);
      const response = await result.response;
      const text = response.text();
    //   console.log(marked(text));
      
      return text || "A problem has occurred";
  }catch(error){
    console.log(error);
    
  }

};
