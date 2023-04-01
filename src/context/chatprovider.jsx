import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectChat, setselectChat] = useState();
  const [Chats, setChats] = useState();
  const [latestMessage, setlatestMessage] = useState()
  const [notification, setNotification] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setuser(userInfo);
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ user, setuser, selectChat, setselectChat, Chats, setChats,latestMessage, setlatestMessage, 
       notification,
        setNotification,}}
    >
      {" "}
      {children}{" "}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
