"use client";

import React, { useEffect, useRef } from "react";

export function Chatbot() {
  const dialogflowContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple script tags or duplicate bot
    const existingScript = document.querySelector(
      'script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }

    // Prevent multiple df-messenger tags
    if (
      dialogflowContainerRef.current &&
      !dialogflowContainerRef.current.querySelector("df-messenger")
    ) {
      const dfMessenger = document.createElement("df-messenger");
      dfMessenger.setAttribute("intent", "WELCOME");
      dfMessenger.setAttribute("chat-title", "Botaniq");
      dfMessenger.setAttribute("agent-id", "bb2d0a72-828f-473c-9469-77ed16b0ff8c");
      dfMessenger.setAttribute("language-code", "en");
      dfMessenger.setAttribute("chat-icon", ""); // Optional: leave default icon
      dialogflowContainerRef.current.appendChild(dfMessenger);
    }
  }, []);

  return <div ref={dialogflowContainerRef} />;
}