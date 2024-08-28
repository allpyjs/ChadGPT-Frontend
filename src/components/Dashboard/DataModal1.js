import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { toast } from "react-toastify";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
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

const DataModal = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = [];
        const q = query(collection(db, "users"));
        const docs = await getDocs(q);
        docs.forEach((doc) => {
          userData.push(doc.data());
        });
        console.log(userData);
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ zIndex: 2000 }} className="fixed">
      <input
        value={props.odalOpen}
        type="checkbox"
        checked={props.modalOpen}
        onChange={() => props.setModalOpen(!props.modalOpen)}
        className={`modal-toggle bg-[#4E505A]`}
      />
      <div className="modal">
        <div className="relative modal-box bg-red bg-[#202123] rounded-[10px] custom-scrollbar  border-[#333333] backdrop-blur-md max-w-[90%] md:min-w-[700px] md:max-w-[700px] w-full gap-2">
          <label
            onClick={() => props.setModalOpen(!props.modalOpen)}
            className="absolute btn btn-sm btn-circle right-2 top-2 bg-[#444444] hover:bg-[#555555] border-none"
          >
            ✕
          </label>
          <h3 className="text-[35px] font-bold text-white text-center">
            {props.title}
          </h3>
          <div className="py-4">
            <div className="overflow-x-auto">
              <table className="table table-xs text-white border">
                <thead>
                  <tr className="text-white">
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Pro</th>
                    <th>Pro Type</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.pro ? "Pro" : "Trial"}</td>
                      <td>{user.protype}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
