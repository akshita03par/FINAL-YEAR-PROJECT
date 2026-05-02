import { useState } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";

function App() {
  const [auth, setAuth] = useState(() => {
    const savedAuth = sessionStorage.getItem("quickchat_auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const login = (data) => {
    sessionStorage.setItem("quickchat_auth", JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    sessionStorage.removeItem("quickchat_auth");
    setAuth(null);
  };

  return auth ? <Chat auth={auth} logout={logout} /> : <Auth login={login} />;
}

export default App;
