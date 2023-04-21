import React from "react";
import hoglegImg from "../public/assets/projects/hogleg.jpeg";
import Image from "next/image";
import { RiRadioButtonFill } from "react-icons/ri";
// import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Link, Spacer } from "@nextui-org/react";

const hogleg = () => {
  return (
    <div className="w-full">
      <div className="w-screen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/60 z-10" />
        <Image
          className="absolute z-1"
          layout="fill"
          objectFit="cover"
          src={hoglegImg}
          alt="/"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Hogwart's Legacy Character Database</h2>
          <h3>React.js / Redux</h3>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p>Project</p>
          <h2>Overview</h2>
          <p className="max-w-[450px]">
          Introducing Hogwarts Legacy Character Database. Developed as a final project for the junior phase of Fullstack Academy, this interactive database utilizes React and Redux to showcase characters and houses from the game. Explore and engage with your favorite in-game elements while experiencing the magic of Hogwarts Legacy Character Database. Immerse yourself in the enchanting world of Hogwarts and uncover the secrets behind its captivating characters and iconic houses.
          </p>
            <Link block color="secondary" isExternal
              href="https://hogleg.onrender.com/"
              target="_blank"
            >
              Hogwart's Legacy Character Database
            </Link>
            <Spacer />
            <Link block color="secondary" isExternal
              href="https://github.com/CodyDiBella/HogLeg"
              target="_blank"
            >
              Github
            </Link>
        </div>
        <div className="col-span-4 mx-auto md:col-span-1 shadow-xl shadow-gray-400 rounded-xl p-4">
          <div className="p-2">
            <p className="text-center font-bold pb-2">Tools</p>
            <div className="grid grid-cols-3 w-screen md:grid-cols-1">
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
               React
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                Redux
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                CSS
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                PostgreSQL
              </p>
            </div>
          </div>
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

export default hogleg;
