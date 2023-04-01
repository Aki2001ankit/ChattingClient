import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../context/chatprovider";
import {MakeCapital,CutString } from "../config/chatlogic"

const DisplayAllChatName = ({ chat, loggeduser, HandleClick }) => {
  const { user, selectChat } = ChatState();
  const [sender, setsender] = useState();
  const getuser = chat?.latestMessage?.sender;
  const myid = user?._id;

  const GetSenderName = () => {
    if (chat?.users?.[0]._id === loggeduser?._id) {
      setsender(chat?.users?.[1]);
    } else setsender(chat?.users?.[0]);
  };

  useEffect(() => {
    GetSenderName();
  }, []);

  return (
    <>
      <Box
        onClick={HandleClick}
        cursor="pointer"
        bg={selectChat?._id === chat?._id ? "teal" : "#f2f2f2"}
        color={selectChat?._id === chat?._id ? "white" : "black"}
        w="98%"
        d="flex"
        flexDir="column"
        alignItems={"center"}
        px={3}
        py={2}
        mb={1}
        mt={1}
        borderRadius="lg"
      >
        <HStack>
          <Avatar
            name={chat?.isGroupChat ? chat?.ChatName : sender?.name}
            src={chat?.isGroupChat ? chat?.profile : sender?.pic}
            size="sm"
            cursor={"pointer"}
          />
          <Box>
            <Text>{chat?.isGroupChat ? MakeCapital(chat?.ChatName) : MakeCapital(sender?.name)}</Text>
            <Text fontSize="xs">
              <b>
                {myid === getuser?._id ? "you" : MakeCapital(getuser?.name)}{" "}
                {chat?.latestMessage?.content ? ":" : null}{" "}
              </b>{" "}
              {CutString (chat?.isGroupChat ? MakeCapital(chat?.ChatName) : MakeCapital(sender?.name),chat?.latestMessage?.content)}
            </Text>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default DisplayAllChatName;
