"use client";

import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction, signupAction } from "@/actions/users";


type Props = {
  type: "login" | "signUp";
};

// useTransition hook is used

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isePending, startTransitiion] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransitiion(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      let description;

      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        description = "You have been Successfully logged in";
      } else {
        errorMessage = (await signupAction(email, password)).errorMessage;
        description = "Check You email for confirmation link";
      }

      if (!errorMessage) {
        toast.success(description);
        router.replace('/');
      }else{
        toast.error(String(errorMessage));
      }





    });

    // console.log("Data Submitted");
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isePending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isePending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-5 flex flex-col gap-6">
        <Button className="w-full">
          {isePending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account yet ?"
            : "Already have an account ?"}
          {""}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${
              isePending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {" "}
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
