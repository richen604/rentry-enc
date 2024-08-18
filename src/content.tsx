import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";

const ContentScript = () => {
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    function injectScript() {
      const script = document.createElement("script");
      script.src = browser.runtime.getURL("src/injected.js");
      script.onload = function () {
        console.log("Injected script loaded successfully");
        // this.remove();
      };
      script.onerror = function () {
        console.error("Failed to load the injected script");
      };
      (document.head || document.documentElement).appendChild(script);
    }
    injectScript();

    // Add event listener for the custom event
    const handleContentChange = (event: CustomEvent<string>) => {
      setEditorContent(event.detail);
    };

    window.addEventListener(
      "codemirror-content-changed",
      handleContentChange as EventListener
    );

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener(
        "codemirror-content-changed",
        handleContentChange as EventListener
      );
    };
  }, []);

  return (
    <div>
      <h2>CodeMirror Content:</h2>
      <pre>{editorContent}</pre>
    </div>
  );
};

const root = document.createElement("div");

root.id = "rentry-encryptor-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(<ContentScript />);
