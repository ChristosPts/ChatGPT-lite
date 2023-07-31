import './css/reset.css';
import './css/index.css';
import ChatBox from './componets/ChatBox';
 
import React, { useEffect, useState } from 'react';
function App() {
  // eslint-disable-next-line no-unused-vars
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth > 728);

  useEffect(() => {
    const handleResize = () => {
      const newWindowWidth = window.innerWidth;
      setWindowWidth(newWindowWidth);

      if (newWindowWidth <= 728) {
        setSidebarVisible(false);
      } else if (!sidebarVisible) {
        setSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  

  return (
    <div className="App">
      
       <ChatBox toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
       
    </div>
  );
}

export default App;