import { Button, Input, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8001/");

const MessageInbox = ({selectedUser,currentUser}) => {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: selectedUser._id,
      message,
    });
    setMessageList((prev) => [
      ...prev,
      { senderId: currentUser?.id, message, receiverId: selectedUser._id },
    ]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

   useEffect(() => {
    const fetchMessage = async () => {
      try {
        const loggedInUser = localStorage.getItem("users");
        setMessageList([]);
        if (loggedInUser && selectedUser) {
          const userObject = JSON.parse(loggedInUser);
          const res = await axios.get(
            `http://localhost:8001/messages/${selectedUser?._id}`,
            {
              headers: {
                Authorization: `Bearer ${userObject.token}`,
              },
            }
          );
          setMessageList((prev) => [...prev, ...res.data.data]);
        }
      } catch (error) {
        console.log("Error message fetching", error);
      }
    };
    fetchMessage();
  }, [selectedUser]);


  // message filter which help show person to person message
  const filterMessage = messageList.filter(
    (msg) =>
      (msg.senderId === currentUser?.id &&
        msg.receiverId === selectedUser?._id) ||
      (msg.senderId === selectedUser?._id && msg.receiverId === currentUser?.id)
  );
  return (
    <>
      {selectedUser ? (
        <>
          <div
            style={{
              padding: "15px",
              borderBottom: "1px solid #ddd",
              background: "#ededed",
              fontWeight: "bold",
              position: "relative",
            }}
          >
            <h2>{selectedUser.name}</h2>
          </div>

          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              border: "1px solid #eee",
              padding: 10,
              marginBottom: 10,
              background: "#fafafa",
              maxHeight: "400px",
              // display:"flex",
              // flexDirection:"column-reverse"

            }}
          >
            {filterMessage.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign:
                    msg.senderId === currentUser?.id ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    overflow: "auto",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    background:
                      msg.senderId === currentUser?.id ? "#1890ff" : "#f5f5f5",
                    color: msg.senderId === currentUser?.id ? "white" : "black",
                  }}
                >
                  {msg.message}
                </span>
              </div>
            ))}
          </div>

          <div>
            <Space.Compact
              style={{ width: "90%", position: "absolute", bottom: 10 }}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
              <Button type="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </Space.Compact>
          </div>
        </>
      ) : (
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          Select a chat to start messaging
        </div>
      )}
    </>
  );
};

export default MessageInbox;
