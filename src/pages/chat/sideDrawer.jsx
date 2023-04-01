import {
  Avatar,
  Box,
  FormControl,
  HStack,
  Input,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useState} from "react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatprovider";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import ProfileModal from "../../components/ProfileModal";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../../components/userListItem";
import LoadingChat from "../../components/loadingchat";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import {GetSender} from "../../components/GetSender"
import {UniqueNotification} from "../../config/chatlogic"

const SideDrawer = () => {
  const { user, setselectChat, Chats, setChats,notification,
    setNotification, } = ChatState();
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);


  const { isOpen, onOpen, onClose } = useDisclosure();

  const history = useHistory();
  const toast = useToast();

  
  const HandleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    
  };

  const HandleSearch = async (e) => {
    e.preventDefault();
    setsearch(e.target.value);
    try {
     
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      
      setsearchresult(data);
      setloading(false);
    } catch (err) {
      setloading(false);
      console.log(err);
      toast({
        title: "Request failed",
        description: "failed to load search result",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const AccessChat = async (userid) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/chat", { userid }, config);

      if (!Chats.find((c) => c._id === data._id)) {
        //console.log("not found desire")
        setChats([data, ...Chats]);
      }

      setselectChat(data);
      setloadingChat(false);
      setsearch("");
      onClose();
    } catch (err) {
      setloadingChat(false);
      toast({
        title: "Request failed",
        description: "failed to create chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const OpenDrawer = () => {
    HandleSearch();
    onOpen();
  };

  const CloseDrawer = () => {
    setsearch("");
    onClose();
  };
 
  return (
    <>
      <Box
        bg="white"
        display="flex"
        justifyContent="space-between"
        width="100%"
        p={3}
        borderRadius={"lg"}
        m={1}
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={OpenDrawer}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px={1}>
              {" "}
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
          Let's Talk
        </Text>
        <Text>
          <HStack>
            <Menu>
              <MenuButton as={Button}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
                <BellIcon  fontsize="2xl"/>
              </MenuButton>
              <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setselectChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in "${notif.chat.ChatName}"`
                    : `New Message from "${GetSender(user, notif.chat.users).name}"`}
                </MenuItem>
              ))}
                
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  name={user.name}
                  src={user.pic}
                  size="sm"
                  cursor={"pointer"}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>Profile</MenuItem>
                </ProfileModal>

                <MenuItem onClick={HandleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Text>
      </Box>
      {/* drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={CloseDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text mb={2}>Search User to Chat</Text>
            <HStack>
              <FormControl>
                <Input
                  placeholder="Type name or email..."
                  onChange={HandleSearch}
                  value={search}
                />
              </FormControl>

              <Button onClick={HandleSearch}>
                <SearchIcon />
              </Button>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            {loading ? (
              <LoadingChat />
            ) : (
              searchresult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  HandleClick={() => AccessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideDrawer;
