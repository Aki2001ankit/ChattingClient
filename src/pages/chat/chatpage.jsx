import { Box, HStack } from "@chakra-ui/react";
import React,{useEffect} from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/chatprovider";
import SingleChat from "./SingleChat";
import MyChats from "./MyChats";
import SideDrawer from "./sideDrawer";
import ChatBox from "./ChatBox"

const ChatPage = () => {
  const { user,  selectChat,  Chats,latestMessage} = ChatState();
  const history = useHistory();
  
  useEffect(() => {
    history.push("/chats")
  
  })

  return (
    <div style={{ width: "100%" , maxHeight:"100vh", overflowY:"hidden", overflowX:"hidden"}}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="85vh"
        p="2px"
        pt="1px"
       
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
export default ChatPage;
