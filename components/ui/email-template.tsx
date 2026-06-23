import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, email, message }) => (
  <div>
    <h1>New message from {firstName}</h1>
    <p>Reply to: {email}</p>
    <p>{message}</p>
  </div>
);
