import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import ChatMessageDisplay from "./ChatMessagedisplay";

const ScrollableMessage = ({ message}) => {
  return (
    <>
      <ScrollableFeed>
        {message ? (
          message?.map((m, i) => (
            <ChatMessageDisplay
              key={m?._id}
              m={m}
              message={message}
              index={i}
              
            />
          ))
        ) : (
          <></>
        )}
      </ScrollableFeed>
    </>
  );
};
export default ScrollableMessage;
