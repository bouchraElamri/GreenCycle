import React from "react";
import Items from "./Items";

const TitleTable = () => {
  return (
    <main className="mx-6 my-10 flex-1 items-center mt-32 sm:mx-8 md:mx-12 lg:mx-20 xl:mx-32">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <h1 className="text-center font-nexa text-3xl font-bold text-green-dark md:text-5xl">
          Your Sustainable Participation
        </h1>

        <div className="mt-10 w-full overflow-hidden rounded-[2.2rem] border border-green-dark bg-gradient-to-b from-green-light/45 to-white-intense">
          <div className="hidden md:grid md:grid-cols-12 md:items-center md:rounded-full md:bg-gradient-to-r from-green-tolerated to-green-dark px-4 py-5 text-white-intense sm:px-6">
            <p className="col-span-6 font-nexa text-2xl font-bold md:col-span-5">Items</p>
            <p className="col-span-3 text-center font-nexa text-xl md:col-span-3 md:text-2xl">Quantity</p>
            <p className="col-span-3 text-center font-nexa text-xl md:col-span-4 md:text-2xl">Price</p>
          </div>

          <Items />
        </div>
      </section>
    </main>
  );
};

export default TitleTable;
