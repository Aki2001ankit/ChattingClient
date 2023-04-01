import React from "react";
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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {MakeCapital} from "../config/chatlogic"

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent="space-around">
            <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
              {MakeCapital(user?.name)}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="space-around">
            <VStack>
              <Image
                boxSize="100px"
                borderRadius="full"
                objectFit="cover"
                src={user?.pic}
                alt="user image"
              />
              <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
                {user?.email}
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileModal;
