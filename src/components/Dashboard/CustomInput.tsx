import React from "react";
import { TextField, withStyles } from "@material-ui/core";

const styles = {
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red", // Set your desired border color here
      },
      "&:hover fieldset": {
        borderColor: "blue", // Set your desired border color for hover here
      },
      "&.Mui-focused fieldset": {
        borderColor: "green", // Set your desired border color for focused state here
      },
    },
  },
};

const CustomTextField = withStyles(styles)(TextField);

export default CustomTextField;
// Your component code goes here
