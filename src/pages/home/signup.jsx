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

const SignUp = () => {
  const [fname, setfname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [cpassword, setcpassword] = useState();
  const [pic, setpic] = useState();
  const [passwordshow, setpasswordShow] = useState(false);
  const [cpasswordshow, setcpasswordShow] = useState(false);
  const [errorpassword, seterrorpassword] = useState(false);
  const [errorcpassword, seterrorcpassword] = useState(false);
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const handleClickshowpassword = () => setpasswordShow(!passwordshow);
  const handleClickshowCpassword = () => setcpasswordShow(!cpasswordshow);

  const HandlePassword = (e) => {
    setpassword(e.target.value);
    if (password.length < 4) {
      seterrorpassword(true);
    } else seterrorpassword(false);
  };

  const HandlecPassword = (e) => {
    setcpassword(e.target.value);
    if (cpassword !== password) {
      seterrorcpassword(true);
    } else seterrorpassword(false);
  };
  const HandleProfilePhoto = (e) => {
    const pics = e.target.files[0];

    setloading(true);

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
          setpic(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
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
      setloading(false);
    }
  };

  const SendDataToBackend = async (e) => {
    try {
      setloading(true);
      e.preventDefault();

      if (password.length >= 4 && password === cpassword) {
        const userdata = { name: fname, email, password, pic };

        const res = await axios.post(
          "http://localhost:5000/api/user/",
          userdata,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.status === 201) {
          toast({
            title: "Registation Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setloading(false);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          history.push("/chats");
        } else {
          toast({
            title: "Registation failed",
            description: "try again",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        if (password.length < 4) {
          seterrorpassword(true);
        } else seterrorpassword(false);

        if (cpassword !== password) {
          seterrorcpassword(true);
        } else seterrorpassword(false);
      }
      setloading(false);
    } catch (err) {
      toast({
        title: "Registation failed",
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
          <FormControl isRequired id="name">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setfname(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setemail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired id="password" isInvalid={errorpassword}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={passwordshow ? "text" : "password"}
                placeholder="Enter your password"
                onChange={HandlePassword}
              />
              <InputRightElement>
                <p onClick={handleClickshowpassword}>
                  {!passwordshow ? <BiHide /> : <BiShow />}
                </p>
              </InputRightElement>
            </InputGroup>

            {errorpassword ? (
              <FormErrorMessage>
                Password must contain 4 letter
              </FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired id="cpassword" isInvalid={errorcpassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={cpasswordshow ? "text" : "password"}
                placeholder="Re-confirm your password"
                onChange={HandlecPassword}
              />
              <InputRightElement>
                <p onClick={handleClickshowCpassword}>
                  {!cpasswordshow ? <BiHide /> : <BiShow />}
                </p>
              </InputRightElement>
            </InputGroup>
            {errorpassword ? (
              <FormErrorMessage>Password is not matching</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl id="profile">
            <FormLabel>Upload Profile Photo</FormLabel>
            <Input
              type="file"
              placeholder="Enter your email"
              onChange={HandleProfilePhoto}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            w="100%"
            mt={2}
            type="submit"
            isLoading={loading}
          >
            Sign Up
          </Button>
        </form>
      
      </VStack>
    </>
  );
};
export default SignUp;
