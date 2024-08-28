import React from "react";

const Hero = () => {
  return (
    <div className='w-full overflow-hidden m-0'>
      <div className='w-full absolute top-[600px] left-[0px] z-0 h-[500px] bg-custom-blue rounded-full blur-[180px] overflow-x-hidden'></div>
      <div className='flex flex-col items-center bg-[#202123]'>
        <div className=' text-[#20FDC9] sm:text-[25px] md:text-[30px] lg:text-26 mt-[110px]'>
          INVITATION PERIOD ALMOST OVER, ACT FAST!
        </div>
        <div className=' text-white font-medium mt-[25px]  text-[25px] sm:text-[40px] md:text-[55px] lg:text-[70px]'>
          Put AI to work for you today
        </div>
        <div className='md:text-[15px] lg:text-[23px] text-[#B6B6B6] mt-[25px] text-center sm:mx-[20px]'>
          You also get lifetime access to ChadGPT Chat Box for all your AI
          writing needs!
        </div>
        <button className='bg-[#20FDC9] rounded-full text-black px-[39px] py-2 text-base font-medium shadow-custom mt-[40px]'>
          Get ChadGPT
        </button>
        <img
          src='/images/Dashboard.png'
          className='mt-[20px] z-9 w-[90%]'
          style={{ zIndex: 9 }}
        />
      </div>
    </div>
  );
};

export default Hero;
