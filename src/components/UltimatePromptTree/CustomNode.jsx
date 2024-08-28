import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDragOver } from "@minoru/react-dnd-treeview";
import styles from "./CustomNode.module.css";
import { TypeIcon } from "./TypeIcon";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  customInput: {
    "& .MuiInputBase-input": {
      padding: "3px", // Set your padding here
    },
  },
  customBorder: {
    "& .MuiInput-underline:before": {
      borderBottomColor: "#20FDC9", // Normal state
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#20FDC9", // Hover state
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#20FDC9", // Focused state
    },
  },
});

export const CustomNode = (props) => {
  const classes = useStyles();

  const { id, text, type, droppable, parent } = props.node;
  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const [color, setcolor] = useState("");
  const [hover, setHover] = useState(false);
  const indent = props.depth * 24;
  const [nodeIsOpen, setNodeIsOpen] = useState(props.isOpen);
  const handleToggle = (e) => {
    e.stopPropagation();
    setNodeIsOpen(!nodeIsOpen);
    props.onToggle(props.node.id, !nodeIsOpen);
  };

  const handleShowInput = () => {
    if (id === 1 || id === 2) return;
    setVisibleInput(true);
  };

  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleChangeText = (e) => {
    setLabelText(e.target.value);
  };

  const handleSubmit = () => {
    setVisibleInput(false);
    props.onTextChange(id, labelText);
  };

  const handleSelect = (e) => {
    if (id == 2) return;
    if (type === "File") props.onSelect(props.node);
  };
  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  useEffect(() => {
    if (props.node.type === "File") setcolor("text-[#e2e25a]");
    else
      setcolor(
        props.node.type == "Folder" &&
          props.node.id == "1" &&
          props.node.id == "2"
          ? "text-[#4fa1bc]"
          : "text-[#779f40]"
      );
  }, [props]);

  return (
    <div
      className={`tree-node ${
        styles.root
      } min-h-[30px] hover:cursor-pointer hover:text-[#e6e9ed] ${
        id === 1 || id === 2 ? "" : "ml-[-22px]"
      }`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {((id !== 1 && id !== 2) || (props.admin && props.node.parent == 2)) &&
        !visibleInput && (
          <div
            className={`${props.node.droppable ? "" : "ml-[16px] mr-[9px]"}`}
          >
            {props.admin ? (
              <i
                className={`fa-regular fa-trash-can ${
                  hover ? "visible" : "invisible"
                } text-[16px] text-[#20FDC9] p-[4px] ${
                  props.node.droppable ? "" : "mr-[10px]"
                }}`}
                onClick={() => props.onDelete(id, type)}
              ></i>
            ) : (
              <span className="mr-[22px]" />
            )}
          </div>
        )}
      {visibleInput && (
        <div className="flex justify-center items-center">
          <i
            className="fa-regular fa-circle-check text-[16px] text-[#20FDC9] p-[4px]"
            onClick={handleSubmit}
          ></i>
          <i
            className="fa-regular fa-circle-xmark text-[16px] text-[#20FDC9] p-[4px]"
            onClick={handleCancel}
          ></i>
        </div>
      )}
      {props.node.droppable && (
        <div
          className={` ${styles.expandIconWrapper} ${
            props.isOpen ? styles.isOpen : ""
          } `}
        >
          {props.node.droppable && (
            <div onClick={handleToggle}>
              <ArrowRightIcon className="text-[#20FDC9]" />
            </div>
          )}
        </div>
      )}
      <div className={`${styles.labelGridItem} flex items-center`}>
        <div className={`ml-[-10px] mr-[6px]`}>
          <TypeIcon
            droppable={droppable}
            type={type}
            id={id}
            isOpen={props.isOpen}
          />
        </div>
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            <TextField
              className={`${styles.textField}
              ${styles.nodeInput} ${classes.customBorder} ${classes.customInput} whitespace-nowrap border-[#20FDC9]`}
              value={labelText}
              onChange={handleChangeText}
              variant="standard"
            />
          </div>
        ) : (
          <div
            className={styles.inputWrapper}
            onClick={(e) =>
              type === "Folder" ? handleShowInput(e) : handleSelect(e)
            }
          >
            <span
              className={`text-[16px] ${
                props.isSelected ? "text-[#c0c4c1] " : "text-[#ffffff]"
              } hover:text-[#ccd6e3] whitespace-nowrap ${
                props.node.droppable ? "font-medium" : ""
              }`}
            >
              {props.node.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
