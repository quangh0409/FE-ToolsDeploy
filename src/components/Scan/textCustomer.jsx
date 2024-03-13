import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const Editor = () => {
  const [content, setContent] = useState("");
  // const fileId = "18s68ftSwshrxiDWarW16Lh-eaHGPhOMO";

  const fetchContentFile = async () => {
    // const res = await getContentFile(fileId);
    
    const editor = document.getElementById("editor");
    console.log(
      "🚀 ~ file: textCustomer.jsx:13 ~ fetchContentFile ~ editor:",
      editor.innerText
    );
    if (!editor.innerText) {
      editor.innerText = `FROM node:alpine AS builder
      ARG module
      RUN npm install -g pnpm
      WORKDIR /root/ca
      COPY package.json pnpm-lock.yaml ./
      RUN pnpm fetch
      
      COPY pnpm-workspace.yaml .
      COPY packages packages
      COPY apps/$module/package.json apps/$module/
      
      RUN pnpm --filter $module^... --offline install
      RUN pnpm --filter $module^... build
      
      RUN pnpm --filter $module --offline install
      COPY apps/$module apps/$module
      RUN pnpm --filter $module build
      
      FROM node:alpine AS runner
      ARG module
      WORKDIR /root/ca
      COPY --from=builder /root/ca/package.json .
      COPY --from=builder /root/ca/apps/$module apps/$module
      COPY --from=builder /root/ca/packages packages
      COPY --from=builder /root/ca/node_modules node_modules
      
      ENV module $module
      CMD node apps/$module/build/ca.$module.js
      `;
      const coloredText = editor.innerText.replace(
        /(FROM|ARG|RUN|WORKDIR|COPY|CMD|ENV)/g,
        '<span class="statement">$1</span>'
      );
      editor.innerHTML = coloredText;
    }
    // setContent(res.content);
  };

  const placeCaretAtEnd = (el) => {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const editorRef = useRef(null);
  useEffect(() => {
    fetchContentFile();
    const handleInput = (event) => {
      let text = event.target.innerText;
      console.log(
        "🚀 ~ file: textCustomer.jsx:22 ~ handleInput ~ text:",
        typeof text
      );
      // text = text !== null ? text : content;
      const coloredText = text.replace(
        /(FROM|ARG|RUN|WORKDIR|COPY|CMD|ENV)/g,
        '<span class="statement">$1</span>'
      );
      event.target.innerHTML = coloredText;
      const lines = text.split("\n");
      const wordsInLines = lines.map((line) => line.split(/\s+/)); // Tách từng dòng thành mảng các từ
      console.log(wordsInLines);
      placeCaretAtEnd(event.target);
      // updateLineNumbers();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    // const placeCaretAtEnd = (el) => {
    //   el.focus();
    //   const range = document.createRange();
    //   range.selectNodeContents(el);
    //   range.collapse(false);
    //   const sel = window.getSelection();
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    // };

    const editor = document.getElementById("editor");
    editor.addEventListener("input", handleInput);
    editor.addEventListener("keydown", handleKeyDown);
    // updateLineNumbers();

    return () => {
      editor.removeEventListener("input", handleInput);
      editor.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={editorRef}
      id="editor"
      className="editor"
      spellCheck="false"
      contentEditable="true"
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        whiteSpace: "pre-wrap", // Allow wrapping within words
      }}
      // data-lines="" // Initial data-lines attribute
    ></div>
  );
};

export default Editor;
