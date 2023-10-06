import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link, Button } from "@nextui-org/react";

const Main = () => {
  return (
    <div id="home" className="w-full h-screen text-center">
      <div className="max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <p className="uppercase text-sm tracking-widest text-gray-600">
            Behold The newest edition of my digital playground on the interwebs!
          </p>
          <h1 className="py-4 text-gray-700">
            Hey, I'm <span className="text-[#8746cd]">Cody</span>
          </h1>
          <h1 className="py-4 text-gray-700">I am a Full Stack Developer</h1>
          <p className="py-4 text-gray-600 max-w-[70%] m-auto">
            Please feel free to dive into my interactive portfolio and embark on
            a journey through time and space, witnessing my progress from my
            early days at Fullstack Academy to my most recent accomplishments.
          </p>
          <div className="flex items-center justify-between max-w-[330px] m-auto [y-4">
            <a
              href="https://www.linkedin.com/in/codydibella/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                <FaLinkedinIn />
              </Button>
            </a>
            <a
              href="https://github.com/codydibella"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                <FaGithub />
              </Button>
            </a>
            <a href="mailto:codibella@gmail.com">
              <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                <AiOutlineMail />
              </Button>
            </a>
            <a
              href="https://www.dropbox.com/scl/fi/ykg26nap7v6ebavv07qbw/CodyDiBella_Resume2023.pdf?rlkey=f1nfh80b880q0ke279haj4khp&dl=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                <BsFillPersonLinesFill />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
