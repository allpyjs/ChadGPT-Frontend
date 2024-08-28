import React, { useState } from "react";
import "./PromptModal.css";

const PromptAddModal = ({ handleAddPrompt, handleHideAddPromptModal }) => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [content, setcontent] = useState("");

  const handleSubmit = (e) => {
    handleAddPrompt(name, description, content);
    setname("");
    setdescription("");
    setcontent("");

    handleHideAddPromptModal();
  };

  return (
    <div className="mx-[40px] overflow-y-auto flex flex-col text-white">
      <div>
        <label htmlFor="name">Name</label>
        <input
          name="name"
          value={name}
          className="w-full text-[20px] p-[5px] border-[1px]  rounded-[5px] bg-[#555555] border-[#555555] focus:border-[#555555]"
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className="mt-[20px]">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={description}
          className="w-full text-[20px] p-[5px] border-[1px] rounded-[5px] resize-none bg-[#555555] border-[#555555] focus:border-[#555555]"
          rows={4}
          onChange={(e) => setdescription(e.target.value)}
        />
      </div>
      <div className="mt-[20px]">
        <label htmlFor="name">Prompt Content</label>
        <textarea
          name="content"
          value={content}
          className="w-full text-[20px] p-[5px] border-[1px] rounded-[5px] resize-none bg-[#555555] border-[#555555] focus:border-[#555555] custom-scrollbar"
          rows={8}
          onChange={(e) => setcontent(e.target.value)}
        />
      </div>
      <div>
        <button
          className="mt-[10px] w-full border-[1px] rounded-[5px] p-[10px] hover:border-[2px] bg-[#333333] border-[#333333]"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PromptAddModal;
