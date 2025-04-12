import React from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const handleClick = () => {
    alert("Working on adding a chatbot");
  };

  return (
    <div className="chatbot-icon" onClick={handleClick}>
      <img src="https://static.vecteezy.com/system/resources/thumbnails/006/692/321/small_2x/chatting-message-icon-template-black-color-editable-chatting-message-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg" alt="Chatbot Icon" />
    </div>
  );
};

export default Chatbot;
