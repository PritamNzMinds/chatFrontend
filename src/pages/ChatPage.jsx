import { Button, Col, Layout, Row } from "antd";
import UserList from "../components/UserList";
import { Suspense, lazy, useEffect, useState } from "react";
import MessageInbox from "../components/MessageInbox";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeLogin } from "../store/auth/authSlicer";
import Loading from "../components/Loading";

const { Header, Content, Footer, Sider } = Layout;

const socket = io("http://localhost:8001/");

// const MessageComponent = lazy(() => import("../components/MessageInbox"));
// const UserListComponent = lazy(() => import("../components/UserList"));

const ChatPage = () => {
  const userDetails = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading,setLoading]=useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [userList, setUserList] = useState([]);
  const [lastMessageList, setLastMessageList] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState(null);

  const handleLogout = () => {
    dispatch(removeLogin());
    navigate("/login");
  };

  useEffect(() => {
    // fetch user data except logged In user
    const fetchUserData = async () => {
      try {
        if (userDetails) {
          setCurrentUser(userDetails);
          // get res from db
          const res = await axios.get("http://localhost:8001/getUsers", {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          });
          setUserList(res.data.data.users);
          setLastMessageList(res.data.data.lastMessageList);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    return () => {
      socket.off("getUsers");
    };
  }, []);

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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
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
            {/* <Suspense fallback={<Loading />}> */}
            {
              loading ? <Loading/> : <UserList
                onClickUser={(item) => setActiveReceiver(item)}
                selectedUser={activeReceiver}
                currentUser={currentUser}
                merged={merged}
              />
            }
              
            {/* </Suspense> */}
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
            {activeReceiver ? (
              // <Suspense fallback={<Loading />}>
                <MessageInbox
                  selectedUser={activeReceiver}
                  currentUser={currentUser}
                />
              // </Suspense>
            ) : (
              <div style={{ textAlign: "center", marginTop: "40%" }}>
                <h3>Select a user to start chatting</h3>
              </div>
            )}
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default ChatPage;
