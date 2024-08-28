import React, { useState } from "react";

function AccordionItem({ title, children, visible }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='mb-4'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full bg-[#353740] text-left focus:outline-none text-white flex flex-row items-center justify-between'
      >
        <div>{title}</div>
        <img src='/images/down.svg' />
      </button>
      <div
        className={`mt-2 overflow-hidden transition-transform text-white duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {children}
      </div>
      {visible ? <hr className='border-[#4E505A] mt-2' /> : ""}
    </div>
  );
}

export default AccordionItem;
