import React, {useState, useEffect, useRef} from 'react';

function ChatBox({ toggleSidebar , sidebarVisible }) {

  /* -- Dark/Light mode -- */
  const [darkMode, setDarkMode] = useState(true); 
  useEffect(() => {
  // Retrieve the mode from local storage on component mount
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    const isDarkMode = savedMode === 'true';
    setDarkMode(isDarkMode);
    updateTheme(isDarkMode);
  }
  }, []);
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };
  const updateTheme = (isDarkMode) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  };

/* -- Send Messages -- */
const [input, setInput] = useState('');
const [chatLog, setChatLog] = useState(() => {
  const savedChatLog = localStorage.getItem('chatLog');
  if (savedChatLog) {
    return JSON.parse(savedChatLog);
  } else {
    const initialPrompt = { user: "gpt", message: "How may I help you?" };
    return [initialPrompt];
  }
});
useEffect(() => {
  localStorage.setItem('chatLog', JSON.stringify(chatLog));
}, [chatLog]);

useEffect(() => {
  const savedChatLog = localStorage.getItem('chatLog');
  if (savedChatLog) {
    setChatLog(JSON.parse(savedChatLog));
  }
}, []);


const sendMessages = async (e) => {
  e.preventDefault();

  const setChatLogNew = [...chatLog, { user: "me", message: input }];
  setInput("");
  setChatLog(setChatLogNew);

  const messagesNew = setChatLogNew.map((message) => message.message).join("\n");

  const options = {
    method: "POST",
    body: JSON.stringify({
      messages: messagesNew,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch('https://gpt-lite-production.up.railway.app/completions', options);
    const data = await response.json();
    console.log(data); // Log the response data

    if (data.choices && data.choices.length > 0) {
      const responseData = data.choices[0].message.content;
      console.log(responseData); // Log the responseData
      const updatedChatLog = [...setChatLogNew, { user: "gpt", message: responseData }];
      setChatLog(updatedChatLog);
    } else {
      console.log("Invalid response structure: choices property not found");
    }
  } catch (error) {
    console.error(error);
  }
};
  function newChat() {
    const initialPrompt = { user: "gpt", message: "How may I help you?" };
    setChatLog([initialPrompt]);
  }

  const chatLogRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat log when a new message appears
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatLog]);

  
  return (
    <>
      <section className={`side-menu ${sidebarVisible ? 'sidebar-visible' : ''}`}>
        <h1>GPT-lite</h1>
        <div className="side-menu-button" onClick={newChat}>
          <h3>
            <i className="bi bi-plus-square-dotted"></i>
            <span> New Chat </span>
          </h3>
        </div>
        <hr />
        <div className="dl-mode">
         <hr></hr>
          <div className="side-menu-button" onClick={toggleDarkMode}>
            <h3>
              <img
                src={darkMode ? require('../imgs/moon-w.png') : require('../imgs/sun-b.png')}
                alt={darkMode ? 'moon' : 'sun'}
              />
              <span title="Switch to light/dark mode">{darkMode ? 'Dark-Mode' : 'Light-Mode'}</span>
            </h3>
          </div>
        </div>
      </section>

      <section className="chat-box">
      <nav>
        <h2>GPT-lite</h2>
        <button onClick={toggleSidebar}>
          <span>&#9783;</span>
        </button>
      </nav>
        <div className="chat-log" ref={chatLogRef}>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>

      <div className='chat-input-holder'>
        <hr></hr>
        <form onSubmit={sendMessages}>
          <span>
            <textarea
              className='chat-input-text'
              placeholder='Send a message'
              rows='1'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <button type="submit">Send</button>
          </span>
        </form>
      </div>
      </section>

      
    </>
  );
}

const ChatMessage = ({message}) => {
  return (
    <div className = {`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className ='chat-message-center'>
        <div className = {`avatar ${message.user === "gpt" && "chatgpt"}`}>
            {message.user === "gpt"  }
        </div>
        <div className = 'message'>
            {message.message}
        </div>
      </div>
  </div>
  )
}


export default ChatBox;