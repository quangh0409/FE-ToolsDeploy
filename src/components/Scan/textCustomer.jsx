import React, { useEffect, useRef } from "react";
import AceEditor from "react-ace";
import ace from "ace-builds";
import "./style.css";

// Import the theme and mode
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/ext-language_tools"; // Optional: For autocomplete features

function Editor(props) {
  const editorRef = useRef(null);
  const markerIds = useRef([]);

  const customStyle = {
    token: ["keyword"],
    regex: "\\b(?:FROM|ARG|RUN|WORKDIR|COPY|CMD|ENV)\\b",
    caseInsensitive: true,
  };

  const addRedUnderline = (editor) => {
    const Range = ace.require("ace/range").Range;
    // Clear existing markers
    markerIds.current.forEach(id => editor.session.removeMarker(id));
    markerIds.current = [];

    // Add new markers
    props.errorLine?.forEach((line) => {
      const lineContent = editor.session.getLine(line - 1);
      const endColumn = lineContent.length;
      const markerId = editor.session.addMarker(
        new Range(line - 1, 0, line - 1, endColumn),
        "ace_underline",
        "text"
      );
      markerIds.current.push(markerId);
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      addRedUnderline(editorRef.current);
    }
  }, [props.errorLine]);

  return (
    <AceEditor
      mode="text"
      theme="solarized_light"
      name="uniqueId"
      width="100%"
      height="500px"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      }}
      value={props?.contentfile?.content }
      editorProps={{ $blockScrolling: true }}
      onChange={(e) => {
        console.log("🚀 ~ Editor ~ e:", e)
        props.setContentfile({ name: props?.contentfile?.name, content: e , type: props?.contentfile?.type});
      }}
      onLoad={(editor) => {
        editorRef.current = editor;
        const session = editor.getSession();
        const TextMode = ace.require("ace/mode/text").Mode;
        class CustomHighlightRules extends ace.require(
          "ace/mode/text_highlight_rules"
        ).TextHighlightRules {
          constructor() {
            super();
            this.$rules = {
              start: [customStyle],
            };
          }
        }
        class CustomMode extends TextMode {
          constructor() {
            super();
            this.HighlightRules = CustomHighlightRules;
          }
        }
        session.setMode(new CustomMode());
        addRedUnderline(editor);
      }}
    />
  );
}

export default Editor;
