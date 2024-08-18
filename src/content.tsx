import React from "react";
import ReactDOM from "react-dom/client";

const ContentScript = () => {
  React.useEffect(() => {
    const navUl = document.querySelector("ul.nav");
    if (navUl) {
      const newItem = document.createElement("li");
      newItem.textContent = "New Content";
      navUl.appendChild(newItem);
    }
  }, []);

  return (
    <div id="rentry-encryptor-content">
      <p>This content is added by React</p>
    </div>
  );
};

const root = document.createElement("div");
root.id = "rentry-encryptor-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <ContentScript />
);
