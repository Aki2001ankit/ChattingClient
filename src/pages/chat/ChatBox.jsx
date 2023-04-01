import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/chatprovider";


const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectChat } = ChatState();
  
    return (
      <Box
        display={{ base: selectChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        p={3}
        bg="white"
        width={{ base: "100%", md: "60%", lg: "70%" ,xl:"75%"}}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    );
  };
  
  export default Chatbox;