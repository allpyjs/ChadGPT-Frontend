import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import axios from "axios";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  Tree,
  MultiBackend,
  getDescendants,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { db } from "./../../services/firebase";
import { query, getDocs, collection, where } from "firebase/firestore";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { theme } from "./theme";
import styles from "./App.module.css";

const getLastId = (treeData) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }

    return 0;
  });

  if (reversedArray.length > 0) {
    return reversedArray[0].id;
  }

  return 0;
};

function App(props) {
  const [treeData, setTreeData] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  const handleDrop = (newTree) => {
    setTreeData(newTree);
    axios
      .post("/api/chatbot/updatehistorytreedata", {
        treeData: newTree,
        email: email,
        id: "111",
        del: false,
      })
      .then((res) => {})
      .catch((err) => []);
  };

  const handleSelect = (node) => {
    setSelectedNode(node);
    props.onSelectItem(node.id);
  };
  const handleTextChange = (id, value) => {
    const newTree = treeData.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          text: value,
        };
      }

      return node;
    });

    setTreeData(newTree);

    axios
      .post("/api/chatbot/updatehistorytreedata", {
        treeData: newTree,
        email: email,
        id: id,
        del: false,
      })
      .then((res) => {})
      .catch((err) => []);
  };

  const handleDelete = (id, type) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ];
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id));

    setTreeData(newTree);

    axios
      .post("/api/chatbot/updatehistorytreedata", {
        treeData: newTree,
        email: email,
        del: type === "File" ? true : false,
        id: id,
      })
      .then((res) => {})
      .catch((err) => []);
  };

  useEffect(() => {
    setTreeData(props.items);
  }, [props.items]);

  const fetchEmail = async () => {
    let uid = localStorage.getItem("uid");
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    setEmail((email) => data.email);
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <CustomNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
                isSelected={(props.id === null && node.id === selectedNode?.id) || (node.id === props.id && props.id !== null)}
                onTextChange={handleTextChange}
                onDelete={handleDelete}
                onSelect={handleSelect}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget,
            }}
            sort={false}
            initialOpen={[1]}
          />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
