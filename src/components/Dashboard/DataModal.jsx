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
  startAt,
  doc,
  orderBy,
} from "firebase/firestore";
import "./DataModal.css";

const DataModal = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setloading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const userData = [];
        const startIndex = (page - 1) * itemsPerPage;
        const q = query(collection(db, "users"));
        const docs = await getDocs(q);
        docs.forEach((doc) => {
          userData.push(doc.data());
        });

        console.log(userData);
        setUsers(userData);
        setloading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDownload = (e) => {
    let data = [["Name", "Email", "Pro", "Pro Type"]];

    users.map((user) => {
      data.push([
        user.name,
        user.email,
        user.pro ? "Pro" : "Trial",
        user.protype,
      ]);
    });

    const csvRows = data.map((row) => row.join(","));
    const csvString = csvRows.join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

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
        <div className="relative modal-box bg-red bg-[#202123] rounded-[10px] custom-scrollbar  border-[#333333] backdrop-blur-md w-[80%]  lg:min-w-[950px] lg:max-w-[950px] gap-2">
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
            <div className="flex justify-end mb-[10px]">
              <button
                className="btn bg-[#20fdc9] border-none hover:bg-[#51a997] text-md text-[#1E2022]"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="h-[500px] flex justify-center items-center">
                  <div className="lds-dual-ring"></div>
                </div>
              ) : (
                <div class="relative overflow-x-auto shadow-md sm:rounded-[15px] custom-scrollbar">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          ID
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Email
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Pro
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Pro Type
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Register Time (PST)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <>
                          <tr
                            key={index}
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <th
                              scope="row"
                              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {index + 1}
                            </th>
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                              {user.pro ? "Pro" : "Trial"}
                            </td>
                            <td className="px-6 py-4">{user.protype}</td>
                            <td className="px-6 py-4">{user.time}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
