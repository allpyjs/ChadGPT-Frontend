import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";

export const TypeIcon = (props) => {
  if (props.droppable) {
    return props.isOpen ? (
      <i className="fa-solid fa-folder-open text-[16px] text-[#20FDC9]"></i>
    ) : (
      <i className="fa-solid fa-folder text-[16px] text-[#20FDC9]"></i>
    );
  }

  switch (props.type) {
    case "File":
      return <i className="fa-regular fa-file text-[16px] text-[#20FDC9]"></i>;
    default:
      return null;
  }
};
