import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";

const ContentScript = () => {
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    console.log("Injecting script");
    function injectScript() {
      const script = document.createElement("script");
      script.src = browser.runtime.getURL("src/injected.js");
      script.onload = function () {
        console.log("Injected script loaded successfully");
        this.remove();
      };
      script.onerror = function () {
        console.error("Failed to load the injected script");
      };
      (document.head || document.documentElement).appendChild(script);
    }
    injectScript();

    // Listen for messages from the injected script
    window.addEventListener("message", (event) => {
      if (event.data.type === "FROM_PAGE" && event.data.text) {
        setEditorContent(event.data.text);
      }
    });

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("message", () => {});
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
