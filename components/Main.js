import React from 'react';

const Main = () => {
    return (
        <div className='w-full h-screen text-center'>
            <div className='max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center'>
                <div>
                    <p className='uppercase text-sm tracking-widest text-gray-600'>Behold The newest edition of my digital playground on the interwebs!</p>
                    <h1 className='py-4 text-gray-700'>Hey, I'm <span className='text-[#7d51e5]'>Cody</span></h1>
                    <h1 className='py-4 text-gray-700'>I am a Full Stack Developer</h1>
                <p className='py-4 text-gray-600 max-w-[70%] m-auto'>
                        Please, feel free to dive into my interactive portfolio and embark on a journey through time, witnessing my progress from my early days at Fullstack Academy to my most recent accomplishments.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main;