import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;
let socket, selectedChatCompare;
const Chat = () => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(true);
  const fetchMesages = () => {
    socket.emit("join chat", selectedChat._id);
  };
  const sendMessage = (data) => {
    socket.emit("stop typing", selectedChat._id);
    socket.emit("new message", data);
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
    return () => {
      socket.disconnect("connected");
    };
  }, []);

  useEffect(() => {
    fetchMesages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([...notification, newMessageRecieved]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const typingHandler = (e) => {
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return <div>Single_Chat</div>;
};
export const EmptyChat = () => {
  return <div>Empty Chat</div>;
};
export default Chat;
