import { shadow } from "@/styles/utiles";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./darkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/Auth/server";
import { SidebarTrigger } from "./ui/sidebar";


async function Header(){
  const user = await getUser();
  return (
    <header
      className="relative h-24 w-full bg-popover flex items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >

      <SidebarTrigger className="absolute left-1 top-1"/>
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/lumen.png"
          height={100}
          width={100}
          alt="logo"
          className="rounded-full"
          priority
        />

        <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">
          LUMON<span>NOTES</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <LogOutButton/>
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      <ModeToggle/>
      </div>
    </header>
  );
};

export default Header;
