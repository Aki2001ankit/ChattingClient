import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  Image,
  Text,
  VStack,
  FormControl,
  Input,
  FormLabel,
  HStack,
  Stack,
  Box,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatprovider";
import axios from "axios";
import UserListItem from "./userListItem";
import DisplaySearchUserName from "./displaysearchusername";
import { useHistory } from "react-router-dom";

const CreateGroupChatModal = ({  children }) => {
  const { user, setselectChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ChatName, setChatName] = useState();
  const [GroupDesc, setGroupDesc] = useState();
  const [Search, setSearch] = useState();
  const [SearchResult, setSearchResult] = useState();
  const [GroupMember, setGroupMember] = useState([]);
  const [GroupMemberUserId, setGroupMemberUserId] = useState([]);
  const [Pic, setPic] = useState();
  const [Loading, setLoading] = useState(false);
  const [ShowChangePic, setShowChangePic] = useState(false);
  const history = useHistory();
  const defaultPicUrl =
    "http://res.cloudinary.com/dmtlafcmw/image/upload/v1671808327/bg_bdrx8f.png";

  const toast = useToast();
  
  const HandleSearch = async (e) => {
    setSearch(e.target.value);
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
      setSearchResult(data);

      if (Search === undefined) {
        setSearchResult();
      }
    } catch (err) {
      console.log(err);
      setSearchResult();
      toast({
        title: "No user found",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const AddInGroup = (addeduser) => {
    
    if (!GroupMember.find((c) => c._id === addeduser._id)) {
      setGroupMember([...GroupMember, addeduser]);
      setGroupMemberUserId([addeduser._id, ...GroupMemberUserId]);
    }
  };
  const RemoveUserFromList = (deluser) => {
    setGroupMember(GroupMember.filter((sel) => sel._id !== deluser._id));
  };
  const HandleUploadPic = (e) => {
    const pics = e.target.files[0];
    setLoading(true);
    if (
      pics.type === "image/png" ||
      pics.type === "image/jpeg" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chattingApplication");
      data.append("cloud_name", "dmtlafcmw");
      fetch("https://api.cloudinary.com/v1_1/dmtlafcmw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          setShowChangePic(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast({
            title: "Error",
            description: "File can't uploaded",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Invalid file",
        description: "only jpeg, png and jpg file is allowed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  const CreateGroup = async (e) => {
    e.preventDefault();
    const userids = { name: JSON.stringify(GroupMemberUserId) };
    if (ChatName && GroupMemberUserId?.length > 0) {
      try {
        const userdata = {
          name: ChatName,
          desc: GroupDesc,
          users: JSON.stringify(GroupMemberUserId),
          pic: Pic,
        };
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/chat/creategroup",
          {
            name: ChatName,
            desc: GroupDesc,
            users: JSON.stringify(GroupMemberUserId),
            pic: Pic,
          },
          config
        );
      history.push("/chats")
        toast({
          title: "Group Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setselectChat(data);
        onClose();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to Create Group",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else if (!ChatName) {
      toast({
        title: "Error",
        description: "ChatName is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Add atleast 1 member to create group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent="space-around">
            <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
              Create Group Chat
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"block"}
            w={"100%"}
            pb={3}
            justifyContent="space-around"
            flexDir="row"
          >
            <HStack w="100%" mb={4} display={"flex"}>
              <Box w={{ base: "100%", md: "70%" }} mb={2}>
                <VStack>
                  <FormControl mb={2}>
                    <Input
                      placeholder="Group Name"
                      borderTop="none"
                      borderLeft={"none"}
                      borderRight="none"
                      borderBottom={"1px solid black"}
                      focusBorderColor={"black"}
                      focusBorder="none"
                      onChange={(e) => setChatName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mb={2}>
                    <Input
                      placeholder="Group Description"
                      borderTop="none"
                      borderLeft={"none"}
                      borderRight="none"
                      borderBottom={"1px solid black"}
                      focusBorderColor={"black"}
                      focusBorder="none"
                      onChange={(e) => setGroupDesc(e.target.value)}
                    />
                  </FormControl>
                </VStack>
              </Box>
              <Box w={{ base: "100%", md: "30%" }} mb={2}>
                <VStack>
                  <Image
                    d="flex"
                    justifyContent="space-evenly"
                    boxSize="100px"
                    borderRadius="full"
                    objectFit="cover"
                    src={Pic ? Pic : defaultPicUrl}
                    alt="user image"
                    mb={0}
                  />
                  {ShowChangePic ? (
                    <Input type="file" onChange={HandleUploadPic} />
                  ) : (
                    <Button
                      colorScheme="teal"
                      variant="link"
                      onClick={() => setShowChangePic(true)}
                    >
                      Change icon
                    </Button>
                  )}
                </VStack>
              </Box>
            </HStack>
            {/* <HStack><Text>added member will be showm here</Text></HStack> */}
            <Wrap spacing={3} justify="center">
              {GroupMember?.map((result) => (
                <DisplaySearchUserName
                  key={result._id}
                  names={result.name}

                  handleClick={()=>RemoveUserFromList(result)}
                />
              ))}
            </Wrap>

            <HStack w="100%">
              <FormControl>
                <FormLabel>Add Members:</FormLabel>
                <Input
                  placeholder="Search User eg: Ankit"
                  onChange={HandleSearch}
                />
              </FormControl>
            </HStack>
            {SearchResult ? (
              <Stack overflowY={"scroll"} maxHeight="150px">
                {SearchResult?.map((result) => (
                  <UserListItem
                    key={result._id}
                    user={result}
                    HandleClick={() => AddInGroup(result)}
                  />
                ))}
              </Stack>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              isLoading={Loading}
              onClick={CreateGroup}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateGroupChatModal;
