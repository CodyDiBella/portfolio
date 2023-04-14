import React from "react";
import Image from "next/image";

const About = () => {
    return (
        <div id="about" className="w-full md:h-screen p-2 items-center py-16">
            <div className="max-w-[1240px] m-auto md:grid grid-cols-3 gap-8">
                <div className="col-span-2">
                <p className="uppercase text-xl tracking-widest text-[#8746cd]">About</p>
                <h2 className="py-4">Who I Am</h2>
                <p className="py-2 text-gray-600">I am not a mortal</p>
                <p className="py-2 text-gray-600>Lorem Ipsum saidh uaoiasodihaso asiduohaiuoshdiu sauiohdiuashd asuidoh aisouhd asduiohasuiodhiuoas asufhaiuohfiuhasd asioufdhasuihfiugfhaisuhdfas asiudhiasudhiuashdiuahds asdoiuhasiuodhiuashdiuasidaa</p>
                <p className="py-2 text-gray-600>Lorem Ipsum saiduhasiuygfa asdibasiuydbw aiufhiueaghiuyea saduyfvbweuyfvagoias fiuahfiyueqwgrfwiqoaf asfiubasidugbieyubdiuyabifuhsf aifuheiufhiuafdagysdbyibafg.</p>
                <p className="py-2 text-gray-600 underline cursor-pointer">Check out my latest projects!</p>
                </div>
                <div className="w-full h-auto m-auto shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center p-4 hover:scale-110 ease-in duration-100">
                    <Image className="rounded-xl" src="/assets/codypicture.jpg" alt="cody" width="150" height="100" />
                </div>
            </div>
        </div>
    )
}

export default About;