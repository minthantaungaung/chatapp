import { Height } from "@mui/icons-material";
import { useState, useEffect, useLayoutEffect } from "react";
import * as React from "react";

function Home() {
  const ShowMsgPerTime = 5;
  const [firstTime, setFirstTime] = useState(true);
  const [tabName, setTabName] = useState("");
  const [message, setMessage] = useState("");
  const [storedMessages, setStoredMessages] = useState([]);
  const [scrollTop, setScrollTop] = useState(1);
  const [pagi, setPagi] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let extractDiv = document.querySelector(".MytabName");
    if (extractDiv !== null && extractDiv.innerHTML.length > 0) {
      setFirstTime(false);
    }

    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

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

  useLayoutEffect(() => {
    const localstroageMsg = JSON.parse(localStorage.getItem("messages")) || [];
    if (localstroageMsg.length !== storedMessages.length) setLoading(true);
    setTimeout(() => {
      if (localstroageMsg.length > storedMessages.length) {
        let DeleteAmount;
        let finaDelAmount;
        if (storedMessages.length + ShowMsgPerTime > localstroageMsg.length) {
          // DeleteAmount =localstroageMsg.length
          finaDelAmount = localstroageMsg;
        } else {
          DeleteAmount =
            localstroageMsg.length - (storedMessages.length + ShowMsgPerTime);
          finaDelAmount = localstroageMsg.splice(Number(DeleteAmount));
        }
        setStoredMessages(finaDelAmount);
      }
      setLoading(false);
    }, 2000);
  }, [pagi]);
  // 100 = 100 yae length
  const handleStorageChange = (event) => {
    if (event.key === "messages") {
      const newMessages = JSON.parse(event.newValue);
      setStoredMessages(
        newMessages.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      );
    }
  };

  const handleMessageChange = (event) => {
    const newMessage = event.target.value;
    setMessage(newMessage);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newMessageObj = {
      name: tabName,
      message: message,
      timestamp: new Date().toISOString(), // Add timestamp
    };

    // Update the state with the new message
    setStoredMessages([...storedMessages, newMessageObj]);
    let localData = localStorage.getItem("messages");
    console.log("hello", JSON.parse(localData));
    const data = JSON.parse(localData);
    // console.log(hello,'he')
    // console.log('localData :>> ', JSON.parse(localData));
    let obj = [newMessageObj];
    if (localData !== null) obj.push(...data);

    console.log("obj :>> ", obj);
    // Store the updated messages in localStorage
    localStorage.setItem("messages", JSON.stringify(obj));

    // Clear the message input
    setMessage("");

    const timer = window.setInterval(function () {
      const MessageBox = document.querySelector(".messageBox");
      MessageBox.scrollTop = MessageBox.scrollHeight;
      window.clearInterval(timer);
    }, 50);
  };

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
    if (event.currentTarget.scrollTop == 0) {
      setPagi(pagi + 1);
      // alert('top')
    }
  };

  const SaveuserName = () => {
    setFirstTime(false);
  };

  return (
    <div className="container">
      {firstTime && (
        <div className="card mt-5">
          <div className="card-header">Chat Room App</div>
          <div className="card-body">
            <h5 className="card-title">Chat Room Application</h5>
            <p className="card-text">
              Local storage facilitates communication between tabs in the chat
              room, enabling seamless conversation synchronization across
              multiple browser tabs.
            </p>

            <div className="input-group mb-3">
              <form className="d-flex" role="search" onSubmit={SaveuserName}>
                <input
                  className="form-control me-2"
                  type="search"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  placeholder="Enter your username..."
                  aria-label="Username"
                />
                <button className="btn btn-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
          <div className="card-footer text-body-secondary">
            - Min Thant Aung Aung
          </div>
        </div>
      )}
      {!firstTime && (
        <>
          <center>
            <div
              className="card mt-5"
              style={{ width: "500px", height: "700px" }}
            >
              <div className="card-body">
                <nav className="navbar sticky-top bg-body-tertiary">
                  <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                      {tabName ?? ""}
                    </a>
                  </div>
                </nav>
                <div className="row">
                  <div className="messageBox" onScroll={handleScroll}>
                    {loading && (
                      <div className="lds-ripple">
                        <div></div>
                        <div></div>
                      </div>
                    )}
                    {storedMessages.map((msg, index) => (
                      <div className="discussion">
                        <div
                          key={index}
                          className={`bubble ${
                            msg.name === tabName
                              ? "recipient first"
                              : "sender last"
                          }`}
                        >
                          <p>
                            {msg.name} : {msg.message} {index + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="row mt-2">
                  <form className="mt-2 d-flex" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={message}
                      onChange={handleMessageChange}
                      placeholder="Send a message"
                      aria-label="message"
                      aria-describedby="button-msg-submit"
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      id="button-msg-submit"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </center>
        </>
      )}
    </div>
  );
}

export default Home;
