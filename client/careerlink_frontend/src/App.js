import Login from "./components/login/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RequireAuth} from "./auth/requireAuthContext"
import Signup from "./components/signup/Signup";
import Profile from "./components/profile/Profile";


function App() {
  return (
    <>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
