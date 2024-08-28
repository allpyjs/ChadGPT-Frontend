import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";

import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");

  const forgotPassword = (e) => {
    const auth = getAuth();
    setloading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password Rest Email was sent successfully !", {
          hideProgressBar: true,
        });
        setloading(false);
        setemail("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Some Error Occurred.", {
          hideProgressBar: true,
          draggable: true,
        });
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
            Enter your email address and we will send you instructions to reset
            your password.
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <input
                className="w-full mt-[20px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <i
                className="absolute left-3 top-[35px] fa fa-envelope"
                aria-hidden="true"
              ></i>
            </div>
          </div>

          <button
            onClick={forgotPassword}
            className="bg-[#20FDC9] rounded-[12px] h-[48px] w-full mt-[30px] font-medium hover:bg-[#20FDAf] text-[16px] flex justify-center items-center"
          >
            {loading ? (
              <div>
                {" "}
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <span>Continue</span>
            )}{" "}
          </button>
        </div>
        <div className="ml-[70px] sm:ml-[100px] mt-[20px] text-[16px]">
          <a href="/" className="text-white">
            <span>Back to Login</span>
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
