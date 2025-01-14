import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import './index.css'
import App from './App.jsx'
import { library } from '@fortawesome/fontawesome-svg-core';

// Import all icons from each set (solid, brands, regular)
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';


library.add(fas, fab, far);
const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_xEP7m4WPV",
  client_id: "1iuqdni6sn39h36qune4dhcp3a",
  redirect_uri: "https://main.d1d6umq1rxq43.amplifyapp.com/",
  response_type: "code",
  scope: "phone openid email",
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
