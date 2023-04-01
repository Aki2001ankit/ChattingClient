import { Avatar, Box, HStack, Text} from "@chakra-ui/react";
import React from "react";
import {MakeCapital} from "../config/chatlogic"

const UserListItem = ({ user, HandleClick }) => {
  return (
    <>
      <Box
        onClick={HandleClick}
        cursor="pointer"
        color="black"
        bg="#f2f2f2"
        _hover={{
          background: "teal",
          color: "white",
        }}
        w="100%"
        display={user === null ? "none" : "flex"}
        alignItems={"center"}
        px={3}
        py={2}
        mb={1}
        mt={1}
        borderRadius="lg"
       
      >
        <HStack>
          <Avatar
            name={user?.name}
            src={user?.pic}
            size="sm"
            cursor={"pointer"}
          />
          <Box>
            <Text>{MakeCapital(user?.name)}</Text>
            <Text fontSize="xs">
              <b>Email : </b>
              {user?.email}
            </Text>
            <Text></Text>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default UserListItem;
