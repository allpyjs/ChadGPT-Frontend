import React from "react";
import SidebarItem from "./SidebarItem";
import Tree from "./../../components/PromptTree/Tree";

const SidebarPrompt = ({
  items,
  onSelectItem,
  handlePrompt,
  promptid,
  admin,
}) => {
  return (
    <div>
      <Tree
        items={items}
        onSelectItem={onSelectItem}
        handlePrompt={handlePrompt}
        promptid={promptid}
        admin={admin}
      />
    </div>
  );
};

export default SidebarPrompt;
