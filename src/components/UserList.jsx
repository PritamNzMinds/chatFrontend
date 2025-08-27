import { Avatar, Input, List } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8001/");

const UserList = ({onClickUser,selectedUser,currentUser,merged}) => {
  return (
    <>
      <div
        style={{
          padding: "15px",
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
                  selectedUser?._id === item._id ? "#e3eaeeff" : "transparent",
              }}
              onClick={() => onClickUser(item)}
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
    </>
  );
};

export default UserList;
