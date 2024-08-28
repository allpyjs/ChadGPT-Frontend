import React from "react";
import SidebarItem from "./SidebarItem";
import Tree from "./../../components/HistoryTree/Tree";

const SidebarHistory = ({ id, items, onSelectItem }) => {
  return (
    <div>
      <Tree items={items} id={id} onSelectItem={onSelectItem} />
    </div>
  );
  // return items.map((item, index) => <SidebarItem key={index} content={item} />);
};

export default SidebarHistory;
