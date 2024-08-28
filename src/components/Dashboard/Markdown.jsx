import PropTypes from "prop-types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Typewriter from "typewriter-effect";

function TypeOnce({ children }) {
  const [on, setOn] = useState(true);
  return on ? (
    <Typewriter
      options={{
        delay: 45,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(children)
          .start()
          .callFunction(() => {
            setOn(false);
          });
      }}
    />
  ) : (
    children
  );
}

const Markdown = ({ markdownText }) => {
  return (
    <ReactMarkdown
      components={{
        // div: ({ node, ...props }) => <div className="p-4" {...props} />,
        p: ({ node, ...props }) => <p className="p-3" {...props} />,
        h1: ({ node, ...props }) => (
          <p className="text-4xl font-bold" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <p className="text-2xl font-bold" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <p className="text-xl font-bold" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <p className="text-lg font-bold" {...props} />
        ),
        h5: ({ node, ...props }) => (
          <p className="text-base font-bold" {...props} />
        ),
        h6: ({ node, ...props }) => (
          <p className="text-sm font-bold" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc ml-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal ml-8 mt-2" {...props} />
        ),
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "language-js");
          return !inline ? (
            <SyntaxHighlighter {...props} style={atomDark} language={match[1]}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdownText}
    </ReactMarkdown>
  );
};

export default Markdown;

Markdown.propTypes = {
  markdownText: PropTypes.string,
};
