import React,{useEffect} from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "./login";
import SignUp from "./signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {

  const history = useHistory();

useEffect(() => {
   const user = JSON.parse(localStorage.getItem("userInfo"));
  console.log(user)
   if(user){
    history.push("/chats");
   }
}, [history])
  return (
    <>
   {/* // hello from hoe hhueuijffrl*/}
      <Container maxW="lg" centerContent>
        <Box
          bg="white"
          d="flex"
          justifyContent="center"
          textAlign={"center"}
          w="100%"
          p={3}
          m="40px 0 6px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
            Let's Talk
          </Text>
        </Box>

        <Box
          bg="white"
          d="flex"
          justifyContent="center"
          textAlign={"center"}
          w="100%"
          p={3}
          m="0px 0 5px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab w="50%" pt={1} pb={1}>
                Login
              </Tab>
              <Tab w="50%" pt={1} pb={1}>
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};
export default HomePage;
