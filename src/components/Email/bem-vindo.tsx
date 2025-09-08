// /components/Email/bem-vindo.tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  
}) => (
  <div>
    <h1>Welcome, asdasd!</h1>
  </div>
);

export default EmailTemplate;