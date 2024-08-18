import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";
import { decrypt, encrypt } from "./enc";

const Banner = ({
  password,
  setPassword,
  previewEncrypted,
  togglePreview,
}: {
  password: string;
  setPassword: (password: string) => void;
  previewEncrypted: boolean;
  togglePreview: () => void;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row items-center space-x-4">
        <span>Rentry Encryptor: {previewEncrypted ? "Preview" : "Edit"}</span>
        <div className="flex flex-row items-center space-x-2">
          <label>
            <input
              type="checkbox"
              disabled={password === ""}
              checked={previewEncrypted}
              onChange={togglePreview}
            />{" "}
            Preview Encrypted
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <p>Tutorial:</p>
        <ol className="list-decimal list-inside">
          <li>Enter a password in the input field above.</li>
          <li>
            Once a password is entered, the "Preview Encrypted" checkbox will be
            enabled.
          </li>
          <li>
            Check the "Preview Encrypted" box to see your content encrypted.
          </li>
          <li>Uncheck the box to return to editing mode.</li>
        </ol>
      </div>
    </div>
  );
};

const ContentScript = () => {
  const [password, setPassword] = useState("");
  const [previewEncrypted, setPreviewEncrypted] = useState(false);
  const newSubmitButtonRef = useRef<HTMLButtonElement>(null);
  const passwordRef = useRef(password);
  const decryptButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const togglePreview = useCallback(async () => {
    setPreviewEncrypted((prevState) => {
      const newPreviewState = !prevState;

      if (newPreviewState) {
        getEditorContent().then((content) => {
          encrypt(content, passwordRef.current).then((encrypted) => {
            setEditorContent(encrypted);
          });
        });
      } else {
        restoreOriginalContent();
      }

      return newPreviewState;
    });
  }, []);

  const getEditorContent = (): Promise<string> => {
    return new Promise((resolve) => {
      window.postMessage({ type: "GET_EDITOR_CONTENT" }, "*");
      window.addEventListener("message", function onMessage(event) {
        if (event.data.type === "EDITOR_CONTENT") {
          window.removeEventListener("message", onMessage);
          resolve(event.data.content);
        }
      });
    });
  };

  const setEditorContent = (content: string) => {
    window.postMessage({ type: "SET_EDITOR_CONTENT", content }, "*");
  };

  const restoreOriginalContent = () => {
    window.postMessage({ type: "RESTORE_ORIGINAL_CONTENT" }, "*");
  };

  const submitEditorContent = async () => {
    const content = await getEditorContent();

    const encryptedContent = await encrypt(content, passwordRef.current);
    window.postMessage(
      { type: "SUBMIT_EDITOR_CONTENT", content: encryptedContent },
      "*"
    );
  };

  const decryptEditorContent = async () => {
    const content = await getEditorContent();
    console.log("Encrypted content:", content);
    const decryptedContent = await decrypt(content, passwordRef.current);
    console.log("Decrypted content:", decryptedContent);
    setEditorContent(decryptedContent);
  };

  useEffect(() => {
    function injectScript() {
      const script = document.createElement("script");
      script.src = browser.runtime.getURL("src/injected.js");
      (document.head || document.documentElement).appendChild(script);
    }
    injectScript();

    // there is a button with id "submitButton" that is used to submit the editor content, we are going to hide the button and add a new one with the same styles

    if (newSubmitButtonRef.current) {
      const submitButton = document.getElementById("submitButton");
      if (submitButton) {
        newSubmitButtonRef.current.id = "my-submit-button";
        newSubmitButtonRef.current.type = "button";
        newSubmitButtonRef.current.style.display = submitButton?.style
          .display as string;
        newSubmitButtonRef.current.innerHTML =
          submitButton?.innerHTML as string;
        submitButton?.parentNode?.appendChild(newSubmitButtonRef.current);
        newSubmitButtonRef.current.addEventListener(
          "click",
          submitEditorContent
        );
        submitButton.style.display = "none";
      }
    }

    // Ensure the decrypt button is properly initialized
    if (decryptButtonRef.current) {
      /// get edit button with inner html of "Edit"
      const editButton = document.querySelector("a[href*='/edit']");

      if (editButton) {
        decryptButtonRef.current.id = "my-decrypt-button";
        decryptButtonRef.current.type = "button";
        editButton?.parentNode?.appendChild(decryptButtonRef.current);
        decryptButtonRef.current.addEventListener(
          "click",
          decryptEditorContent
        );
      }
    }

    const banner = document.createElement("div");
    banner.id = "rentry-encryptor-banner";
    banner.style.display = "flex";
    banner.style.justifyContent = "space-between";
    banner.style.alignItems = "center";
    banner.style.padding = "0 1rem";
  }, [newSubmitButtonRef, decryptButtonRef]);

  return (
    <>
      <Banner
        password={password}
        setPassword={setPassword}
        previewEncrypted={previewEncrypted}
        togglePreview={togglePreview}
      />
      <button
        ref={newSubmitButtonRef}
        id="my-submit-button"
        disabled={password === ""}
        onClick={submitEditorContent}
        style={{ display: "none" }}
      >
        Go
      </button>
      <button
        ref={decryptButtonRef}
        onClick={decryptEditorContent}
        id="my-decrypt-button"
      >
        Decrypt
      </button>
    </>
  );
};

const root = document.createElement("div");
root.id = "rentry-encryptor-root";
document.body.prepend(root);

ReactDOM.createRoot(root).render(<ContentScript />);
