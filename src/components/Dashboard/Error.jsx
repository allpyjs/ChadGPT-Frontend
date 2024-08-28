import React from "react";

const Error = () => {
  return (
    <div className='flex flex-col items-center'>
      <i class='fas fa-triangle-exclamation fa-beat text-[80px]'></i>
      <div className='text-[20px] mt-[10px]'>Something went wrong!</div>
    </div>
  );
};

export default Error;
