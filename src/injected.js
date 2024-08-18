/**
 * @typedef {import('codemirror').Editor} Editor
 */
import CodeMirror from "codemirror";

(function () {
  console.log("Injected script loaded");

    /** @type {HTMLElement|null} */
    const element = document.querySelector(".CodeMirror");
    if (!element) return undefined;

    /** @type {Editor|undefined} */
    const editor = element.CodeMirror;
    console.log("Original Editor:", editor);

    // Create a new textarea element for the cloned editor
    const clonedTextarea = document.createElement("textarea");
    document.body.appendChild(clonedTextarea);

    // Create a new CodeMirror instance with the same options as the original
    const clonedEditor = CodeMirror.fromTextArea(clonedTextarea, editor.options);
    
    // Set the initial value of the cloned editor
    clonedEditor.setValue(editor.getValue());

    // hide the cloned editor
    clonedEditor.getWrapperElement().style.display = "none";

    // Set up event listeners to sync changes between editors
    editor.on("change", (instance, changeObj) => {
      if (changeObj.origin !== "cloned") {
        clonedEditor.replaceRange(changeObj.text, changeObj.from, changeObj.to, "original");
      }
    });

    clonedEditor.on("change", (instance, changeObj) => {
      if (changeObj.origin !== "original") {
        editor.replaceRange(changeObj.text, changeObj.from, changeObj.to, "cloned");
      }
    });

    console.log("Cloned Editor:", clonedEditor);

    // Create a MutationObserver to watch for changes
    const observer = new MutationObserver(() => {
      const content = editor.getValue();
      window.dispatchEvent(new CustomEvent('codemirror-content-changed', { detail: content }));
    });

    // Observe the CodeMirror-lines element for changes
    const lines = element.querySelector('.CodeMirror-lines');
    if (lines) {
      observer.observe(lines, { childList: true, subtree: true, characterData: true });
    }

    return editor;
  
})();