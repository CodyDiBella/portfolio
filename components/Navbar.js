import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Link as ScrollLink } from "react-scroll";
import { useRouter } from "next/router";
// import Link from "next/link";
import Image from "next/image";
import { Button, Link } from "@nextui-org/react";


const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState("#ecf0f3");
  const [linkColor, setLinkColor] = useState("#1f2937");
  const router = useRouter();

  useEffect(() => {
    if (
      router.asPath === "/aicookbook" ||
      router.asPath === "/vanityvans" ||
      router.asPath === "/hogleg" ||
      router.asPath === "/og"
    ) {
      setNavBg("transparent");
      setLinkColor("#ecf0f3");
    } else {
      setNavBg("#ecf0f3");
      setLinkColor("#1f2937");
    }
  }, [router]);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener("scroll", handleShadow);
  }, []);

  return (
    <div
      style={{ backgroundColor: `${navBg}` }}
      className={
        shadow
          ? "fixed w-full h-20 shadow-xl z-[1000]"
          : "fixed w-full h-20 z-[1000]"
      }
    >
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
        <Link href="/">
          <Image src="/assets/CD.png" alt="/" width="50" height="5" />
        </Link>
        <div>
          <ul style={{ color: `${linkColor}` }} className="hidden md:flex">
            {router.pathname === "/" ? (
              <ScrollLink to="home" smooth={true} duration={200} offset={-80}>
                <li className="ml-10 text-sm uppercase hover:border-b">Home</li>
              </ScrollLink>
            ) : (
              <Link block color="secondary" href="/#home">
                <li className="ml-10 text-sm uppercase hover:border-b cursor-pointer">
                  Home
                </li>
              </Link>
            )}
            {router.pathname === "/" ? (
              <ScrollLink to="about" smooth={true} duration={200} offset={-80}>
                <li className="ml-10 text-sm uppercase hover:border-b">
                  About
                </li>
              </ScrollLink>
            ) : (
              <Link block color="secondary" href="/#about">
                <li className="ml-10 text-sm uppercase hover:border-b cursor-pointer">
                  About
                </li>
              </Link>
            )}
            {router.pathname === "/" ? (
              <ScrollLink to="skills" smooth={true} duration={200} offset={-80}>
                <li className="ml-10 text-sm uppercase hover:border-b">
                  Skills
                </li>
              </ScrollLink>
            ) : (
              <Link block color="secondary" href="/#skills">
                <li className="ml-10 text-sm uppercase hover:border-b cursor-pointer">
                  Skills
                </li>
              </Link>
            )}
                        {router.pathname === "/" ? (
            <ScrollLink to="projects" smooth={true} duration={200} offset={-30}>
              <li className="ml-10 text-sm uppercase hover:border-b">
                Projects
              </li>
            </ScrollLink>
              ) : (
                <Link block color="secondary" href="/#projects">
                <li className="ml-10 text-sm uppercase hover:border-b cursor-pointer">
                  Projects
                </li>
              </Link>
            )}
                        {router.pathname === "/" ? (
            <ScrollLink to="contact" smooth={true} duration={200} offset={-30}>
              <li className="ml-10 text-sm uppercase hover:border-b">
                Contact
              </li>
            </ScrollLink>
              ) : (
                <Link block color="secondary" href="/#contact">
                <li className="ml-10 text-sm uppercase hover:border-b cursor-pointer">
                  Contact
                </li>
              </Link>
            )}
          </ul>
          <div onClick={handleNav} className="md:hidden cursor-pointer">
            <AiOutlineMenu size={25} style={{ color: `${linkColor}` }} />
          </div>
        </div>
      </div>
      <div
        className={
          nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""
        }
      >
        <div
          className={
            nav
              ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-10 transition-all ease-in duration-400"
              : "fixed left-[-100%] top-0 p-10 transition-all ease-in duration-400"
          }
        >
          <div>
            <div className="flex w-full items-center justify-between">
              <Link href="/">
                <Image
                  src="/assets/CD.png"
                  width="50"
                  height="5"
                  alt="/"
                  onClick={() => setNav(false)}
                />
              </Link>
              <div
                onClick={handleNav}
                className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100"
              >
                <AiOutlineClose />
              </div>
            </div>
            <div className="border-b border-gray-300 my-4">
              <p className="w-[85%] md:w-[90%] py-4">
                Let's build something legendary together!
              </p>
            </div>
          </div>
          <div className="py-4 flex flex-col">
  <ul className="uppercase">
    {router.pathname === "/" ? (
      <ScrollLink to="home" smooth={true} duration={200} offset={-80}>
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Home
        </li>
      </ScrollLink>
    ) : (
      <Link block color="secondary" href="/#home">
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Home
        </li>
      </Link>
    )}
    {router.pathname === "/" ? (
      <ScrollLink to="about" smooth={true} duration={200} offset={-30}>
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          About
        </li>
      </ScrollLink>
    ) : (
      <Link block color="secondary" href="/#about">
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          About
        </li>
      </Link>
    )}
    {router.pathname === "/" ? (
      <ScrollLink to="skills" smooth={true} duration={200} offset={-80}>
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Skills
        </li>
      </ScrollLink>
    ) : (
      <Link block color="secondary" href="/#skills">
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Skills
        </li>
      </Link>
    )}
    {router.pathname === "/" ? (
      <ScrollLink to="projects" smooth={true} duration={200} offset={-30}>
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Projects
        </li>
      </ScrollLink>
    ) : (
      <Link block color="secondary" href="/#projects">
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Projects
        </li>
      </Link>
    )}
    {router.pathname === "/" ? (
      <ScrollLink to="contact" smooth={true} duration={200} offset={-30}>
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Contact
        </li>
      </ScrollLink>
    ) : (
      <Link block color="secondary" href="/#contact">
        <li onClick={() => setNav(false)} className="py-4 text-sm">
          Contact
        </li>
      </Link>
    )}
  </ul>
            <div className="pt-40">
              <p className="tracking-widest text-[#8746cd]">
                Did we just become best friends?
              </p>
              <div className="flex items-center justify-between my-4 w-full sm:w-[80%]">
                <a
                  href="https://www.linkedin.com/in/codydibella/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                    <FaLinkedinIn />
                  </Button>
                </a>
                <a
                  href="https://github.com/codydibella"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                    <FaGithub />
                  </Button>
                </a>
                <a href="mailto:codibella@gmail.com">
                  <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                    <AiOutlineMail />
                  </Button>
                </a>
                <a
                  href="https://www.dropbox.com/scl/fi/ykg26nap7v6ebavv07qbw/CodyDiBella_Resume2023.pdf?rlkey=f1nfh80b880q0ke279haj4khp&dl=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-200">
                    <BsFillPersonLinesFill />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
