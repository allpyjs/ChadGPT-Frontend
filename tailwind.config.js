/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      backgroundColor: {
        "custom-gray": "rgb(32, 33, 35)",
        "custom-blue": "rgba(32, 253, 201, 0.80)",
        "radial-gradient":
          "rlinear-gradient(to right, rgb(199, 210, 254), rgb(254, 202, 202), rgb(254, 249, 195))",
        testominal: "rgba(53, 55, 64, 0.50)",
      },
      fontSize: {
        16: "16px",
        17: "17px",
        18: "18px",
        20: "20px",
        22: "22px",
        24: "24px",
        26: "26px",
        30: "30px",
        40: "40px",
        45: "45px",
        57: "57px",
        60: "60px",
        72: "72px",
        74: "74px",
      },
      boxShadow: {
        custom: "0px 10px 20px 0px rgba(32, 253, 201, 0.15)",
        custom_login: "0px 0px 0px 4px rgba(132, 220, 245, 0.24);",
        custom_history: "0px 0px 0px 4px rgba(0, 0, 0, 0.26);",
        checkbox:
          "0px 1px 3px 0px rgba(0, 0, 0, 0.05), 0px 1px 2px -1px rgba(0, 0, 0, 0.05);",
      },
      colors: {
        "custom-green": "#20FDC9", // Add your custom color here
      },
      borderRadius: {
        lg: "1.5rem",
      },
      lineHeight: {
        8: "46px",
        6: "32px",
      },
      minHeight: {
        "chat-field": "calc(100vh - 190px)",
        "chat-field-mobile": "calc(100vh - 270px)",
        "prompt-field": "calc(100vh - 324px)",
        "prompt-field-1": "calc(100vh - 392px)",
        "history-field": "calc(100vh - 350px)",
      },
      maxHeight: {
        "chat-field": "calc(100vh - 190px)",
        "chat-field-mobile": "calc(100vh - 270px)",
        "prompt-field": "calc(100vh - 324px)",
        "prompt-field-1": "calc(100vh - 392px)",
        "history-field": "calc(100vh - 350px)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
