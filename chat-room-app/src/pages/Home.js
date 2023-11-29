import { useState, useEffect, useLayoutEffect } from "react";
import * as React from "react";

function Home() {
  const ShowMsgPerTime = 5;
  const [firstTime, setFirstTime] = useState(true);
  const [tabName, setTabName] = useState("");
  const [message, setMessage] = useState("");
  const [storedMessages, setStoredMessages] = useState([]);
  const [scrollTop, setScrollTop] = useState(1);
  const [pagin, setPagin] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let extractDiv = document.querySelector(".MytabName");
    if (extractDiv !== null && extractDiv.innerHTML.length > 0) {
      setFirstTime(false);
    }

    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Order messages by timestamp (assuming timestamp is a property of each message)
    // Take the latest 5 messages
    const latestMessages = storedMessages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    // Dispatch the action to update the Redux store
    setStoredMessages(
      latestMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )
    );
    // Listen for changes in localStorage from other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const handleStorageChange = (event) => {
    if (event.key === "messages") {
      const newMessages = JSON.parse(event.newValue);
      setStoredMessages(newMessages);
    }
  };
  const SaveuserName = () => {
    setFirstTime(false);
  };

  return (
    <>
      {firstTime && (
        <div className="write-your-name">
          <h1>Welcome</h1>
          <div className="header-part">
            <p>Write Your Name :</p>
            <input
              type="text"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
            />
            <button onClick={SaveuserName}>Submit</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
