import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMenu, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";


const Navbar = () => {
    const [nav,setNav] = useState(false)
    const [shadow, setShadow] = useState(false)

    const handleNav = () => {
        setNav(!nav)
    }

    useEffect(() => {
      const handleShadow = () => {
        if (window.scrollY >= 90) {
          setShadow(true)
        } else {
          setShadow(false)
        }
      }
      window.addEventListener('scroll', handleShadow);
    },[]);

  return (
    <div className={shadow ? 'fixed w-full h-20 shadow-xl z-[100]' : 'fixed w-full h-20 z-[100]'}>
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
        <Link href='/'>
        <Image src="/assets/CD.png" alt="/" width="50" height="5" />
        </Link>
        <div>
          <ul className="hidden md:flex">
          <ScrollLink to="home" smooth={true} duration={200} offset={-80}>
              <li className="ml-10 text-sm uppercase hover:border-b">Home</li>
            </ScrollLink>
            <ScrollLink to="about" smooth={true} duration={200} offset={-80}>
              <li className="ml-10 text-sm uppercase hover:border-b">About</li>
              </ScrollLink>
            <ScrollLink to="skills" smooth={true} duration={200} offset={-90}>
              <li className="ml-10 text-sm uppercase hover:border-b">Skills</li>
              </ScrollLink>
            <ScrollLink to="projects" smooth={true} duration={200} offset={-30}>
              <li className="ml-10 text-sm uppercase hover:border-b">
                Projects
              </li>
              </ScrollLink>
            <ScrollLink to="contact" smooth={true} duration={200} offset={-30}>
              <li className="ml-10 text-sm uppercase hover:border-b">
                Contact
              </li>
              </ScrollLink>
          </ul>
          <div onClick={handleNav} className="md:hidden cursor-pointer">
            <AiOutlineMenu size={25} />
          </div>
        </div>
      </div>
      <div className={nav ? 'md:hidden fixed left-0 top-0 w-full h-screen bg-black/70' : ''}>
    <div className={nav ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-10 transition-all ease-in duration-400' : 'fixed left-[-100%] top-0 p-10 transition-all ease-in duration-400'}>
          <div>
            <div className="flex w-full items-center justify-between">
              <Link href='/'>
              <Image
                src="/assets/CD.png"
                width="50"
                height="5"
                alt="/"
                onClick={()=> setNav(false)}
              />
              </Link>
              <div onClick={handleNav} className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                <AiOutlineClose />
              </div>
            </div>
            <div className="border-b border-gray-300 my-4">
                <p className="w-[85%] md:w-[90%] py-4">Let's build something legendary together!</p>
            </div>
          </div>
          <div className="py-4 flex flex-col">
            <ul className="uppercase">
            <ScrollLink to="home" smooth={true} duration={200} offset={-80}>
                <li onClick={()=> setNav(false)} className="py-4 text-sm">Home</li>
                </ScrollLink>
                <ScrollLink to="about" smooth={true} duration={200} offset={-30}>
                <li onClick={()=> setNav(false)} className="py-4 text-sm">About</li>
                </ScrollLink>
                <ScrollLink to="skills" smooth={true} duration={200} offset={-80}>
                <li onClick={()=> setNav(false)} className="py-4 text-sm">Skills</li>
                </ScrollLink>
                <ScrollLink to="projects" smooth={true} duration={200} offset={-30}>
                <li onClick={()=> setNav(false)} className="py-4 text-sm">Projects</li>
                </ScrollLink>
                <ScrollLink to="contact" smooth={true} duration={200} offset={-30}>
                <li onClick={()=> setNav(false)} className="py-4 text-sm">Contact</li>
                </ScrollLink>
            </ul>
            <div className="pt-40">
            <p className="tracking-widest text-[#8746cd]">Did we just become best friends?</p>
            <div className="flex items-center justify-between my-4 w-full sm:w-[80%]">
                <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                <FaLinkedinIn />
                </div>
                <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                <FaGithub />
                </div>
                <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                <AiOutlineMail />
                </div>
                <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                <BsFillPersonLinesFill />
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
