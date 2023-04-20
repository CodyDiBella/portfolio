import React from "react";
import Link from "next/link";
import Image from "next/image";
import LOTRImg from "../public/assets/games/LOTR.png";
import pizzaImg from "../public/assets/games/pizzaImg.png";
import whackImg from "../public/assets/games/Whack.png";
import GameItem from "./GameItem";

const Games = () => {
  return (
    <div id="games" className="w-full">
      <div className="max-w-[1240px] mx-auto px-2 py-16">
        <h2 className="py-4">Games</h2>
        <div className="grid md:grid gap-8">
          <GameItem
            title="Pizza Clicker Game"
            backgroundImg={pizzaImg}
            gameUrl="/pizza"
          />
          <GameItem
            title="Whack-a-mole Game"
            backgroundImg={whackImg}
            gameUrl="/whack"
          />
          <GameItem
            title="LOTR Fighter Game"
            backgroundImg={LOTRImg}
            gameUrl="/LOTR"
          />
        </div>
      </div>
    </div>
  );
};

export default Games;
