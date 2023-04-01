import { Box } from "@chakra-ui/react";
import React from "react";
import { CloseIcon } from "@chakra-ui/icons";
import {MakeCapital} from "../config/chatlogic"

const DisplaySearchUserName = ({ names,handleClick }) => {
  return (
    <>
      <Box
        bg="teal"
        color={"white"}
        px={2}
        py={1}
        m={1}
        borderRadius="lg"
        curser="pointer"
        variant="solid"
        onClick={handleClick}
      >
        {MakeCapital(names)}
        <CloseIcon boxSize={4} pl={1} />
      </Box>
    </>
  );
};

export default DisplaySearchUserName;
