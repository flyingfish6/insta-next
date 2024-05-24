"use client";
import logo from "../../public/800px-Instagram_logo_2016.webp";
import { signIn, useSession, signOut } from "next-auth/react";

import React from "react";

const MinProfile = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-between mt-14 ml-10 w-full">
      <img
        src={session?.user.image || logo}
        alt="logo"
        className="w-16 h-16 rounded-full border p-[2px]"
      />
      <div className="flex-1 ml-4">
        <h2 className="font-bold">{session?.user?.name}</h2>
        <h3 className="text-gray-400 text-sm">Welcome to Instragram</h3>
      </div>
      {session ? (
        <button
          onClick={signOut}
          className="text-blue-500 text-sm font-semibold"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={signIn}
          className="text-blue-500 text-sm font-semibold"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default MinProfile;
