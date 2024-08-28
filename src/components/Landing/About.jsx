import React, {useState, useEffect} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import './About.css';

const About = () => {
  return (
    <div>
      <div className='absolute top-[2200px] left-[0px] z-1 w-[450px] h-[500px] bg-custom-blue rounded-full blur-[225px]'></div>
      <div className='bg-[#202123]'>
        <div className='flex flex-col md:flex-row pt-[60px]'>
          <div className='pr-[80px] pl-[80px]'>
            <div className='text-custom-green text-26 uppercase tracking-wide text-center'>
              POWER YOUR PRODUCTIVITY WITH CHADGPT
            </div>
            <div className='font-medium text-white text-[32px] text-center mt-[30px] sm:text-[40px]'>
              Your Affordable, User-Friendly AI Writing Companion
            </div>
            <div className='text-18 text-[#B6B6B6] mt-[30px]'>
              Meet ChadGPT, the intelligent writing assistant built for business
              owners, students, and professionals. Our simple, intuitive
              interface merges advanced AI technology with user-friendly design,
              giving you a competitive edge without the complexity.
            </div>
            <div className='flex sm:justify-start justify-center'>
              <button className='text-center bg-[#20FDC9] rounded-full text-black px-[39px] py-2 text-base font-medium shadow-custom mt-[30px]'>
                Get Access Now
              </button>
            </div>
          </div>
          <div className='relative w-[1100px] h-[500px] mr-[80px] hidden lg:block'>
            <img
              src='/images/about.png'
              alt='Your Image'
              className='w-full h-auto absolute top-0 left-0 hidden lg:block'
            />
            <div className='flex flex-col items-center w-full h-full pt-[160px]  relative z-100'>
              <img src='/images/logo.svg' className='w-[170px] ' />
              <button className='mt-[30px] bg-[#20FDC9] rounded-full text-black px-[39px] py-2 text-base font-medium shadow-custom'>
                Start Today
              </button>
            </div>
          </div>
        </div>
        <div
          className='flex flex-row justify-center  w-full px-[80px] mt-[40px] flex-wrap lg:justify-between lg:flex-nowrap'
          style={{ zIndex: 9 }}
        >
          <div className='mx-[10px] mt-[20px] z-1 lg:w-1/3 rounded-lg bg-[#353740] text-white hover:bg-[#20FDC9] hover:text-black p-8'>
            <div className='text-30'>
              Seamless Integration, Powerful Productivity
            </div>
            <div className='text-18'>
              With ChadGPT, you get a seamless, intuitive interface that
              effortlessly weaves into your workflow. The result? Unstoppable
              productivity powered by cutting-edge AI. Say hello to the future
              of work.
            </div>
          </div>
          <div className='mx-[10px] mt-[20px] z-1  lg:w-1/3 w-full rounded-lg bg-[#353740] text-white hover:bg-[#20FDC9] hover:text-black p-8'>
            <div className='text-30'>Simple, User-Friendly Interface</div>
            <div className='text-18'>
              Say goodbye to complex setups. With ChadGPT, you get a
              straightforward UI that's easy to navigate, even for beginners.
            </div>
          </div>
          <div className='mx-[10px] mt-[20px] z-1 lg:w-1/3 w-full rounded-lg bg-[#353740] text-white hover:bg-[#20FDC9] hover:text-black p-8'>
            <div className='text-30'>Pre-loaded & Premium Prompts</div>
            <div className='text-18'>
              Boost your output with our pre-loaded prompts. And when you're
              ready for more, unlock the potential of our premium prompts.
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center mt-[120px]'>
          <div className='text-[#20FDC9] text-[20px] md:text-24 text-center'>
            REGISTER TODAY FOR THIS FREE GAME CHANGER
          </div>
          <div className='text-white text-[34px] lg:text-[50px] font-medium text-center'>
            The Ultimate Prompt Generator
          </div>
          <div className='text-[#B6B6B6] text-18'>
            Premium, Tailored Prompts for Enhanced Results.
          </div>
          <div className='text-[#B6B6B6] text-18'>
            Included Free When You Sign Up Today.
          </div>
          <div className="w-3/4 lg:h-[700px] my-[30px] rounded-lg overflow-hidden">
            <video src='/images/video.mp4' className="w-full h-full object-cover z-q" style={{ zIndex: 9 }} autoplay controls></video>
          </div>

          <button className='bg-[#20FDC9] rounded-full text-black px-[39px] py-2 text-base font-medium shadow-custom'>
            Get This Premium Prompt For Free
          </button>
        </div>
     
        <div className='flex flex-col items-center py-[70px]'>
          <div className='bg-testominal rounded-lg w-5/6 px-[30px] md:px-[100px] py-[70px]'>
            <div className='text-[#20FDC9] text-24'>Testomonials</div>
            <div className='text-white text-[25px] text-center lg:text-[35px] font-medium leading-8'>
              Join Thousands of Users Who've Upgraded their Workflow.
            </div>
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>  
              <div className='flex flex-col lg:flex-row text-white'>
                <div className='relative mt-[40px]'>
                  <img
                    src='/images/1.jpg'
                    className='rounded-full w-[1200px]'
                  />
                  <img
                    src='/images/emoj.png'
                    className='absolute rounded-full right-0 top-0 w-[80px] z-10'
                  />
                </div>
                <div className='mt-[30px] lg:p-[80px] lg:mt-[0px]'>
                  <div className='text-[20px] md:text-[30px] leading-6 w-full'>
                    As a newcomer to AI writing, I was amazed by how The Ultimate
                    Prompt Generator made it so easy for me to create high-quality
                    content! It has been a game-changer for my business.
                  </div>
                  <div className='mt-[30px]'>Jackson S.</div>
                  <div>CEO of Mornique</div>
                </div>
              </div>
              </SwiperSlide>
              <SwiperSlide>  
              <div className='flex flex-col lg:flex-row text-white'>
                <div className='relative mt-[40px]'>
                  <img
                    src='/images/2.jpg'
                    className='rounded-full w-[1600px]'
                  />
                  <img
                    src='/images/emoj.png'
                    className='absolute rounded-full right-0 top-0 w-[80px] z-10'
                  />
                </div>
                <div className='mt-[30px] lg:p-[80px] lg:mt-[0px]'>
                  <div className='text-[20px] md:text-[30px] leading-6 w-full'>
                  ChadGPT's easy-to-use interface and powerful AI have revolutionized my workflow. The pre-loaded and premium prompts have driven my productivity to new heights. I'd recommend ChadGPT to any professional wanting to leverage AI in their work.
                  </div>
                  <div className='mt-[30px]'>Sarah W.</div>
                  <div>Business Owner, Williams & Co.</div>
                </div>
              </div>
              </SwiperSlide>
              <SwiperSlide>  
              <div className='flex flex-col lg:flex-row text-white'>
                <div className='relative mt-[40px]'>
                  <img
                    src='/images/3.jpg'
                    className='rounded-full w-[1400px]'
                  />
                  <img
                    src='/images/emoj.png'
                    className='absolute rounded-full right-0 top-0 w-[80px] z-10'
                  />
                </div>
                <div className='mt-[30px] lg:p-[80px] lg:mt-[0px]'>
                  <div className='text-[20px] md:text-[30px] leading-6 w-full'>
                  The Ultimate Prompt Generator is a game-changer. The precision and detail it brings to AI communication are invaluable. My outputs have never been this clear and persuasive. Worth every penny!                  </div>
                  <div className='mt-[30px]'>David J.</div>
                  <div>Marketing Professional, Creative Solutions Ltd.</div>
                </div>
              </div>
              </SwiperSlide>
              <SwiperSlide>  
              <div className='flex flex-col lg:flex-row text-white'>
                <div className='relative mt-[40px]'>
                  <img
                    src='/images/4.jpg'
                    className='rounded-full w-[1600px]'
                  />
                  <img
                    src='/images/emoj.png'
                    className='absolute rounded-full right-0 top-0 w-[80px] z-10'
                  />
                </div>
                <div className='mt-[30px] lg:p-[80px] lg:mt-[0px]'>
                  <div className='text-[20px] md:text-[30px] leading-6 w-full'>
                  ChadGPT's simplicity and power have transformed the way I work. Its intuitive interface and curated prompts make AI-assisted writing a breeze. It's a reliable tool that offers value far beyond its cost. Highly recommended!	    
                    </div>
                  <div className='mt-[30px]'>Emily M.</div>
                  <div>Freelance Writer</div>
                </div>
              </div>
              </SwiperSlide>
              <SwiperSlide>  
              <div className='flex flex-col lg:flex-row text-white'>
                <div className='relative mt-[40px]'>
                  <img
                    src='/images/5.jpg'
                    className='rounded-full w-[1800px]'
                  />
                  <img
                    src='/images/emoj.png'
                    className='absolute rounded-full right-0 top-0 w-[80px] z-10'
                  />
                </div>
                <div className='mt-[30px] lg:p-[80px] lg:mt-[0px]'>
                  <div className='text-[20px] md:text-[30px] leading-6 w-full'>
                  ChadGPT is a game-changer for business owners. Its seamless integration into my workflow and the time saved is incomparable. And the Ultimate Prompt Generator? It's like having a dedicated professional crafting the perfect prompts, every time. Astounding results!                    
                  </div>
                  <div className='mt-[30px]'>Victor L.</div>
                  <div>CEO, Tech Innovations Inc.</div>
                </div>
              </div>
              </SwiperSlide>
            </Swiper>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
