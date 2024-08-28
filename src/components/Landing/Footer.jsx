import React from "react";

const Footer = () => {
  const hrStyle = {
    backgroundColor: "#61626D",
    height: "1px",
    border: "none",
  };
  return (
    <div className='bg-[#202123] px-[30px] lg:px-[180px] pt-[40px]'>
      <div className='flex flex-col lg:flex-row'>
        <div>
          <div className='text-[#20FDC9] text-24 mt-[20px] text-center md:text-start'>
            LOCK IN YOUR INTRODUCTORY PRICE BEFORE IT GOES UP
          </div>
          <div className='text-white text-40 font-medium mt-[20px] text-center md:text-start'>
            Ready for a Revolutionary AI Writing Experience?
          </div>
          <div className='text-[#B6B6B6] text-18 mt-[10px]'>
            For just $15/mo., you unlock unprecedented access to enhanced
            productivity and precision, transforming the way you work and
            create.
          </div>
          <div className='text-[#B6B6B6] text-18 mt-[10px]'>
            Why settle for less? Amplify your output, gain the competitive edge,
            and revolutionize your productivity with ChadGPT.
          </div>
          <div className='text-[#B6B6B6] text-18 mt-[10px]'>
            he future of work is here. And it’s just a click away.
          </div>
        </div>
        <div className='flex flex-row justify-center lg:justify-end items-center w-[200px]'>
          <button className='mt-[30px] bg-[#20FDC9] rounded-full text-black px-[39px] py-2 text-base font-medium shadow-custom'>
            Start Today
          </button>
        </div>
      </div>
      <hr style={hrStyle} className='mt-[20px]' />
      <div className='flex flex-row justify-between py-[50px]'>
        <div>
          <img src='/images/logo.svg' className='w-[100px]' />
        </div>
        <div className='text-white'>Copyright © 2023 ChadGPT</div>
      </div>
    </div>
  );
};

export default Footer;
