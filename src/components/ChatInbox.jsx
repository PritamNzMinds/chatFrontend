import {
  Avatar,
  Button,
  Col,
  Input,
  Layout,
  List,
  Menu,
  Row,
  Space,
} from "antd";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { io } from "socket.io-client";

const { Header, Content, Footer, Sider } = Layout;

const socket = io("http://localhost:8001/");

const ChatInbox = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [lastMessageList, setLastMessageList] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const handleSelectUser = (user) => {
    console.log("user", user);
    setSelectedUser(user);
  };

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
    const fetchUserData = async () => {
      try {
        const loggedInUser = localStorage.getItem("users");

        if (loggedInUser) {
          const userObject = JSON.parse(loggedInUser);
          // join room

          socket.emit("addUser", userObject.id);
          setCurrentUser(userObject);

          const res = await axios.get("http://localhost:8001/getUsers", {
            headers: {
              Authorization: `Bearer ${userObject.token}`,
            },
          });
          console.log(res);
          setUserList(res.data.data.users);
          setLastMessageList(res.data.data.lastMessageList);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    socket.on("getMessage", (data) => {
      console.log("message", data);
      setMessageList((prev) => [...prev, data]);
    });

    fetchUserData();
    return () => {
      socket.off("getUsers");
      socket.off("getMessage");
    };
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const loggedInUser = localStorage.getItem("users");
        setMessageList([]);
        if (loggedInUser) {
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
  // show userlist with last
  const merged = userList.map((user) => {
    const lastMsg = lastMessageList.find(
      (msg) => msg?.receiverId === user._id || msg?.senderId === user._id
    );
    return {
      ...user,
      lastMessage: lastMsg ? lastMsg.message : null,
    };
  });
  console.log(merged);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center", color: "white" }}>
        <div>
          <h3>Chat With Your friends</h3>
        </div>
      </Header>
      <Row
        style={{
          margin: "10px 50px",
        }}
      >
        <Col
          span={6}
          style={{
            height: "85vh",
            padding: "10px",
            border: "1px solid white",
            backgroundColor: "#ffff",
            boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.3)",
            borderRadius: "20px",
            background: "#fffff",
          }}
        >
          <div
            style={{
              padding: "15px",
              // borderBottom: "1px solid #ddd",
              background: "#ededed",
              fontWeight: "bold",
              textAlign: "center",
              borderRadius: "20px",
            }}
          >
            <h2>My Account: {currentUser?.name}</h2>
          </div>
          <div style={{ padding: "20px" }}>
            <Input.Search placeholder="Search or start new chat" />
          </div>
          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <List
              dataSource={merged}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "1px solid #f5f5f5",
                    transition: "all 0.3s",
                     borderRadius: "20px",
                    background:
                      selectedUser?._id === item._id
                        ? "#e3eaeeff"
                        : "transparent",
                  }}
                  onClick={() => handleSelectUser(item)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={45}
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    title={<b>{item.name}</b>}
                    description={item.lastMessage}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>

        <Col
          span={17}
          offset={1}
          style={{
            height: "85vh",
            padding: "10px",
            border: "1px solid white",
            backgroundColor: "#ffff",
            boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.3)",
            borderRadius: "20px",
            background: "#fffff",
          }}
        >
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
                          msg.senderId === currentUser?.id
                            ? "#1890ff"
                            : "#f5f5f5",
                        color:
                          msg.senderId === currentUser?.id ? "white" : "black",
                      }}
                    >
                      {msg.message}
                    </span>
                  </div>
                ))}
              </div>

              <div
              >
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
        </Col>
      </Row>
    </Layout>
  );
};

export default ChatInbox;
