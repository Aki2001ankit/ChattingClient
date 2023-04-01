import {
  Box,
  useToast,
  Text,
  HStack,
  Button,
  Avatar,
  VStack,
  Image,
  Input,
  Stack,
  FormControl,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/chatprovider";
import { ArrowBackIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { GetSender } from "../../components/GetSender";
import ProfileModal from "../../components/ProfileModal";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import GroupMember from "../../components/groupMember";
import UserListItem from "../../components/userListItem";
import ScrollableMessage from "../../components/ScrollableMessage";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChatBox = () => {
  const { user, selectChat, setselectChat, setlatestMessage , notification,
        setNotification,} = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Search, setSearch] = useState();
  const [SearchResult, setSearchResult] = useState();
  const [Searching, setSearching] = useState(false);
  const [NewMessage, setNewMessage] = useState();
  const [AllMessage, setAllMessage] = useState();
  const [MessageLoading, setMessageLoading] = useState(false);
  const [socketConnect, setsocketConnect] = useState(true);
  const [isTyping, setisTyping] = useState(false);
  const [Typing, setTyping] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const Sender = !selectChat?.isGroupChat
    ? GetSender(user, selectChat?.users)
    : "";

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setsocketConnect(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  const FetchAllMessage = async (e) => {
    if (!selectChat) return;

    setMessageLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectChat?._id}`,

        config
      );

      setAllMessage(data);
      setMessageLoading(false);
      socket.emit("join chat", selectChat?._id);
    } catch (err) {
      setMessageLoading(false);
      toast({
        title: "Message loading failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const GoBack = () => {
    setselectChat();
    history.push("/chats");
  };

  const HandleSearch = async (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    setSearching(true);

    try {
      const search = Search;
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      setSearching(false);
      setSearchResult(data);
    } catch (err) {
      setSearching(false);
      setSearchResult();
      toast({
        title: "No user found",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const AddInGroup = async (result) => {
    const admin = selectChat?.groupAdmin?._id;
    const userid = user?._id;
    if (admin !== userid) {
      toast({
        title: `Only Admin can add member`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.put(
          "http://localhost:5000/api/chat/addingroup",
          {
            chatid: selectChat?._id,
            userid: result?._id,
          },
          config
        );

        setselectChat(data);
        history.push("/chats");
        toast({
          title: `${result?.name} added`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Not added",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const HandleNewMessage = (e) => {
    setNewMessage(e.target.value);
    //typing handler
    if (!socketConnect) return;
    if (!Typing) {
      setTyping(true);
      socket.emit("typing", selectChat?._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && Typing) {
        socket.emit("stop typing", selectChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const SendMessage = async (event) => {
    if (NewMessage && event.key === "Enter") {
      socket.emit("stop typing", selectChat?._id);
      setTyping(false);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: NewMessage,
            chatId: selectChat,
          },
          config
        );
        socket.emit("sendMessage", data);
        setlatestMessage(data?.chat?.latestMessage);
        setAllMessage([...AllMessage, data]);
      } catch (err) {
        toast({
          title: "Message send fail",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      console.log("nothing");
    }
  };

  useEffect(() => {
    FetchAllMessage();
    selectedChatCompare = selectChat;
  }, [selectChat]);


const GetNotification =async()=>{
  try{
    const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            
          },
        };
    const {data} = await axios.get("http://localhost:5000/api/message/notification",config)
  

  }catch(err){
    console.log(err)
  }

}
const PutNotification=async(m)=>{
  try{
    const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
    const {data} = await axios.post("http://localhost:5000/api/message/notification",m,config)
   
    GetNotification()

  }catch(err){
    console.log(err)
  }

}


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare?._id !== newMessageRecieved?.chat?._id
      ) {
       
        // GetNotification()
        
        if (!notification.includes(newMessageRecieved)) {
          history.push("/chats")
          PutNotification(newMessageRecieved)
          setNotification([newMessageRecieved, ...notification]);
          
        }
      } else {
        

        setAllMessage([...AllMessage, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    history.push("/chats");

    // console.log(selectChat);
  }, [SearchResult, selectChat, AllMessage]);

  return (
    <>
      {!selectChat ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily={"sans-serif"}>
            Click on a user to start chatting
          </Text>
        </Box>
      ) : (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <HStack>
              <Button onClick={GoBack}>
                <ArrowBackIcon />
              </Button>
              <Avatar
                name={
                  selectChat?.isGroupChat ? selectChat?.ChatName : Sender?.name
                }
                src={
                  selectChat?.isGroupChat ? selectChat?.profile : Sender?.pic
                }
                size="sm"
                bg="green"
                cursor={"pointer"}
              />
              <Text fontSize={"xl"} fontFamily={"sans-serif"}>
                {selectChat?.isGroupChat ? selectChat?.ChatName : Sender?.name}
              </Text>
            </HStack>
            {!selectChat?.isGroupChat ? (
              <ProfileModal user={Sender}>
                <Button>
                  <ViewIcon />
                </Button>
              </ProfileModal>
            ) : (
              <Button onClick={onOpen}>
                <ViewIcon />
              </Button>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {MessageLoading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableMessage message={AllMessage} />
              </div>
            )}

            <FormControl
              onKeyDown={SendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div
                style={{marginLeft:0,
                display:"block",
              
                }}


                >
                  <Lottie 
                  options={defaultOptions} 
                  height={23}
                  width={100}
                  style={{marginLeft:0,
                display:"block",
                
                }} 

                  />
                </div>
              ) : (
                <></>
              )}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={NewMessage}
                onChange={HandleNewMessage}
              />
            </FormControl>
          </Box>
          {/* main coded ended here 
          Drawer code
           this is not part of code 
           this is just a function */}

          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            // finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{selectChat?.ChatName}</DrawerHeader>

              <DrawerBody>
                <VStack>
                  <Image
                    boxSize="125px"
                    borderRadius="full"
                    objectFit="cover"
                    src={selectChat?.profile}
                    alt="user image"
                    border="2px solid black"
                  />
                  <Text fontSize={"md"} fontFamily={"sans-serif"}>
                    {selectChat?.GroupDescription}
                  </Text>
                  <Text
                    fontStyle="italic"
                    fontSize={"sm"}
                    fontFamily={"sans-serif"}
                  >
                    Total Participants: {selectChat?.users?.length}
                  </Text>
                  <Box overflowY={"scroll"} maxHeight="300px">
                    <GroupMember
                      users={selectChat?.users}
                      admin={selectChat?.groupAdmin}
                    />
                  </Box>
                </VStack>
              </DrawerBody>

              <DrawerFooter display="block">
                {SearchResult ? (
                  <Stack overflowY={"scroll"} maxHeight="150px" weight="100%">
                    {Searching ? (
                      <Text>Searching....</Text>
                    ) : (
                      <Text>Search Result</Text>
                    )}

                    {SearchResult?.map((result) => (
                      <UserListItem
                        key={result._id}
                        user={
                          selectChat?.users.find((c) => c._id === result._id)
                            ? null
                            : result
                        }
                        HandleClick={() => AddInGroup(result)}
                      />
                    ))}
                  </Stack>
                ) : null}

                <HStack>
                  <Input
                    placeholder="+ Add Users"
                    weight="100%"
                    onClick={HandleSearch}
                  />
                  <Button onClick={HandleSearch}>
                    <SearchIcon />
                  </Button>
                </HStack>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
};
export default SingleChatBox;
