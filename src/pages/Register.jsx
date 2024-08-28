import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import moment from "moment-timezone";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";

import { auth, db } from "../services/firebase";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [authing1, setAuthing1] = useState(false);
  const [authing2, setAuthing2] = useState(false);

  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  // const sendEmail = () => {
  //   let ElasticEmail = require('@elasticemail/elasticemail-client');

  //   let defaultClient = ElasticEmail.ApiClient.instance;

  //   let apikey = defaultClient.authentications['apikey'];
  //   apikey.apiKey = process.env.REACT_APP_ELASTIC_KEY;

  //   let api = new ElasticEmail.EmailsApi()

  //   let email = ElasticEmail.EmailMessageData.constructFromObject({
  //     Recipients: [
  //       new ElasticEmail.EmailRecipient("MeowWow ")
  //     ],
  //     Content: {
  //       Body: [
  //         ElasticEmail.BodyPart.constructFromObject({
  //           ContentType: "HTML",
  //           Content: "My test email content ;)"
  //         })
  //       ],
  //       Subject: "JS EE lib test",
  //       From: "MyEmail "
  //     }
  //   });

  //   var callback = function(error, data, response) {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log('API called successfully.');
  //     }
  //   };
  //   api.emailsPost(email, callback);
  // }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      credential.name === "" ||
      credential.email === "" ||
      credential.password === "" ||
      credential.confirmpassword === ""
    ) {
      toast.warning("Please input the whole fields correctly.", {
        hideProgressBar: true,
        draggable: true,
      });
      return;
    }

    if (credential.password.length < 7) {
      toast.warning("Please input password's length more than  7.", {
        hideProgressBar: true,
        draggable: true,
      });
      return;
    }

    if (credential.password !== credential.confirmpassword) {
      toast.warning("Please confirm password correctly.", {
        hideProgressBar: true,
        draggable: true,
      });
      return;
    }

    setAuthing1(true);

    await createUserWithEmailAndPassword(
      auth,
      credential.email,
      credential.password
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        const formattedTime = moment()
          .tz("America/Los_Angeles")
          .format("YYYY-MM-DD HH:mm:ss");
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: credential.name,
          authProvider: "local",
          email: credential.email,
          credit: 10,
          pro: false,
          time: formattedTime,
        });

        await axios
          .post("/api/chatbot/makeuserfolder", { email: credential.email })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });

        setAuthing2(false);

        toast.success("Successfully Registered", {
          hideProgressBar: true,
          draggable: true,
        });
        navigate("/");
      })
      .catch((error) => {
        setAuthing1(false);
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          toast.error("Email has already used!", {
            hideProgressBar: true,
            draggable: true,
          });
          return;
        }
        console.log(errorCode);
      });
  };

  const signUpWithGoogle = async () => {
    setAuthing2(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (response) => {
        toast.success("Successfully logined", {
          hideProgressBar: true,
          draggable: true,
        });

        sessionStorage.setItem(
          "Auth Token",
          response._tokenResponse.refreshToken
        );
        setAuthing2(false);

        const user = response.user;

        localStorage.setItem("uid", user.uid);

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
          const formattedTime = moment()
            .tz("America/Los_Angeles")
            .format("YYYY-MM-DD HH:mm:ss");
          await axios
            .post("/api/chatbot/makeuserfolder", { email: user.email })
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
          await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
            credit: 10,
            pro: false,
            time: formattedTime,
          });
        }
        navigate("/dashboard");
        toast.success("Successfully Registered", {
          hideProgressBar: true,
          draggable: true,
        });
      })
      .catch((err) => {
        setAuthing2(false);
        console.log(err.code);
        setAuthing1(false);
      });
  };

  return (
    <div className="bg-[#202327] h-screen flex flex-row justify-between w-full">
      <div className="flex flex-col w-full lg:w-3/5 justify-center">
        <div className="mx-[70px] md:mx-[100px]">
          <NavLink to="/">
            <img src="/images/logo.svg" className="w-[200px]" alt="logo" />
          </NavLink>
          <div className="text-[#9B9C9E] mt-[40px] text-[18px]">
            Register now to start creating magic
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <input
                className="w-full mt-[20px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Full Name"
                name="name"
                value={credential.name}
                onChange={(e) =>
                  setCredential((credential) => ({
                    ...credential,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[33px] fa fa-user"
                aria-hidden="true"
              ></i>
            </div>
            <div className="relative">
              <input
                className="w-full mt-[20px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Email"
                name="email"
                value={credential.email}
                onChange={(e) =>
                  setCredential((credential) => ({
                    ...credential,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[35px] fa fa-envelope"
                aria-hidden="true"
              ></i>
            </div>
            <div className="relative">
              <input
                type="password"
                className="w-full mt-[20px] pl-[36px] rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Password"
                name="password"
                onChange={(e) =>
                  setCredential((credential) => ({
                    ...credential,
                    [e.target.name]: e.target.value,
                  }))
                }
                value={credential.password}
              />
              <i
                className="absolute left-3 top-[35px] fa fa-key"
                aria-hidden="true"
              ></i>
            </div>
            <div className="relative">
              <input
                type="password"
                className="w-full mt-[20px] pl-[36px] rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Confirm Password"
                name="confirmpassword"
                onChange={(e) =>
                  setCredential((credential) => ({
                    ...credential,
                    [e.target.name]: e.target.value,
                  }))
                }
                value={credential.confirmpassword}
              />
              <i
                className="absolute left-3 top-[35px] fa fa-unlock"
                aria-hidden="true"
              ></i>
            </div>
          </div>

          <button
            onClick={onSubmit}
            className="bg-[#20FDC9] rounded-[12px] h-[48px] w-full mt-[50px] font-medium hover:bg-[#20FDAf] text-[16px] flex justify-center items-center"
          >
            {authing1 ? (
              <div>
                {" "}
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <span>Register</span>
            )}{" "}
          </button>

          <button
            onClick={signUpWithGoogle}
            className="mt-[30px] bg-[#1A1D21] w-full h-[48px] text-[#686B6E] rounded-[12px] font-medium text-[16px] flex justify-center items-center hover:bg-[#0c1016]"
          >
            {authing2 ? (
              <div>
                {" "}
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <span className="flex flex-row justify-center items-center">
                <img
                  src="/images/google.png"
                  className="mx-[10px] w-[15px] h-[15px]"
                  alt="google"
                />
                <span>Google Account</span>
              </span>
            )}
          </button>
        </div>
        <div className="ml-[70px] sm:ml-[100px] mt-[20px] text-[16px]">
          <span className="mr-[16px] text-[#686B6E] font-medium ">
            Don’t have an account?
          </span>
          <a href="/" className="text-white">
            <span>Login</span>
          </a>
        </div>
      </div>

      <div className="text-[16px] hidden lg:block">
        <img
          src="/images/login-1.jpg"
          alt="login"
          className="h-full overflow-hidden bg-gradient-blue-green-500 text-background-clip w-full"
        />
      </div>
    </div>
  );
};

export default Register;
