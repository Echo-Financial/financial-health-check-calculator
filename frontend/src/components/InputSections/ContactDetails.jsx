import React from 'react';
import { Field, ErrorMessage } from 'formik';

const ContactDetails = () => (
    <>
        <h3 data-testid="step-5-heading">Contact Details</h3>
        <div className="form-group">
            <label htmlFor="email">Email *</label>
            <Field
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="e.g., test@example.com"
            />
           <ErrorMessage name="email" component="div" className="text-danger" />
        </div>
       <div className="form-group">
            <label htmlFor="name">Name *</label>
            <Field
                type="text"
                id="name"
                name="name"
                className="input-field"
                placeholder="e.g., John Doe"
            />
            <ErrorMessage name="name" component="div" className="text-danger" />
        </div>
         <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <Field
                type="text"
                id="phone"
                name="phone"
                className="input-field"
                placeholder="e.g., 123-456-7890"
            />
             <ErrorMessage name="phone" component="div" className="text-danger" />
        </div>
    </>
);

export default ContactDetails;