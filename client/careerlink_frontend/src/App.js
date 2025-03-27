import Login from "./components/login/Login";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        Carrer Link Setup Frontend
        
      <Routes>
        <Route path="/login" element={Login}></Route>
      </Routes>
      </header>
    </div>
  );
}

export default App;
