import "./ChatbotButton.css";

const ChatbotButton = ({ onClick }: { onClick: () => void }) => (
  <button className="chatbot-float-btn" onClick={onClick}>
    <img src="/images/astronaut.png" alt="Chatbot" className="chatbot-icon" />
  </button>
);

export default ChatbotButton; 