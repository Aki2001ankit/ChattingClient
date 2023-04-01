import { Avatar} from "@chakra-ui/react";
import React  from "react";
import {
  IsSenderLogin,
  UserIndex,
  IsNameVisible,
  MakeCapital,
  GetDateAndTime
} from "../config/chatlogic";
import { VariousColour } from "../config/color";
import { ChatState } from "../context/chatprovider";

const ChatMessageDisplay = ({ message, m, index}) => {

  const { user } = ChatState();
 

  var date = GetDateAndTime(m?.updatedAt);
  // if(message?.[0] === m){setgetdate(data)}

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: `${
            IsSenderLogin(m, user, index) ? "row-reverse" : "row"
          }`,
        }}
      >
        <Avatar
          name={m?.sender?.name}
          src={m?.sender?.pic}
          cursor="pointer"
          size="xs"
          style={{
            display: `${IsSenderLogin(m, user, index) ? "none" : "block"}`,
            visibility: `${
              IsNameVisible(message, m, user, index) ? "" : "hidden"
            }`,
          }}
        />
        <span
          style={{
            backgroundColor: `${
              IsSenderLogin(m, user, index) ? "#5f27cd" : "teal"
            }`,
            color: "white",
            maxWidth: "60%",
            padding: "5px 10px",
            marginTop: "2px",
            marginRight: `${IsSenderLogin(m, user, index) ? "20px" : "0"}`,
            borderTopLeftRadius: `${
              IsSenderLogin(m, user, index) ? "10px" : "0"
            }`,
            borderTopRightRadius: `${
              IsSenderLogin(m, user, index) ? "0" : "10px"
            }`,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
          <span
            style={{
              color: VariousColour[UserIndex(m)],
              display: `${
                IsNameVisible(message, m, user, index) ? "block" : "none"
              }`,
              fontStyle: "bold",
            }}
          >
            {MakeCapital(m?.sender?.name)} <br />
          </span>
          {m?.content}
          <span
            style={{
              color: "#E8E8E8",
              display: "flex",
              flexDirection:"row-reverse",
              fontSize:"8px",
              fontStyle:"italic"
              
             
            }}
          >
            {date?.date}{" "}{date?.time} <br />
          </span>
        </span>
       
      </div>
    </>
  );
};
export default ChatMessageDisplay;
