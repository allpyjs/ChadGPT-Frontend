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
import "./PricingModal.css";

const monthly_priceId = process.env.REACT_APP_MONTH_PRICE_ID;
const yearly_priceId = process.env.REACT_APP_YEAR_PRICE_ID;

const PricingModal = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [loading1, setloading1] = useState(false);
  const [loading2, setloading2] = useState(false);

  // Main function
  const createSubscription = async (type) => {
    let priceId = "";
    if (type === "month") {
      priceId = monthly_priceId;
      setloading1(true);
    } else {
      priceId = yearly_priceId;
      setloading2(true);
    }

    try {
      if (!elements || !elements.getElement(CardElement)) {
        console.error("CardElement is not available.");
        return;
      }
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name,
          email,
        },
      });

      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod.paymentMethod.id,
          name,
          email,
          priceId,
        }),
      }).then((res) => res.json());

      const confirmPayment = await stripe.confirmCardPayment(
        response.clientSecret
      );

      if (confirmPayment.error) {
        toast.success(confirmPayment.error.message, {
          hideProgressBar: true,
          draggable: true,
        });
      } else {
        const uid = localStorage.getItem("uid");

        const userCollection = collection(db, "users");

        const q = query(userCollection, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        const userDoc = querySnapshot.docs[0];

        const useDocRef = doc(db, "users", userDoc.id);
        const SubscriptionId = response.subscriptionId;
        await updateDoc(useDocRef, {
          pro: true,
          subID: SubscriptionId,
          protype: type,
        });

        props.setProVersion(true, type);

        toast.success("Promoted to Pro version successfully.", {
          hideProgressBar: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setloading1(false);
    setloading2(false);
  };

  const cancelSubscription = async (type) => {
    if (type === "month") {
      setloading1(true);
    } else {
      setloading2(true);
    }
    const uid = localStorage.getItem("uid");
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const useDocRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();
    axios
      .post("/api/stripe/cancel-subscrption", { subId: userData.subID })
      .then((res) => {
        updateDoc(useDocRef, {
          pro: false,
          subID: "",
          protype: "",
        });
        props.setProVersion(false);

        toast.success("Pro version removed successfully.", {
          hideProgressBar: true,
          draggable: true,
        });
      })
      .catch((err) => {});
    setloading1(false);
    setloading2(false);
  };

  useEffect(() => {
    setName(props.name);
    setEmail(props.email);
  }, [props]);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#ffffff",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
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
            <div className="mb-[10px] flex justify-center space-x-[20px] w-full flex-wrap">
              <img
                src="/images/pricing.png"
                className="w-[480px] mt-[10px] mb-[20px]"
              />
              {/* <img
                src="/images/p1.png"
                className="w-[60px] sm:w-[80px] mt-[10px]"
                alt="p1"
              />
              <img
                src="/images/p2.png"
                className="w-[60px] sm:w-[80px] mt-[10px]"
                alt="p1"
              />
              <img
                src="/images/p3.png"
                className="w-[60px] sm:w-[80px] mt-[10px]"
                alt="p1"
              />
              <img
                src="/images/p4.png"
                className="w-[60px] sm:w-[80px] mt-[10px]"
                alt="p1"
              />
              <img
                src="/images/p5.png"
                className="w-[60px] sm:w-[80px] mt-[10px]"
                alt="p1"
              /> */}
            </div>
            <div className=" lg:px-[100px] w-full mx-auto mb-[20px]">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-center items-center border-blue ">
              <div className="card w-[90%] sm:w-[300px] bg-[#353740] shadow-xl border-[1px] border-[#333333] min-h-[400px] m-[10px]">
                <div className="card-body flex justify-center items-center">
                  <h2 className="card-title text-[28px] text-[#51a997] whitespace-nowrap">
                    Pro Monthly
                  </h2>

                  <div className="flex flex-col items-center text-[#dddddd] text-[20px] mt-[15px]">
                    <div>Unlimited Outputs</div>
                    <div>GPT4 Access</div>
                    <div>Pro customer support</div>
                    <div>Free prompt pack</div>
                    <div className="h-[60px]"> </div>
                  </div>

                  <h1 className="text-white text-[30px]">
                    <span className="text-[30px]">$</span>
                    <span className="text-[50px]">9.97</span>
                    <span className="text-[20px]">/month</span>
                  </h1>

                  <div className="justify-end text-[10px]">
                    {props.pro && props.protype === "month" ? (
                      <button
                        className="btn bg-[#20fdc9] border-none hover:bg-[#51a997] text-lg text-[#1E2022]"
                        onClick={() => cancelSubscription("month")}
                      >
                        {loading1 ? (
                          <div className="lds-dual-ring"></div>
                        ) : (
                          <span className="normal-case">Downgrade</span>
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn bg-[#20fdc9] border-none hover:bg-[#51a997] text-lg text-[#1E2022]"
                        onClick={() => createSubscription("month")}
                      >
                        {loading1 ? (
                          <div className="lds-dual-ring"></div>
                        ) : (
                          <span className="normal-case">Upgrade Now</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="card w-[90%] sm:w-[300px] bg-[#353740] shadow-xl border-[1px] border-[#333333] min-h-[400px] m-[10px]">
                <div className="card-body flex justify-center items-center">
                  <h2 className="card-title text-[28px] text-[#51a997] whitespace-nowrap">
                    Pro Annual
                  </h2>

                  <div className="flex flex-col items-center text-[#ffffff] text-[20px] mt-[15px]">
                    <div>Best Price!</div>
                    <div>2 Months Free</div>
                    <div>Unlimited Outputs</div>
                    <div>GPT4 Access</div>
                    <div>Pro customer support</div>
                    <div>Free prompt pack</div>
                  </div>

                  <h1 className="text-white text-[30px]">
                    <span className="text-[30px]">$</span>
                    <span className="text-[50px]">98.97</span>
                    <span className="text-[20px]">/yearly</span>
                  </h1>

                  <div className="card-actions justify-end text-[90px]">
                    {props.protype === "year" && props.pro ? (
                      <button
                        className="btn bg-[#20fdc9] border-none hover:bg-[#51a997] text-lg text-[#1E2022]"
                        onClick={() => cancelSubscription("year")}
                      >
                        {loading2 ? (
                          <div className="lds-dual-ring"></div>
                        ) : (
                          <span className="normal-case">Downgrade</span>
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn bg-[#20fdc9] border-none hover:bg-[#51a997] text-lg text-[#1E2022]"
                        onClick={() => createSubscription("year")}
                      >
                        {loading2 ? (
                          <div className="lds-dual-ring"></div>
                        ) : (
                          <span className="normal-case">Upgrade Now</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
