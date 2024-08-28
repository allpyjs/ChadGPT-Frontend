import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";

import { db } from "./../../services/firebase";
import {
  query,
  getDocs,
  collection,
  where,
  limit,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { auth } from "../../services/firebase";
import { updatePassword } from "firebase/auth";

const ChangePasswordModal = (props) => {
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const onSubmit = (e) => {
    if (password === "" || confirmpassword === "") {
      toast.warning("Please input the whole fields correctly.", {
        hideProgressBar: true,
        draggable: true,
      });
    }

    if (password.length < 7) {
      toast.warning("Please input password's length more than  7.", {
        hideProgressBar: true,
        draggable: true,
      });
      return;
    }

    if (password !== confirmpassword) {
      toast.warning("Please confirm password correctly.", {
        hideProgressBar: true,
        draggable: true,
      });
      return;
    }

    updatePassword(auth.currentUser, password)
      .then((res) => {
        toast.success("Successfully Password changed.", {
          hideProgressBar: true,
          draggable: true,
        });
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <input
        value={props.modalOpen}
        type='checkbox'
        checked={props.modalOpen}
        onChange={() => props.setModalOpen(!props.modalOpen)}
        className={`modal-toggle bg-[#4E505A]`}
      />
      <div className='modal'>
        <div className='relative modal-box bg-red bg-[#202123] rounded-[10px] border-[#333333] backdrop-blur-md max-w-[400px]  md:min-w-[700px] w-full gap-2'>
          <label
            onClick={() => props.setModalOpen(!props.modalOpen)}
            className='absolute btn btn-sm btn-circle right-2 top-2 bg-[#444444] hover:bg-[#555555] border-none'
          >
            ✕
          </label>
          <h3 className='text-[35px] font-bold text-white text-center'>
            {props.title}
          </h3>
          <div className='py-4'>
            <div className='relative'>
              <input
                type='password'
                className='mt-[20px]  rounded-[8px] pl-[36px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px] w-full'
                placeholder='Password'
                name='password'
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <i
                className='absolute left-3 top-[35px] fa fa-key'
                aria-hidden='true'
              ></i>
            </div>
            <div className='relative'>
              <input
                type='password'
                className='w-full mt-[20px] pl-[36px] rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]'
                placeholder='Confirm Password'
                name='confirmpassword'
                value={confirmpassword}
                onChange={(e) => setconfirmpassword(e.target.value)}
              />
              <i
                className='absolute left-3 top-[35px] fa fa-unlock'
                aria-hidden='true'
              ></i>
            </div>
            <button
              className='text-[#aaaaaa] border-[1px] rounded-[5px] p-[10px] w-full mt-[20px] hover:border-[2px] bg-[#333333] border-[#333333]'
              onClick={onSubmit}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
