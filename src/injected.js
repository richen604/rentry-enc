(function () {
  console.log("Injected script loaded");
  function getCodeMirrorContent() {
    // This assumes there's a global CodeMirror object
    // You may need to adjust this based on how CodeMirror is implemented on the target site

    const editor = document.querySelector(".CodeMirror")?.CodeMirror;
    console.log("Editor:", editor);

    return editor

    if (editor) {
      return editor.on("changes", (instance) => {

        return instance.getValue();
      });
    }
    return null;

  }

  const content = getCodeMirrorContent();
  console.log("Content:", content);
  if (content) {
    window.postMessage({ type: "FROM_PAGE", text: content }, "*");
  }
})();