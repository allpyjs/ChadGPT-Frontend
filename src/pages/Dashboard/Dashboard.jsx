import React, { useState, useRef, useEffect, useCallback } from "react";

import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { SSE } from "sse.js";

import { Tiktoken } from "@dqbd/tiktoken/lite";
import cl100k_base from "@dqbd/tiktoken/encoders/cl100k_base.json";

import Markdown from "./../../components/Dashboard/Markdown";
import { db } from "./../../services/firebase";
import {
  query,
  getDocs,
  collection,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

import "./Dashboard.css";
import Error from "./../../components/Dashboard/Error";
import SidebarHistory from "../../components/Dashboard/SidebarHistory";
import SidebarPrompt from "../../components/Dashboard/SidebarPrompt";
import SidebarUltimatePrompt from "../../components/Dashboard/SidebarUltimatePrompt";

import PromptAddModalContent from "../../components/Dashboard/PromptAddModalContent";
import PromptEditModal from "../../components/Dashboard/PromptEditModal";
import UltimatePromptEditModal from "../../components/Dashboard/UltimatePromptEditModal";
import ConvertPromptModal from "../../components/Dashboard/ConvertPromptModal";
import PromptModal from "../../components/Dashboard/PromptModal";
import PricingModal from "../../components/Dashboard/PricingModal";
import ChangePasswordModal from "./../../components/Dashboard/ChangePassword";
import DataModal from "./../../components/Dashboard/DataModal";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import AddUltimatePromptModal from "./../../components/Dashboard/AddUltimatePromptModal";
import AddUltimatePromptModalContent from "./../../components/Dashboard/AddUltimatePromptModalContent";

function countTokens(text) {
  const tokens = text.match(/\w+/g);
  return tokens ? tokens.length : 0;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const config = {
  runtime: "edge",
};
const Dashboard = () => {
  const inputRef = useRef();
  const messagesEndRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rows, setRows] = useState(1);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [nameMark, setNameMark] = useState("");
  const [pro, setpro] = useState(false);
  const [credit, setcredit] = useState(0);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [model, setModel] = useState("3.5");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gptLoading, setGPTLoading] = useState(false);
  const [pricingModelOpen, setPricingModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState(false);
  const [historytreedata, sethistorytreedata] = useState([]);
  const [prompttreedata, setprompttreedata] = useState([]);
  const [flag, setflag] = useState(false);
  const [id, setid] = useState(null);
  const [addpromptmodalopen, setaddpromptmodalopen] = useState(false);
  const [editpromptmodalopen, seteditpromptmodalopen] = useState(false);
  const [promptid, setpromptid] = useState(null);
  const [convertprompt, setconvertprompt] = useState("");
  const [convertPromptModalVisible, setConvertPromptModalvisible] =
    useState(false);
  const [provider, setprovider] = useState("");
  const [isLgScreen, setIsLgScreen] = useState(false);

  const [protype, setprotype] = useState("");
  const [leftVisible, setleftVisible] = useState(false);
  const [rightVisible, setrightVisible] = useState(false);
  const [changepasswordModalVisible, setchangepasswordModalVisible] =
    useState(false);
  const [authProvider, setauthProvider] = useState("");
  const [admin, setadmin] = useState(false);
  const [result, setResult] = useState("");
  const [customprompt, setcustomprompt] = useState([]);
  const [ultimateprompt, setultimateprompt] = useState([]);
  const [ultimatepromptid, setultimatepromptid] = useState(null);
  const [addultimatepromptmodalopen, setaddultimatepromptmodalopen] =
    useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [editultimatepromptmodalopen, seteditultimatepromptmodalopen] =
    useState(false);
  const [copying, setcopying] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [historySummaryItems, setHistorySummaryItems] = useState([
    "Hello1",
    "Hello2",
    "Hello3",
  ]);

  const menuRef = useRef(null);
  const resultRef = useRef();
  const chatContainerRef = useRef();
  const textareaRef = useRef();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  function throttle(func, limit) {
    let lastFunc;
    let lastRan = 0;

    return function (...args) {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const getChatGPTResponse1 = () => {
    if (message === "") return;

    if (!pro) {
      if (credit <= 0) {
        toast.error("Please checkout to use continuously.", {
          hideProgressBar: true,
          draggable: true,
        });
        setPricingModalOpen(true);
        return;
      } else {
        setcredit((credit) => credit - 1);
      }
    }

    setGPTLoading(true);
    setMessage("");

    let count = 0;
    let messagesToSend = [];

    let systemMsg =
      "You are an AI write designed to converse with humans in a friendly and detailed manner. When responding, you provide rich context and specificity within your answers, always using Markdown format to structure the content. You utilize headers as bigger font, bullet points, numberic lists, bold and italicized text for emphasis, blockquotes for highlighting important information, and links when referring to external resources. If you do not have the information requested, you candidly acknowledge this with honesty. Your goal is to make the Markdown content not only informative and accurate but also visually appealing and easy to navigate in a text-based environment and no need image.";
    let systemMsgLen = countTokens(systemMsg);
    updateCredit();

    let messagesTemp = [
      {
        role: "system",
        content:
          "You are an AI write designed to converse with humans in a friendly and detailed manner. When responding, you provide rich context and specificity within your answers, always using Markdown format to structure the content. You utilize headers as bigger font, bullet points, numberic lists, bold and italicized text for emphasis, blockquotes for highlighting important information, and links when referring to external resources. If you do not have the information requested, you candidly acknowledge this with honesty. Your goal is to make the Markdown content not only informative and accurate but also visually appealing and easy to navigate in a text-based environment and no need image.",
      },
      ...messages,
      { role: "user", content: message },
    ];

    let test = 0;

    let tokCnt = model === "3.5" ? 2000 : 5000;

    let tokenCount = systemMsgLen;
    for (let i = messagesTemp.length - 1; i >= 0; i--) {
      let messageTemp = messagesTemp[i];
      if (messageTemp.role === "system") {
        messagesToSend = [
          {
            role: "system",
            content:
              "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
          },
          ...messagesToSend,
        ];
        break;
      }

      const cntToken = countTokens(messageTemp.content);

      test = tokenCount + cntToken + 500;

      if (tokenCount + cntToken + 500 > tokCnt) {
        messagesToSend = [
          {
            role: "system",
            content:
              "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
          },
          ...messagesToSend,
        ];
        break;
      }
      messagesToSend = [messageTemp, ...messagesToSend];
      tokenCount += cntToken;
    }

    console.log(tokenCount);
    console.log(messagesToSend);

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);

    setResult("");
    resultRef.current = "";
    let url = "https://api.openai.com/v1/chat/completions";
    let data = {
      model: model === "3.5" ? "gpt-3.5-turbo" : "gpt-4",
      temperature: 0.3,
      messages: messagesToSend,
      stream: true,
      max_tokens: 1000,
    };

    let source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
      },
      method: "POST",
      payload: JSON.stringify(data),
    });

    setMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        content: "",
      },
    ]);

    source.addEventListener("message", (e) => {
      if (e.data != "[DONE]") {
        let payload = JSON.parse(e.data);
        let text = payload.choices[0]?.delta?.content;
        // scrollToBottom();
        if (text != "\n" && text != undefined) {
          resultRef.current = resultRef.current + text;

          // handleScrollDown();
          setMessages((messages) => [
            ...messages.slice(0, -1),
            {
              role: "assistant",
              content: resultRef.current,
            },
          ]);
        }
      } else {
        // Saving the gpt response to server
        let response = resultRef.current;
        axios
          .post("/api/chatbot/savehistory", { message, response, email, id })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });

        setGPTLoading(false);
        source.close();
      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) {
        setGPTLoading(false);
      }
    });

    source.stream();
  };

  const setProVersion = (pr, type) => {
    setpro(pr);
    setprotype(type);
  };

  const getCredit = async () => {
    const uid = localStorage.getItem("uid");

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("uid", "==", uid));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      setcredit(userData.credit);
      setpro(userData.pro);
      setprotype(userData.protype);
    } catch (error) {}
  };

  useEffect(() => {
    const handleResize = (e) => {
      setIsLgScreen(window.innerWidth >= 1024); // Adjust the width value to match your desired breakpoint
    };
    handleResize();
    getCredit();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    fetchUserInfo();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("resize", handleResize);
    };
  }, []);

  // Consts
  const maxRows = 10;
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("Auth Token");
        localStorage.removeItem("uid");
        navigate("/");
        toast.success("You are logged out!", {
          hideProgressBar: true,
          draggable: true,
        });
      })
      .catch((error) => {});
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    const lineCount = message.split(/\r*\n/).length;
    if (lineCount < maxRows && lineCount > 1) setRows(lineCount - 1);
  };

  const handleKeyDown1 = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (rows < maxRows) {
        setRows(rows + 1);
      }
      setMessage(message + "\n");
      return;
    } else if (e.key === "Enter") {
      e.preventDefault();
      setRows(1);
      getChatGPTResponse1();
    }

    if (e.code === "Backspace" || e.key === "Backspace") {
      const lineCount = message.split(/\r*\n/).length;

      if (lineCount < maxRows && lineCount > 1) setRows(lineCount - 1);
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  useEffect(() => {
    handleScrollDown();
    console.log("Hello");
  }, [messages]);

  const fetchUserInfo = async () => {
    try {
      let uid = localStorage.getItem("uid");
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const doc = await getDocs(q);
      if (doc !== undefined) {
        const data = doc.docs[0].data();
        setName(data.name);
        setNameMark(data.name.split(" ")[0][0] + data.name.split(" ")[1][0]);
        setEmail((email) => data.email);
        setauthProvider(data.authProvider);
        setadmin((admin) => data.admin);
        await axios
          .post("/api/chatbot/gethistorytreedata", { email: data.email })
          .then((res) => {
            sethistorytreedata(res.data.tree);
          })
          .catch((err) => {});

        await axios
          .post("/api/chatbot/getsysprompttree")
          .then(async (res) => {
            setultimateprompt(res.data.result);
            await axios
              .post("/api/chatbot/getprompttreedata", { email: data.email })
              .then((res1) => {
                setcustomprompt(res1.data.result);
                setprompttreedata([...res.data.result, ...res1.data.result]);
                console.log(prompttreedata);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromptItemSelect = () => {};

  // useEffect(() => {
  //   // if (loading) return;
  //   // if (!user) return navigate("/");
  //   fetchUserInfo();
  // }, []);

  const updateCredit = async () => {
    let uid = localStorage.getItem("uid");
    const userCollection = collection(db, "users");

    const q = query(userCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const userDoc = querySnapshot.docs[0];

    const useDocRef = doc(db, "users", userDoc.id);
    await updateDoc(useDocRef, {
      credit: credit,
    });
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? "auto" : "hidden"
      }`;
    }
  }, [message]);

  const getChatGPTResponse = async () => {
    if (message === "") return;

    if (!pro) {
      if (credit <= 0) {
        toast.error("Please checkout to use continuously.", {
          hideProgressBar: true,
          draggable: true,
        });
        setPricingModalOpen(true);
        return;
      } else {
        setcredit((credit) => credit - 1);
      }
    }

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);
    setGPTLoading(true);

    setMessage("");

    await axios
      .post("/api/chatbot/getresponse", { message, model, email, id })
      .then((res) => {
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: res.data.response },
        ]);

        setGPTLoading(false);
        updateCredit();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScrollEnabled]);

  const handleItemsSelect = (id) => {
    setflag(true);
    setid(id);
    axios
      .post("/api/chatbot/gethistorybyid", { email: email, id: id })
      .then((res) => {
        setMessages(res.data.result);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, gptLoading]);

  const handleAddNewChat = (e) => {
    setflag(true);
    axios
      .post("/api/chatbot/addnewchat", { email: email })
      .then((res) => {
        sethistorytreedata(res.data.result);
        setid(res.data.id);
        setMessages([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddNewFolder = (e) => {
    axios
      .post("/api/chatbot/addnewfolder", { email: email })
      .then((res) => {
        sethistorytreedata(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddNewPromptFolder = (e) => {
    axios
      .post("/api/chatbot/addnewpromptfolder", { email: email })
      .then((res) => {
        setcustomprompt(res.data.result);
        setprompttreedata([...ultimateprompt, ...res.data.result]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddUltimateNewPromptFolder = (e) => {
    axios
      .post("/api/chatbot/addultimatenewpromptfolder")
      .then((res) => {
        setultimateprompt(res.data.result);
        console.log(res.data.result);
        setprompttreedata([...res.data.result, ...customprompt]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPrompt = (name, description, content) => {
    axios
      .post("/api/chatbot/addnewprompt", {
        email: email,
        name: name,
        description: description,
        content: content,
      })
      .then((res) => {
        setcustomprompt(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUltimateAddPrompt = (name, description, content) => {
    axios
      .post("/api/chatbot/addultimatenewprompt", {
        name: name,
        description: description,
        content: content,
      })
      .then((res) => {
        setultimateprompt(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddUltimatePrompt = (name, description, content) => {
    axios
      .post("/api/chatbot/addultimatenewprompt", {
        name: name,
        description: description,
        content: content,
      })
      .then((res) => {
        setultimateprompt(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSavePrompt = (name, description, content, promptid) => {};

  const handleUpdatePromptTree = (treeData) => {
    setcustomprompt(treeData);
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
      } else {
        setAutoScrollEnabled(true);
      }
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    throttledScrollDown();
  }, [throttledScrollDown]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
    } else if (e.key === "Tab") {
      e.preventDefault();
    } else if (e.key === "Enter") {
      e.preventDefault();
      console.log(message);
      getChatGPTResponse1();
    } else if (e.key === "Escape") {
      e.preventDefault();
    } else {
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessage(message + "\n");
    } else if (e.key === "/" && e.metaKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="h-screen bg-[#202123] flex flex-row justify-between select-none overflow-x-hidden relative">
      {pricingModelOpen && (
        <Elements stripe={stripePromise}>
          <PricingModal
            title="Get a Pro Account"
            modalOpen={pricingModelOpen}
            setModalOpen={setPricingModalOpen}
            name={name}
            email={email}
            setProVersion={setProVersion}
            protype={protype}
            pro={pro}
          />
        </Elements>
      )}
      {addpromptmodalopen && (
        <PromptModal
          title="New Prompt Template"
          modalOpen={addpromptmodalopen}
          setModalOpen={setaddpromptmodalopen}
          data-theme="dark"
        >
          <PromptAddModalContent
            handleAddPrompt={handleAddPrompt}
            handleHideAddPromptModal={() => setaddpromptmodalopen(false)}
          />
        </PromptModal>
      )}

      {addultimatepromptmodalopen && (
        <PromptModal
          title="New Ultimate Prompt Template"
          modalOpen={addultimatepromptmodalopen}
          setModalOpen={setaddultimatepromptmodalopen}
          data-theme="dark"
        >
          <AddUltimatePromptModalContent
            handleAddPrompt={handleAddUltimatePrompt}
            handleHideAddPromptModal={() =>
              setaddultimatepromptmodalopen(false)
            }
          />
        </PromptModal>
      )}
      {editpromptmodalopen && (
        <PromptModal
          title="Edit prompt"
          modalOpen={editpromptmodalopen}
          setModalOpen={seteditpromptmodalopen}
          setcustomprompttree={(value) => setcustomprompt(value)}
          data-theme="dark"
          pro={pro}
          // className='bg-[#4E505A]'
        >
          <PromptEditModal
            promptid={promptid}
            email={email}
            admin={admin}
            handleSavePrompt={handleSavePrompt}
            handleUpdatePromptTree={handleUpdatePromptTree}
            handleHideEditPromptModal={() => seteditpromptmodalopen(false)}
            handleUsePrompt={(string) => setMessage(string)}
          />
        </PromptModal>
      )}
      {editultimatepromptmodalopen && (
        <PromptModal
          title="Edit Ultimate prompt"
          modalOpen={editultimatepromptmodalopen}
          setModalOpen={seteditultimatepromptmodalopen}
          setcustomprompttree={(value) => setultimateprompt(value)}
          data-theme="dark"
          pro={pro}
          // className='bg-[#4E505A]'
        >
          <UltimatePromptEditModal
            promptid={ultimatepromptid}
            email={email}
            admin={admin}
            handleUpdatePromptTree={(treeData) => setultimateprompt(treeData)}
            handleHideEditPromptModal={() =>
              seteditultimatepromptmodalopen(false)
            }
            handleUsePrompt={(string) => setMessage(string)}
          />
        </PromptModal>
      )}
      {convertPromptModalVisible && (
        <PromptModal
          title="Save prompt"
          modalOpen={convertPromptModalVisible}
          setModalOpen={setConvertPromptModalvisible}
          data-theme="dark"
        >
          <ConvertPromptModal
            convertcontent={convertprompt}
            email={email}
            handleHideModal={() => setConvertPromptModalvisible(false)}
            handleUpdatePromptTree={handleUpdatePromptTree}
          />
        </PromptModal>
      )}

      {changepasswordModalVisible && (
        <ChangePasswordModal
          title="Change Password"
          modalOpen={changepasswordModalVisible}
          setModalOpen={setchangepasswordModalVisible}
        />
      )}

      {dataModal && (
        <DataModal
          title="Subscriber Data"
          modalOpen={dataModal}
          setModalOpen={setDataModal}
        />
      )}

      <div
        className={`${
          !isLgScreen && leftVisible === true
            ? "fixed left-0 top-0 h-[95%] transform transition-transform duration-300 ease-in-out "
            : "hidden"
        } animate__animated ${
          isLgScreen ? "" : "animate__fadeInLeft"
        } lg:animate-none lg:animate-remove bg-[#353740] left-sider-bar border-[1px] border-[#202123]  z-1000 w-[250px] ml-0 md:ml-[20px] my-[20px] rounded-lg px-[15px] lg:flex md:flex-col max-w-[300px]`}
        style={{ zIndex: 10 }}
      >
        <div>
          <div className="bg-[#202123] my-[20px] rounded-md flex flex-row p-[6px] space-x-2 text-[15px] relative">
            {model === "3.5" ? (
              <div className="flex flex-row w-full">
                <div
                  onClick={() => setModel("3.5")}
                  className="bg-[#353740] rounded-md px-[5px] py-[10px] w-full border border-[#61626D] flex flex-row justify-center items-center hover:cursor-pointer"
                >
                  <img
                    src="/images/3.5.png"
                    className="h-[20px] pr-2"
                    alt="3.5"
                  />
                  <span className="text-white font-medium">GPT-3.5</span>
                </div>
                <div
                  onClick={() => {
                    if (pro) {
                      setModel("4");
                    } else {
                      setModel("3.5");
                      toast.error("Please checkout to use gpt-4.", {
                        hideProgressBar: true,
                        draggable: true,
                      });
                      setPricingModalOpen(true);
                    }
                  }}
                  className="bg-[#202123] rounded-md px-[5px] py-[10px] w-full border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                >
                  <img src="/images/4.png" className="h-[20px] pr-2" alt="4" />
                  <span className="text-white font-medium">GPT-4</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-row w-full">
                <div
                  className="bg-[#202123] rounded-md px-[5px] py-[10px] w-full border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                  onClick={() => setModel("3.5")}
                >
                  <img
                    src="/images/3.5.png"
                    className="h-[20px] pr-2"
                    alt="3.5"
                  />
                  <span className="text-white">GPT-3.5</span>
                </div>
                <div
                  onClick={() => {
                    if (pro) {
                      setModel("4");
                    } else {
                      setModel("3.5");
                      toast.error("Please checkout to use gpt-4.", {
                        hideProgressBar: true,
                        draggable: true,
                      });
                      setPricingModalOpen(true);
                    }
                  }}
                  className="bg-[#353740] rounded-md px-[5px] py-[10px] w-full border border-[#61626D] flex flex-row justify-center items-center hover:cursor-pointer"
                >
                  <img src="/images/4.png" className="h-[20px] pr-2" alt="4" />
                  <span className="text-white font-medium">GPT-4</span>
                </div>
              </div>
            )}
          </div>

          <div
            className="mt-[10px] rounded-md bg-[#353740] p-[8px] border border-[#61626D] flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-gray-800"
            onClick={handleAddNewChat}
          >
            <img src="/images/plus.svg" className="w-[20px]" alt="plus" />
            <span className="font-medium text-white text-16">New Chat</span>
          </div>
          <div
            className="mt-[10px] rounded-md bg-[#353740] p-[8px] border border-[#61626D] flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-gray-800"
            onClick={handleAddNewFolder}
          >
            <img src="/images/plus.svg" className="w-[20px]" alt="plus" />
            <span className="font-medium text-white text-16">New Folder</span>
          </div>
          <div className="z-1">
            <div className="mt-[20px] flex flex-col min-h-history-field max-h-history-field max-w-[220px] min-w-[220px] overflow-y-auto custom-scrollbar border-[1px] rounded-[8px] border-[#61626D] p-[10px]">
              <SidebarHistory
                items={historytreedata}
                email={email}
                id={id}
                onSelectItem={handleItemsSelect}
              />
            </div>
          </div>
        </div>
        <div className="mt-auto pb-[10px]  absolute bottom-[10px]">
          <div ref={menuRef} className="z-100">
            {isMenuOpen &&
              !pricingModelOpen &&
              !changepasswordModalVisible &&
              !dataModal && (
                <nav className="bg-gray-800 p-[3px] w-full max-w-[220px] min-w-[220px] animate__animated  rounded-[10px] z-1000 mb-[36px] fixed bottom-[60px] lg:bottom-[78px] transition-all duration-1000">
                  <div className="container mx-auto">
                    <ul className="flex text-white flex-col items-center justify-center z-100">
                      {authProvider === "local" && (
                        <li
                          className="hover:text-gray-300 w-full"
                          onClick={(e) => {
                            setchangepasswordModalVisible(true);
                          }}
                        >
                          <div className="hover:bg-[#202123] hover:cursor-pointer rounded-[10px] p-[15px]">
                            <div className="flex flex-row items-center space-x-2">
                              <i className="fa-solid fa-gear"></i>
                              <div className="text-white">Change Password</div>
                            </div>
                          </div>
                        </li>
                      )}
                      <li
                        className="hover:text-gray-300 w-full"
                        onClick={(e) => setPricingModalOpen(true)}
                      >
                        <div className="hover:bg-[#202123] hover:cursor-pointer rounded-[10px] p-[15px]">
                          <div className="flex flex-row items-center space-x-2">
                            <i className="fa-solid fa-tags"></i>
                            <div className="text-white">Pricing</div>
                          </div>
                        </div>
                      </li>
                      <li className="hover:text-gray-300 w-full">
                        <NavLink to="https://chadgpt.com/resources">
                          <div className="hover:bg-[#202123] hover:cursor-pointer rounded-[10px] p-[15px]">
                            <div className="flex flex-row items-center space-x-2">
                              <i className="fa-solid fa-folder-open"></i>
                              <div className="text-white">Resources</div>
                            </div>
                          </div>
                        </NavLink>
                      </li>
                      <li className="hover:text-gray-300 w-full">
                        <NavLink to="https://chadgpt.com/support">
                          <div className="hover:bg-[#202123] hover:cursor-pointer rounded-[10px] p-[15px]">
                            <div className="flex flex-row items-center space-x-2">
                              <i className="fa-solid fa-circle-question"></i>
                              <div className="text-white">Support</div>
                            </div>
                          </div>
                        </NavLink>
                      </li>
                      {admin && (
                        <li
                          className="hover:text-gray-300 w-full"
                          onClick={(e) => setDataModal(true)}
                        >
                          <div className="hover:bg-[#202123] hover:cursor-pointer rounded-[10px] p-[15px]">
                            <div className="flex flex-row items-center space-x-2">
                              <i className="fa-solid fa-server"></i>
                              <div className="text-white">Data</div>
                            </div>
                          </div>
                        </li>
                      )}
                      <li
                        className="hover:text-gray-300 w-full"
                        onClick={() => handleLogout()}
                      >
                        <div className="hover:bg-[#202123] hover:cursor-pointer rounded-[10px] p-[15px]">
                          <div className="flex flex-row items-center space-x-2">
                            <i i className="fa-solid fa-right-from-bracket"></i>
                            <div className="text-white">Logout</div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </nav>
              )}
            <div
              className={`absolute  bg-[#1a1a23] max-w-[220px] min-w-[220px] hover:bg-[#202123] hover:cursor-pointer rounded-[20px] p-[15px] w-full bottom-[10px] lg:bottom-[28px]`}
              onClick={() => toggleMenu()}
            >
              <div className="flex flex-row items-center justify-center w-full">
                <div className="bg-[#20FDC9] rounded-md p-[6px] text-20 font-bold">
                  {nameMark}
                </div>
                <div className="text-white ml-[5px] w-[175px] overflow-hidden">
                  {email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full flex flex-row justify-center my-[20px] relative">
        {leftVisible && (
          <i
            className="animate__animated animate__fadeInRight fixed lg:hidden fas fa-angle-double-left text-[#78F9CC] text-[60px] flex top-[330px] right-[40px] hover:scale-125 cursor-pointer"
            onClick={(e) => {
              setleftVisible(false);
            }}
          ></i>
        )}
        {rightVisible && (
          <i
            className="animate__animated animate__fadeInLeft fixed fas fa-angle-double-right text-[#78F9CC] text-[60px] flex top-[330px] left-[40px] hover:scale-125 cursor-pointer"
            onClick={(e) => setrightVisible(false)}
          ></i>
        )}

        <div className="mx-[20px] bg-[#353740] rounded-lg w-full">
          <div className="flex justify-between">
            <i
              className="btn-left m-[20px] lg:hidden fa-solid fa-bars text-[30px] text-[#ffffff] hover:text-[#ffff] cursor-pointer hover:scale-110"
              onClick={(e) => {
                setleftVisible(true);
                setrightVisible(false);
              }}
            ></i>
            <i
              className="btn-right m-[20px] lg:hidden fa-solid fa-layer-group text-[30px] text-[#ffffff] hover:text-[#ffffff] cursor-pointer hover:scale-110"
              onClick={(e) => {
                setrightVisible(true);
                setleftVisible(false);
              }}
            ></i>
          </div>
          {error ? (
            <div className="w-full flex justify-center items-center h-full">
              <Error />
            </div>
          ) : messages.length === 0 && flag === false ? (
            <div
              className="w-full flex flex-col items-center mt-[180px] overflow-x-hidden"
              id="chat-history"
              onScroll={handleScroll}
            >
              <img src="/images/logo.svg" className="w-[200px]" alt="logo" />
              <button
                className="mt-[50px] text-[20px] text-white flex items-center justify-center space-x-3 rounded-full border-[1px] p-[10px] border-[#4a9f7a] hover:bg-[#202123]"
                onClick={handleAddNewChat}
              >
                <img src="/images/plus.svg" alt="plus" />
                <span>New Chat</span>
              </button>
            </div>
          ) : (
            messages.length !== 0 && (
              <div className="min-h-chat-field-mobile  max-h-chat-field-mobile lg:min-h-chat-field lg:max-h-chat-field mx-0 sm:m-[20px] flex items-center space-x-0 cutom-scrollbar flex-col select-text">
                <div
                  className="w-full mx-[30px] border-[1px]  rounded-[5px] overflow-x-hidden  border-[#000000] overflow-y-auto custom-scrollbar shadow-custom_history"
                  id="chat-history"
                  ref={chatContainerRef}
                >
                  {messages &&
                    messages.map((item, index) => {
                      return item.role === "user" ? (
                        <div
                          key={index}
                          className="w-full  border-[#4E505A] border-[1px] bg-[#4E505A] flex pr-[20px]"
                        >
                          <div className="w-[90px] flex justify-center mt-[30px] ml-[10px]">
                            <div className="bg-[#20FDC9] rounded-[10px]  text-20 font-bold w-[50px] h-[50px] flex flex-row justify-center items-center">
                              <div>{nameMark}</div>
                            </div>
                          </div>
                          <div className="my-[40px] w-full">
                            <div className="text-[#bbafaf] flex justify-between w-full">
                              <span>{name}</span>
                              <span
                                className="mr-[20px]"
                                onClick={() => {
                                  setConvertPromptModalvisible(true);
                                  setconvertprompt(item.content);
                                }}
                              >
                                <i className="fa-regular fa-square-plus cursor-pointer scale-125 hover:scale-150 text-[#ffffff]"></i>
                              </span>
                            </div>
                            <div className="text-white ml-[10px] mt-[10px] whitespace-pre-wrap">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="w-full border-[#4E505A] border-[1px] flex pr-[20px]"
                        >
                          <div className="w-[60px] flex justify-center ml-[18px]">
                            <img
                              src="/images/chadgpt-character.png"
                              className="w-[50px] h-[50px] rounded-[10px] m-[30px]"
                              alt="assistant"
                            />
                          </div>
                          <div className="ml-[15px] my-[40px] w-full">
                            <div className="text-[#bbafaf] flex w-full justify-between">
                              <span>ChadGPT</span>
                              <span className="mr-[20px]">
                                {/* {item.copying ? (
                                  <i class="fa-solid fa-check cursor-pointer scale-125 text-[#78F9CC]"></i>
                                ) : ( */}
                                <i
                                  class="fa-regular fa-copy cursor-pointer scale-125 hover:scale-150 text-[#ffffff]"
                                  onClick={(e) => {
                                    setcopying(true);
                                    navigator.clipboard.writeText(item.content);
                                    toast.success("Copied", {
                                      hideProgressBar: true,
                                      position: "top-center",
                                      autoClose: 500,
                                      style: {
                                        width: "120px",
                                        height: "30px",
                                      },
                                      closeButton: false,
                                    });
                                  }}
                                ></i>
                                {/* )} */}
                              </span>
                            </div>
                            <div className="text-white mx-[15px] mt-[10px] w-full">
                              {item.content === "" ? (
                                <i class="fa-solid fa-circle fa-beat text-[10px]"></i>
                              ) : (
                                <Markdown markdownText={item.content} />
                              )}

                              {/* <MarkdownRenderer markdownText={item.content} /> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {/* <div className="h-[162px] bg-white"></div> */}
                  <div ref={messagesEndRef}></div>
                </div>
              </div>
            )
          )}
          <div className="h-[40px]"></div>
          {gptLoading ? (
            <div className="ml-[20px] absolute bottom-[80px] ">
              <i className="fa-solid fa-spinner fa-spin text-[30px]"></i>
            </div>
          ) : (
            <span></span>
          )}
          {id === null || flag === 0 ? (
            <span></span>
          ) : (
            id && (
              <div className="absolute bottom-[20px] flex flex-row justify-center w-full">
                <div className="w-full ml-[20px] mr-[60px] sm:mr-[60px] relative">
                  {/* <textarea
                    ref={inputRef}
                    value={message}
                    className="py-[30px] custom-scrollbar text-white text-[15px] bg-[#464b54] w-full rounded-[6px] transition duration-300 p-[10px]   max-h-[200px] shadow-lg resize-none border-[#c1565b]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7]"
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    rows={rows}
                  /> */}
                  <button
                    className="absolute right-[15px] bottom-[18px] text-[19px] hover:scale-110 hover:border-white"
                    // onClick={() => getChatGPTResponse()}
                    onClick={() => getChatGPTResponse1()}
                  >
                    <i className="fa-solid fa-paper-plane text-[#78F9CC]"></i>
                  </button>

                  <textarea
                    ref={textareaRef}
                    className="m-0 w-full resize-none border-none focus:bprder-none bg-[#464b54]  transition duration-300  border-[#464b54] rounded-[10px] custom-scrollbar p-0 py-2 pr-8 pl-2 text-white  dark:text-white md:py-3 md:pl-4"
                    style={{
                      resize: "none",
                      bottom: `${textareaRef?.current?.scrollHeight}px`,
                      maxHeight: "400px",
                      overflow: `${
                        textareaRef.current &&
                        textareaRef.current.scrollHeight > 400
                          ? "auto"
                          : "hidden"
                      }`,
                    }}
                    placeholder={"Type a message here"}
                    value={message}
                    rows={1}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown1}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div
        className={`bg-[#353740] w-[260px] flex flex-col pt-[10px] ${
          !isLgScreen && rightVisible === true
            ? "fixed right-0 top-0 h-[100%] transform transition-transform duration-300 ease-in-out border-[1px] border-[#202123]"
            : "hidden"
        } ${
          isLgScreen ? "" : "animate__fadeInRight"
        } lg:flex animate__animated`}
      >
        <div className="px-[15px] w-[260px]">
          {/* <div className='relative'>
            <input
              type='text'
              placeholder='Search'
              className='bg-[#353740] pl-10 pr-4 py-2 border rounded-md border-[#61626D] focus:ring focus:ring-blue-200 text-white'
            />
            <div className='absolute left-3 top-[10px]'>
              <i className='fas fa-search text-gray-400'></i>
            </div>
          </div> */}
          <div className="flex flex-row justify-center items-center mt-[20px]">
            <div className="font-medium text-20 text-white">SAVED PROMPTS</div>
          </div>
          <hr className="border-[#4E505A] mt-[5px]" />
        </div>
        <div className="px-[15px] my-[10px] overflow-hidden scroll-m-1">
          {admin && (
            <div
              className="mt-[5px] rounded-md bg-[#353740] p-[8px] border border-[#61626D] flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-gray-800"
              onClick={() => setaddultimatepromptmodalopen(true)}
            >
              <img src="/images/plus.svg" className="w-[20px]" alt="plus" />
              <span className="font-medium text-white text-16">
                New Ultimate Prompt
              </span>
            </div>
          )}
          {admin && (
            <div
              className="mt-[5px] rounded-md bg-[#353740] p-[8px] border border-[#61626D] flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-gray-800"
              onClick={handleAddUltimateNewPromptFolder}
            >
              <img src="/images/plus.svg" className="w-[20px]" alt="plus" />
              <span className="font-medium text-white text-16">
                New Ultimate Folder
              </span>
            </div>
          )}
          {admin && <hr className="border-[#4E505A] mt-[5px]" />}
          <div
            className="mt-[5px] rounded-md bg-[#353740] p-[8px] border border-[#61626D] flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-gray-800"
            onClick={() => setaddpromptmodalopen(true)}
          >
            <img src="/images/plus.svg" className="w-[20px]" alt="plus" />
            <span className="font-medium text-white text-16">New Prompt</span>
          </div>
          <div
            className="mt-[5px] rounded-md bg-[#353740] p-[8px] border border-[#61626D] flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-gray-800"
            onClick={handleAddNewPromptFolder}
          >
            <img src="/images/plus.svg" className="w-[20px]" alt="plus" />
            <span className="font-medium text-white text-16">New Folder</span>
          </div>
          <div
            className={`mt-[20px] flex flex-col ${
              !pro
                ? "min-h-prompt-field max-h-prompt-field"
                : "min-h-prompt-field-1 max-h-prompt-field-1"
            }  overflow-y-auto custom-scrollbar border-[1px] rounded-[8px] border-[#61626D] p-[8px]`}
          >
            {" "}
            <SidebarUltimatePrompt
              items={ultimateprompt}
              onSelectItem={(id) => {
                seteditultimatepromptmodalopen(true);
                setultimatepromptid(id);
              }}
              email={email}
              admin={admin}
            />
            <SidebarPrompt
              items={customprompt}
              onSelectItem={(id) => {
                seteditpromptmodalopen(true);
                setpromptid(id);
              }}
              email={email}
              admin={admin}
            />
          </div>
          <div
            className={`absolute bottom-[10px] bg-[#4f4f5e] w-[230px] mb-[20px] rounded-[10px] p-[15px]`}
          >
            <div className="flex flex-row items-center justify-center w-full">
              <div className="text-[20px] font-bold text-[#cccccc]">
                <div className="text-center">
                  {pro ? `Pro Account` : `Free Trial(${credit})`}
                </div>
                {!pro && (
                  <div>
                    <progress
                      className="progress progress-success w-56"
                      value={10 * credit}
                      max="100"
                    ></progress>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
