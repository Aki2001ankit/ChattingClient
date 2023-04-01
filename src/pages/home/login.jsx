import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputRightElement,
  Button,
  InputGroup,
} from "@chakra-ui/react";
import { BiShow, BiHide } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [passwordshow, setpasswordShow] = useState(false);
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const handleClickshowpassword = () => setpasswordShow(!passwordshow);

  const SendDataToBackend = async (e) => {
    try {
      setloading(true);
      e.preventDefault();
      const userdata = { email, password };
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        userdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setloading(false);
        localStorage.setItem("userInfo", JSON.stringify(res.data));

        history.push("/chats");
      } else {
        toast({
          title: "login failed",
          description: "try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        setloading(false);
      }
    } catch (err) {
      toast({
        title: "login failed",
        description: err.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setloading(false);
    }
  };

  return (
    <>
      <VStack spacing={2} align="stretch">
        <form method="POST" onSubmit={SendDataToBackend}>
          <FormControl isRequired id="lemail">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setemail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired id="lpassword">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={passwordshow ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setpassword(e.target.value)}
              />
              <InputRightElement>
                <p onClick={handleClickshowpassword}>
                  {!passwordshow ? <BiHide /> : <BiShow />}
                </p>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="teal"
            w="100%"
            mt={2}
            type="submit"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
      </VStack>
    </>
  );
};
export default Login;
