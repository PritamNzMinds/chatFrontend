import { Button, Col, Layout, Row } from "antd";
import UserList from "../components/UserList";
import { useEffect, useState } from "react";
import MessageInbox from "../components/MessageInbox";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const socket = io("http://localhost:8001/");
const ChatPage = () => {

  const navigate=useNavigate()

  const [currentUser, setCurrentUser] = useState();
  const [userList, setUserList] = useState([]);
  const [lastMessageList, setLastMessageList] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState(null);

  const handleLogout=()=>{
    localStorage.removeItem("users");
    navigate("/login");
  }

  useEffect(() => {
    // fetch user data except logged In user
    const fetchUserData = async () => {
      try {
        const loggedInUser = localStorage.getItem("users");

        if (loggedInUser) {
          const userObject = JSON.parse(loggedInUser);
          // join room
          socket.emit("addUser", userObject.id);
          // set logged in user
          setCurrentUser(userObject);
          // get res from db
          const res = await axios.get("http://localhost:8001/getUsers", {
            headers: {
              Authorization: `Bearer ${userObject.token}`,
            },
          });
          setUserList(res.data.data.users);
          setLastMessageList(res.data.data.lastMessageList);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    return () => {
      socket.off("getUsers");
      // socket.off("getMessage");
    };
  }, []);


  // useEffect(() => {
  //   const fetchMessage = async () => {
  //     try {
  //       const loggedInUser = localStorage.getItem("users");
  //       setMessageList([]);
  //       if (loggedInUser) {
  //         const userObject = JSON.parse(loggedInUser);
  //         const res = await axios.get(
  //           `http://localhost:8001/messages/${selectedUser?._id}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${userObject.token}`,
  //             },
  //           }
  //         );
  //         setMessageList((prev) => [...prev, ...res.data.data]);
  //       }
  //     } catch (error) {
  //       console.log("Error message fetching", error);
  //     }
  //   };
  //   fetchMessage();
  // }, [selectedUser]);

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

  return (
    <>
      <Layout>
        <Header
          style={{ display: "flex", alignItems: "center", justifyContent:"space-between", color: "white" }}
        >
          <div>
            <h3>Chat With Your friends</h3>
          </div>
          <div>
            <Button onClick={handleLogout}>Logout</Button>
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
            <UserList
              onClickUser={(item) => setActiveReceiver(item)}
              selectedUser={activeReceiver}
              currentUser={currentUser}
              merged={merged}
            />
          </Col>
          <Col
            span={17}
            offset={1}
            style={{
              height: "90vh",
              padding: "10px",
              border: "1px solid white",
              backgroundColor: "#ffff",
              boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.3)",
              borderRadius: "20px",
              background: "#fffff",
            }}
          >
            <MessageInbox selectedUser={activeReceiver} currentUser={currentUser} />
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default ChatPage;
