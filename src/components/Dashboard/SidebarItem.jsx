import React from "react";

const SidebarItem = ({ content }) => {
  return (
    <>
      {" "}
      <div className='flex flex-row my-[15px] space-x-2'>
        <img src='/images/bubble.svg' className='w-[20px]' />
        <span className='font-small text-white'>{content}s</span>
      </div>
      <hr className='border-1 border-[#4E505A] w-[90%]' />
    </>
  );
};

export default SidebarItem;
