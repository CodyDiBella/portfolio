import React from "react";
import pizzaImg from "../public/assets/games/pizzaImg.png";
import Image from "next/image";
import { RiRadioButtonFill } from "react-icons/ri";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const pizza = () => {
  return (
    <div className="w-full">
      <div className="w-screen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/60 z-10" />
        <Image
          className="absolute z-1"
          layout="fill"
          objectFit="cover"
          src={pizzaImg}
          alt="/"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Pizza Clicker</h2>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p>Game</p>
          <h2>Overview</h2>
          <p className="max-w-[450px]">
            Click the pizza! It's that simple! Every click will get you one pizza, when you have enough pizzas you can buy powerups, which will grant you more pizza per second.  Continue clicking and buying until your appetite is filled!
          </p>
            <a
              href="https://codydibella.com/pizza.html"
              target="_blank"
              rel="noopener noreferrer"
              className="m-auto p-4 underline cursor-pointer text-[#8746cd]"
            >
              Pizza Clicker!
            </a>
        </div>
        <button className="p-2 m-auto">
          <Link href="/#projects">
            <p className="cursor-pointer">Back</p>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default pizza;
