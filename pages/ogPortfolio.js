import React from "react";
import ogImg from "../public/assets/projects/og.jpeg";
import Image from "next/image";
import { RiRadioButtonFill } from "react-icons/ri";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const og = () => {
  return (
    <div className="w-full">
      <div className="w-screen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/60 z-10" />
        <Image
          className="absolute z-1"
          layout="fill"
          objectFit="cover"
          src={ogImg}
          alt="/"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Original portfolio website</h2>
          <h3>HTML / JavaScript / CSS</h3>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p>Project</p>
          <h2>Overview</h2>
          <p>
          This is the first iteration of my personal portfolio website. I deployed it the 3rd week of Fullstack Academy and added projects to it as I went. I originally made it so that my youngest brother could play games that I made. It was mostly built using vanilla HTML, CSS, and JavaScript, though later projects do feature backend functionality and other tools.
          </p>
            <a
              href="https://codydibella.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="m-auto p-4 underline cursor-pointer text-[#8746cd]"
            >
              Original Portfolio
            </a>
        </div>
        <div className="col-span-4 mx-auto md:col-span-1 shadow-xl shadow-gray-400 rounded-xl p-4">
          <div className="p-2">
            <p className="text-center font-bold pb-2">Tools</p>
            <div className="grid grid-cols-3 w-screen md:grid-cols-1">
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
               JavaScript
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                HTML
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                CSS
              </p>
            </div>
          </div>
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

export default og;
