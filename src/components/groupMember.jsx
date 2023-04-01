import { Avatar, Box, HStack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserListItem from "./userListItem";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { ChatState } from "../context/chatprovider";
import { useHistory } from "react-router-dom";
import {MakeCapital} from "../config/chatlogic"

const GroupMember = ({ users, admin, HandleClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [RemoveUser, setRemoveUser] = useState();
  const [IsGroupAdmin, setIsGroupAdmin] = useState(false);
  const { user, selectChat, setselectChat } = ChatState();
  const toast = useToast();
  const history = useHistory();

  const AlertRemoveFromGroup = (result) => {
    setRemoveUser(result);
    const groupadmin = selectChat?.groupAdmin?._id;
    const userid = user?._id;
    if (groupadmin === userid) {
      setIsGroupAdmin(true);
    }
    onOpen();
  };
  const RemoveUserFromGroup = async (result) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat//removefromgroup",
        {
          chatid: selectChat?._id,
          userid: result?._id,
        },
        config
      );
      toast({
        title: `${result?.name} removed`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setselectChat(data);
      onClose();
      history.push("/chats");
    } catch (err) {
      toast({
        title: `Failed to remove`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    history.push("/chats");
  }, [selectChat]);

  return (
    <>
      <Box
        onClick={HandleClick}
        cursor="pointer"
        color="black"
        bg="#f2f2f2"
        _hover={{
          background: "ghosty",
          color: "black",
        }}
        w="100%"
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        px={3}
        py={2}
        mb={1}
        mt={1}
        borderRadius="xl"
      >
        <Box>
          <HStack>
            <Avatar
              name={MakeCapital(admin?.name)}
              src={admin?.pic}
              size="sm"
              cursor={"pointer"}
            />

            <Box>
              <Text>{MakeCapital(admin?.name)}</Text>

              <Text fontSize="xs">
                <b>Email : </b>
                {admin?.email}
              </Text>
            </Box>
          </HStack>
          <Text></Text>
        </Box>
        <Text fontSize="xs" fontStyle="italic">
          Admin
        </Text>
      </Box>

      {/* mapping */}

      {users?.map((result) => (
        <UserListItem
          key={result._id}
          user={result?._id !== admin?._id ? result : null}
          HandleClick={() => AlertRemoveFromGroup(result)}
          
        />
      ))}

      {/* alert */}
      {IsGroupAdmin ? (
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          motionPreset="slideInBottom"
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg">
                Remove {RemoveUser?.name}
              </AlertDialogHeader>

              <AlertDialogBody>Are you sure?</AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  colorScheme="red"
                  onClick={() => RemoveUserFromGroup(RemoveUser)}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      ) : (
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          motionPreset="slideInBottom"
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg">You Can't Remove</AlertDialogHeader>

              <AlertDialogBody>Only Admin Can Remove</AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default GroupMember;
