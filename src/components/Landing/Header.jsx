import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='bg-[#202123] text-white pt-[20px] relative w-full'>
      <div className='container mx-auto py-4'>
        <div className='flex justify-between items-center mx-[20px]'>
          <div className='flex flex-row'>
            <div>
              <a href='/'>
                <img src='/images/logo.svg' alt='logo' />
              </a>
            </div>
            <div className='hidden lg:block'>
              <div className='flex flex-row'>
                <div className=' pl-[60px] hover:text-[#20FDC9] hover:cursor-pointer text-17'>
                  Home
                </div>
                <div className='pl-[60px] hover:text-[#20FDC9] hover:cursor-pointer text-17'>
                  Resources
                </div>
                <div className='pl-[60px] hover:text-[#20FDC9] hover:cursor-pointer text-17'>
                  Courses
                </div>
                <div className='pl-[60px] hover:text-[#20FDC9] hover:cursor-pointer text-17'>
                  Princing
                </div>
                <div className='pl-[60px] hover:text-[#20FDC9] hover:cursor-pointer text-17'>
                  Support
                </div>
              </div>
            </div>
          </div>

          <div className='lg:hidden'>
            <button
              onClick={toggleMenu}
              className='text-2xl text-white focus:outline-none'
            >
              {isOpen ? (
                <i className='fas fa-times'></i>
              ) : (
                <i className='fas fa-bars'></i>
              )}
            </button>
          </div>
          {/* Slide-in sidebar */}
          <div
            className={`${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden fixed inset-y-0 left-0 w-64 h-full bg-[#202123] text-white transform transition-transform duration-300 ease-in-out z-10`}
          >
            <nav className='mt-4 z-1000'>
              <NavLink
                to='/'
                onClick={toggleMenu}
                className='block px-4 py-2 hover:text-[#20FDC9] text-[25px]'
              >
                Home
              </NavLink>
              <NavLink
                to='/resources'
                onClick={toggleMenu}
                className='block px-4 py-2 hover:text-[#20FDC9]  text-[25px]'
              >
                Resources
              </NavLink>
              <NavLink
                to='/courses'
                onClick={toggleMenu}
                className='block px-4 py-2 hover:text-[#20FDC9]  text-[25px]'
              >
                Courses
              </NavLink>
              <NavLink
                to='/pricing'
                onClick={toggleMenu}
                className='block px-4 py-2 hover:text-[#20FDC9]  text-[25px]'
              >
                Pricing
              </NavLink>
              <NavLink
                to='/support'
                onClick={toggleMenu}
                className='block px-4 py-2 hover:text-[#20FDC9]  text-[25px]'
              >
                Support
              </NavLink>
              <NavLink
                to='/login'
                onClick={toggleMenu}
                className='block px-4 py-2 hover:text-[#20FDC9]  text-[25px]'
              >
                Login
              </NavLink>
            </nav>
          </div>
          <div className='lg:ml-4 hidden'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search'
                className='bg-[#202123] pl-10 pr-4 py-2 border rounded-full border-gray-300 focus:ring focus:ring-blue-200'
              />
              <div className='absolute left-3 top-2'>
                <i className='fas fa-search text-gray-400'></i>
              </div>
            </div>
          </div>
          <div className='lg:ml-4 hidden lg:block'>
            <NavLink to='/login'>
              <button className='bg-[#20FDC9] rounded-full text-black px-10 py-2 text-base font-medium shadow-custom'>
                Login
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
