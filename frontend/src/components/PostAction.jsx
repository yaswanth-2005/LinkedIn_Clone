import React from "react";

const PostAction = ({ icon, text, onClick }) => {
  return (
    <button className="flex items-center m-2" onClick={onClick}>
      <span className="mr-1">{icon}</span>
      <span className="inline sm:inline">{text}</span>
    </button>
  );
};

export default PostAction;
