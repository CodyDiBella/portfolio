import React from "react";
import Image from "next/image";

const About = () => {
    return (
        <div id="about" className="w-full md:h-screen p-2 items-center py-16">
            <div className="max-w-[1240px] m-auto md:grid grid-cols-3 gap-8">
                <div className="col-span-2">
                    <p className="uppercase text-xl tracking-widest text-[#8746cd]">About</p>
                    <h2 className="py-4">Who I Am</h2>
                    <p className="py-2 text-gray-600">I am a creative soul who loves to make things!</p>
                    <p className="py-2 text-gray-600">
                        Hello there! I'm an avid technology enthusiast, constantly exploring the cutting edge and pushing the boundaries of what's possible. Ever since I can remember, I've been fascinated with all things tech-related, from building computers to designing costumes and even constructing an animatronic. I'm also a passionate 3D printing hobbyist, always experimenting with new designs and techniques.
                    </p>
                    <p className="py-2 text-gray-600">
                    I truly enjoy spending time outdoors, participating in activities like camping, kayaking, or walking with my dogs, Teach and Duncan. My wife Hannah and I are excited for the summer, as we look forward to making the most of the beautiful weather together.
                    </p>
                    <p className="py-2 text-gray-600">
                        Recently, I've discovered a new passion for running, and I'm excited to be training for the Dopey Challenge at Disney World – a true test of endurance that combines a marathon, half marathon, 10k, and 5k. With another half marathon lined up in September, I'm determined to give it my all and make every stride count.
                    </p>
                    <p className="py-2 text-gray-600">
                        I'm a lifelong learner with an insatiable curiosity, eager to dive headfirst into new experiences and cutting-edge innovations. My ability to learn quickly and adapt to new situations is one of my greatest strengths. So, whether it's getting up to speed on the latest technological breakthroughs or simply embracing new challenges, I'm always ready to take the plunge and see where it leads me.
                    </p>
                    <a href="#projects" className="py-2 text-gray-600 underline cursor-pointer">Check out my latest projects!</a>
                </div>
                <div className="w-full h-auto m-auto shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center p-4 hover:scale-110 ease-in duration-100">
                    <Image className="rounded-xl" src="/assets/codyHan.jpeg" alt="cody" width="700" height="500" />
                </div>
            </div>
        </div>
    )
}

export default About;