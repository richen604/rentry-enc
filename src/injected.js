/**
 * @typedef {import('codemirror').Editor} Editor
 */
import CodeMirror from "codemirror";

(function () {
  console.log("Injected script loaded");

  const element = document.querySelector(".CodeMirror");
  if (!element) return;

  const editor = element.CodeMirror;
  if (!editor) throw new Error("No editor found")


  const STORAGE_KEY = 'originalEditorContent';



  window.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "GET_EDITOR_CONTENT": {
        const content = localStorage.getItem(STORAGE_KEY) || editor.getValue();
        window.postMessage({ type: "EDITOR_CONTENT", content }, "*");
        break;
      }
      case "SET_EDITOR_CONTENT": {
        if (!localStorage.getItem(STORAGE_KEY)) {
          localStorage.setItem(STORAGE_KEY, editor.getValue());
        }
        editor.setValue(event.data.content);
        break;
      }
      case "RESTORE_ORIGINAL_CONTENT": {
        const originalContent = localStorage.getItem(STORAGE_KEY);
        if (originalContent) {
          editor.setValue(originalContent);
          localStorage.removeItem(STORAGE_KEY);
        }
        break;
      }
      case "SUBMIT_EDITOR_CONTENT": {
        const content = event.data.content;

        console.log("SUBMIT_EDITOR_CONTENT", content);

        editor.setValue(content);
        // submit the content to the server
        const submitButton = document.getElementById("submitButton")
        submitButton.click();
        break;
      }
    }
  });
})();