import { useState, useEffect } from "react";
import "./Popup.css";

export default function Popup() {
  const [markdown, setMarkdown] = useState("");
  const [password, setPassword] = useState("");
  const [encryptedText, setEncryptedText] = useState("");

  useEffect(() => {
    console.log("Hello from the popup!");
  }, []);

  const handleEncrypt = async () => {
    try {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encoder.encode(markdown)
      );

      const encryptedArray = new Uint8Array(encryptedContent);
      const resultArray = new Uint8Array(
        salt.length + iv.length + encryptedArray.length
      );
      resultArray.set(salt, 0);
      resultArray.set(iv, salt.length);
      resultArray.set(encryptedArray, salt.length + iv.length);

      setEncryptedText(btoa(String.fromCharCode.apply(null, resultArray)));
    } catch (error) {
      console.error("Encryption failed:", error);
    }
  };

  return (
    <div>
      <h1>Rentry Encryptor</h1>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Enter your markdown here"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter encryption password"
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      {encryptedText && (
        <textarea
          value={encryptedText}
          readOnly
          placeholder="Encrypted text will appear here"
        />
      )}
    </div>
  );
}
