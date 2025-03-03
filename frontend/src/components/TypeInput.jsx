import React from "react";
import { BsEmojiSmile } from "react-icons/bs";

const TypeInput = () => {
  return (
    <div className="">
      <BsEmojiSmile className="absolute bottom-4 ml-3 z-10" />
      <input
        type="text"
        placeholder="Type a message"
        autoFocus
        className="input input-ghost w-287 pl-12 text-[17px] absolute bottom-1 overflow-hidden"
      />
    </div>
  );
};

export default TypeInput;
