import React from "react";
import vanityvansImg from "../public/assets/projects/vanityvans.jpeg";
import Image from "next/image";
import { RiRadioButtonFill } from "react-icons/ri";
// import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Link, Spacer } from "@nextui-org/react";

const vanityvans = () => {
  return (
    <div className="w-full">
      <div className="w-screen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/60 z-10" />
        <Image
          className="absolute z-1"
          layout="fill"
          objectFit="cover"
          src={vanityvansImg}
          alt="/"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">vanity vans</h2>
          <h3>React.js / Redux</h3>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p>Project</p>
          <h2>Overview</h2>
          <p className="max-w-[450px]">
          Welcome to vanity vans, a one-stop-shop for personalized vans tailored to your unique style. Our easy-to-use platform offers a variety of custom options, ensuring your dream van becomes a reality. With a secure payment system powered by Stripe, you can shop with confidence. Experience the future of van customization at vanity vans!
          </p>
          <Link block color="secondary" isExternal
              href="https://vanityvans.onrender.com/"
              target="_blank"
            >
              vanity vans
              </Link>
            <Spacer />
            <Link block color="secondary" isExternal
              href="https://github.com/Dr-Teeth/GraceShopper"
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
                Stripe
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

export default vanityvans;
