import React from "react";
import aicookbookImg from "../public/assets/projects/aicookbook.jpeg";
import Image from "next/image";
import { RiRadioButtonFill } from "react-icons/ri";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const aicookbook = () => {
  return (
    <div className="w-full">
      <div className="w-screen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/80 z-10" />
        <Image
          className="absolute z-1"
          layout="fill"
          objectFit="cover"
          src={aicookbookImg}
          alt="/"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">AI Cookbook</h2>
          <h3>Next.js / Supabase / MUI</h3>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p>Project</p>
          <h2>Overview</h2>
          <p>
            Introducing AI Cookbook, a groundbreaking app that revolutionizes
            the way you plan your meals. Utilizing cutting-edge artificial
            intelligence, AI Cookbook generates personalized meal suggestions
            based on the ingredients you input. No more wondering what to cook
            with the items in your pantry – our AI technology takes care of it
            for you! To create a seamless cooking experience, AI Cookbook not
            only suggests meals but also crafts detailed recipes tailored to
            your chosen ingredients. And for a more immersive and enjoyable
            cooking process, we've integrated text-to-speech functionality
            featuring familiar voices that narrate the recipes as you cook. AI
            Cookbook is the ultimate culinary companion, transforming the way
            you approach meal planning and preparation. Say goodbye to wasted
            ingredients and repetitive meals, and embrace the power of AI-driven
            innovation in your kitchen!
          </p>
          <button>
            <a
              href="https://aicookbook.app"
              target="_blank"
              rel="noopener noreferrer"
              className="m-auto p-4 text-decoration-none"
            >
              aicookbook.app
            </a>
          </button>
          <button>
            <a
              href="https://github.com/cinnamon-dolce-daredevils/AI-Cookbook"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 m-auto text-decoration-none"
            >
              Github
            </a>
          </button>
        </div>
        <div className="col-span-4 mx-auto md:col-span-1 shadow-xl shadow-gray-400 rounded-xl p-4">
          <div className="p-2">
            <p className="text-center font-bold pb-2">Tools</p>
            <div className="grid grid-cols-3 w-screen md:grid-cols-1">
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                Next.js
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                React
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                MUI
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                Supabase
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                ChatGPT
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                Spoonacular
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <RiRadioButtonFill className="pr-1" />
                Eleven Labs
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
  <div className="relative rounded-lg shadow-xl overflow-hidden aspect-w-16 aspect-h-9 p-2">
    <iframe
      className="rounded w-full h-full"
      src="https://www.youtube.com/embed/65Efr-cd-C4?list=PLx0iOsdUOUmm3RLOnoRpUArwuuVa5_u9r"
      title="AI Cookbook video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
  {/* Replace this div with the other YouTube video */}
  <div className="relative rounded-lg shadow-xl overflow-hidden aspect-w-16 aspect-h-9 p-2">
    {/* Replace the src attribute with the other YouTube embed URL */}
    <iframe
      className="rounded w-full h-full"
      src="https://www.youtube.com/embed/REPLACE_WITH_VIDEO_ID"
      title="1 Minute Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
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

export default aicookbook;
