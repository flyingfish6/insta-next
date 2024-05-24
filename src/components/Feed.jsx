import React from "react";
import MinProfile from "./MinProfile";
import Posts from "./Posts";
const Feed = () => {
  return (
    <main className="md:max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 ">
      <section className="md:col-span-2">
        <Posts />
      </section>

      <section className="hidden md:col-span-1 md:inline-grid">
        <div className="fixed w-[380px]">
          <MinProfile />
        </div>
      </section>
    </main>
  );
};

export default Feed;
