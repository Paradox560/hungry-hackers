import React from 'react';
import Image from 'next/image';

const Chatbot = () => {
  return (
    <div className="chatbot-container">
      <h2>Chatbot</h2>
      <div className="chatbot">
        <Image src="/chatbot-icon.png" alt="Chatbot" width={50} height={50} />
        <p>Welcome to the chatbot!</p>
      </div>
    </div>
  );
};

export default Chatbot;
