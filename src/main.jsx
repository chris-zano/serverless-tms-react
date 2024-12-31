import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import './index.css'
import App from './App.jsx'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_xEP7m4WPV",
  client_id: "1iuqdni6sn39h36qune4dhcp3a",
  redirect_uri: "http://localhost:5173",
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
