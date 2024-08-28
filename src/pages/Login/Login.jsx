import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import moment from "moment-timezone";
import "./Login.css";

import { db } from "./../../services/firebase";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing1, setAuthing1] = useState(false);
  const [authing2, setAuthing2] = useState(false);
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  const onLogin = (e) => {
    e.preventDefault();
    console.log(credential);
    if (credential.email === "" || credential.password === "") {
      toast.error("Please input credentials correctly.", {
        hideProgressBar: true,
        draggable: true,
      });
      return;
    }
    setAuthing1(true);
    signInWithEmailAndPassword(auth, credential.email, credential.password)
      .then(async (userCredential) => {
        setAuthing1(false);
        toast.success("You're logged in!", {
          hideProgressBar: true,
        });
        sessionStorage.setItem(
          "Auth Token",
          userCredential._tokenResponse.refreshToken
        );
        const user = userCredential.user;
        localStorage.setItem("uid", user.uid);

        navigate("/dashboard");
      })
      .catch((error) => {
        setAuthing1(false);
        console.log(error.code);
        if (error.code === "auth/invalid-email") {
          toast.error("Please input email correctly", {
            hideProgressBar: true,
            draggable: true,
          });
        }
        if (error.code === "auth/invalid-login-credentials") {
          toast.error("Invalid Login Credential", {
            hideProgressBar: true,
            draggable: true,
          });
        }
        if (error.code === "auth/user-not-found") {
          toast.error("Please check the Email", {
            hideProgressBar: true,
            draggable: true,
          });
        }
      });
  };

  const signInWithGoogle = async () => {
    setAuthing2(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (response) => {
        toast.success("You are logged in!", {
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
      })
      .catch((err) => {
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
            Login and craft superior content with ease
          </div>
          <div className="relative">
            <input
              className="mt-[20px] rounded-[8px] pl-[36px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px] w-full"
              placeholder="Email"
              name="email"
              value={credential.value}
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
              className="mt-[20px]  rounded-[8px] pl-[36px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px] w-full"
              placeholder="Password"
              name="password"
              value={credential.password}
              onChange={(e) =>
                setCredential((credential) => ({
                  ...credential,
                  [e.target.name]: e.target.value,
                }))
              }
            />
            <i
              className="absolute left-3 top-[35px] fa fa-key"
              aria-hidden="true"
            ></i>
          </div>

          <div className="mt-[20px] text-[16px]">
            <NavLink to="/resetpassword">
              <span className="mr-[20px] text-[#ffffff] font-medium cursor-pointer">
                Forgot password?
              </span>
            </NavLink>
          </div>

          <button
            onClick={onLogin}
            className="bg-[#20FDC9] rounded-[12px] h-[48px] w-full mt-[30px] font-medium hover:bg-[#20FDAf] text-[16px] flex justify-center items-center"
          >
            {" "}
            {authing1 ? (
              <div className="lds-dual-ring"></div>
            ) : (
              <span>Login</span>
            )}
          </button>
          <button
            onClick={signInWithGoogle}
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
          <span className="mr-[20px] text-[#686B6E] font-medium ">
            Don’t have an account?
          </span>
          <a href="/register" className="text-white">
            <span>Register</span>
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

export default Login;
