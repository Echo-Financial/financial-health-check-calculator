// __mocks__/react-markdown.js
import React from 'react';

// This mock simply renders its children inside a <div>.
// Adjust as necessary if your tests need different behavior.
const ReactMarkdown = (props) => {
  return <div>{props.children}</div>;
};

export default ReactMarkdown;
