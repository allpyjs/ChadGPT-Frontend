// MarkdownRenderer.js
import React from "react";
import { marked } from "marked";
import "highlight.js/styles/github.css"; // Or any other style you prefer
import hljs from "highlight.js";

// Optional configuration for `marked`
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

const MarkdownRenderer = ({ markdownText }) => {
  const getMarkdownText = () => {
    var rawMarkup = marked(markdownText, { sanitize: true });
    return { __html: rawMarkup };
  };

  return <div dangerouslySetInnerHTML={getMarkdownText()} />;
};

export default MarkdownRenderer;
