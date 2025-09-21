import { Routes, Route } from 'react-router-dom';
import './App.css'; 
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import Login from './Pages/Login';
import Register from './Pages/Register';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
