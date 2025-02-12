import React, { useState, useRef, useEffect } from 'react';

const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    // Set maxHeight to the scrollHeight of the content when open, or 0 when closed
    setMaxHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
  }, [open]);

  return (
    <div className={`accordion-item ${open ? 'open' : ''}`}>
      <div 
        className="accordion-title" 
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
      >
        {question}
      </div>
      <div
        ref={contentRef}
        className="accordion-content"
        style={{
          maxHeight: maxHeight,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease'
        }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AccordionItem;
