import React from "react";
import WhackImg from "../public/assets/games/Whack.png";
import Image from "next/image";
import { RiRadioButtonFill } from "react-icons/ri";
// import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Link, Spacer } from "@nextui-org/react"

const Whack = () => {
  return (
    <div className="w-full">
      <div className="w-screen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/60 z-10" />
        <Image
          className="absolute z-1"
          layout="fill"
          objectFit="cover"
          src={WhackImg}
          alt="/"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Pay-Back-A-Troll</h2>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p>Game</p>
          <h2>Overview</h2>
          <p className="max-w-[450px]">
            This was the first "game" I created. It is a whack a mole clone. The theme is from the tv show "It's Always Sunny In Philadelphia". Click the button that says "Pay the troll toll" to start. Scores will persist if left on the page.
          </p>
            <Link block color="secondary" isExternal
              href="https://codydibella.com/troll.html"
              target="_blank"
            >
              Pay-Back-A-Troll!
            </Link>
        </div>
        <button className="p-2 m-auto">
          <Link color="success" href="/#projects">
            <p className="cursor-pointer">Back</p>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Whack;
