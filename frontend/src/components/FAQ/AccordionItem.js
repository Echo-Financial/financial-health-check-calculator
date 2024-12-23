// frontend/src/components/FAQ/AccordionItem.js


import React, { useState } from 'react';

const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion-item ${open ? 'open' : ''}`}>
      <div className="accordion-title" onClick={() => setOpen(!open)}>
        {question}
      </div>
      <div className={`accordion-content ${open ? 'show' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AccordionItem;
