import { Box, Text, useToast, Button, Tooltip, Stack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/chatprovider";
import axios from "axios";
import DisplayAllChatName from "../../components/DisplayAllChatname";
import CreateGroupChatModal from "../../components/CreateGroupChatModal";

const MyChats = () => {
  const {
    user,
    selectChat,
    setselectChat,
    Chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [loggeduser, setloggeduser] = useState();
  const toast = useToast();

  const AccessChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.get("/api/chat", config);

      setChats(data);
    } catch (err) {
      toast({
        title: "Request failed",
        description: "failed to create chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
 

  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    AccessChat();
  }, [Chats?.length, selectChat]);

  return (
    <>
      <Box
        bg="white"
        width={{ base: "100%", md: "40%", lg: "30%", xl: "25%" }}
        mt={0}
        display={{ base: selectChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
      >
        {/* heading */}
        <Box display="flex" justifyContent={"space-between"} p="6px">
          <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
            Chats
          </Text>
          <Tooltip label="Create New Group" hasArrow placement="bottom-end">
            <CreateGroupChatModal user={user}>
              <Button>
                <Text p={2}>New Group</Text>
                <AddIcon />
              </Button>
            </CreateGroupChatModal>
          </Tooltip>
        </Box>
        {Chats ? (
          <Stack overflowY={"scroll"}>
            {Chats?.map((chat) => (
              <DisplayAllChatName
                key={chat._id}
                chat={chat}
                loggeduser={loggeduser}
                HandleClick={() => {
                  setselectChat(chat);
     
                  if (
                    !notification.find((c) => {
                      
                      if (c?.chat?._id === chat._id) {
                        setNotification(notification.filter((n) => n !== c));
                      }
                    })
                  ) {
                  }
                }}
              />
            ))}
          </Stack>
        ) : null}
      </Box>
    </>
  );
};
export default MyChats;
