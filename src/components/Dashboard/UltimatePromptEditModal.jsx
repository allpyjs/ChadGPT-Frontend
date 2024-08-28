import React, { useEffect, useState } from "react";
import axios from "axios";

import "./PromptAddModal";

const PromptEditModal = ({
  promptid,
  handleUsePrompt,
  email,
  handleUpdatePromptTree,
  handleHideEditPromptModal,
  setcustomprompttree,
  admin,
}) => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [content, setcontent] = useState("");

  const onSavePrompt = (e) => {
    axios
      .post("/api/chatbot/saveultimateprompt", {
        id: promptid,
        email: email,
        name: name,
        description: description,
        content: content,
      })
      .then(async (res) => {
        handleUpdatePromptTree(res.data.result);
        handleHideEditPromptModal();

        setcustomprompttree(res.data.result);
        setname("");
        setdescription("");
        setcontent("");
      })
      .catch((err) => {});
  };

  const onUsePrompt = (e) => {
    handleUsePrompt(content);
    handleHideEditPromptModal();
  };

  const fetchPromptData = async () => {
    console.log(admin);
    axios
      .post(`/api/chatbot/getultimatepromptbyid`, {
        email: email,
        id: promptid,
      })
      .then((res) => {
        const data = res.data.result;
        console.log(res.data.result);
        setname(data.name);
        setdescription(data.description);
        setcontent(data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(promptid);
    fetchPromptData();
  }, [promptid, email]);

  return (
    <div className="mx-[40px] overflow-y-auto flex flex-col custom-scrollbar text-white">
      <div>
        <label htmlFor="name">Name</label>
        <input
          name="name"
          value={name}
          disabled={!admin}
          className="w-full text-[20px] p-[5px] border-[1px]  rounded-[5px] bg-[#555555] border-[#555555] focus:border-[#555555]"
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className="mt-[20px]">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          disabled={!admin}
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
          disabled={!admin}
          value={content}
          className="w-full text-[20px] p-[5px] border-[1px] rounded-[5px] resize-none bg-[#555555] border-[#555555] focus:border-[#555555]"
          rows={8}
          onChange={(e) => setcontent(e.target.value)}
        />
      </div>
      <div className="w-full flex space-x-2 mt-[10px]">
        {admin ? (
          <>
            {" "}
            <button
              className="border-[1px] rounded-[5px] p-[10px] w-1/2 hover:border-[2px] bg-[#333333] border-[#333333]"
              onClick={onSavePrompt}
            >
              Save
            </button>
            <button
              className="border-[1px] rounded-[5px] p-[10px] w-1/2 hover:border-[2px] bg-[#333333] border-[#333333]"
              onClick={onUsePrompt}
            >
              Use
            </button>
          </>
        ) : (
          <button
            className="border-[1px] rounded-[5px] p-[10px] w-full hover:border-[2px] bg-[#333333] border-[#333333]"
            onClick={onUsePrompt}
          >
            Use
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptEditModal;
