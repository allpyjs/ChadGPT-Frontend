import React, { useEffect, useState } from "react";
import axios from "axios";

import "./PromptAddModal";

const ConvertPromptModal = ({
  convertcontent,
  email,
  handleHideModal,
  updatePromptTree,
  handleUpdatePromptTree,
}) => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [content, setcontent] = useState(convertcontent);

  const onSavePrompt = (e) => {
    axios
      .post("/api/chatbot/convertprompt", {
        email: email,
        name: name,
        description: description,
        content: content,
      })
      .then((res) => {
        handleUpdatePromptTree(res.data.result);
        handleHideModal();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setcontent(convertcontent);
  }, [convertcontent]);

  return (
    <div className='mx-[40px] overflow-y-auto flex flex-col custom-scrollbar text-white'>
      <div>
        <label htmlFor='name'>Name</label>
        <input
          name='name'
          value={name}
          className='w-full text-[20px] p-[5px] border-[1px]  rounded-[5px] bg-[#555555] border-[#555555] focus:border-[#555555]'
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className='mt-[20px]'>
        <label htmlFor='description'>Description</label>
        <textarea
          name='description'
          value={description}
          className='w-full text-[20px] p-[5px] border-[1px] rounded-[5px] resize-none bg-[#555555] border-[#555555] focus:border-[#555555]'
          rows={4}
          onChange={(e) => setdescription(e.target.value)}
        />
      </div>
      <div className='mt-[20px]'>
        <label htmlFor='name'>Prompt Content</label>
        <textarea
          name='content'
          value={content}
          className='w-full text-[20px] p-[5px] border-[1px] rounded-[5px] resize-none bg-[#555555] border-[#555555] focus:border-[#555555]'
          rows={8}
          onChange={(e) => setcontent(e.target.value)}
        />
      </div>
      <div className='w-full flex space-x-2'>
        <button
          className='text-[15px] mt-[10px] border-[1px] rounded-[5px] p-[10px] hover:border-[2px] w-full bg-[#333333] border-[#333333]'
          onClick={onSavePrompt}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ConvertPromptModal;
