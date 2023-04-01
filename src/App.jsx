
import './App.css';
import HomePage from './pages/home/homepage';
import ChatPage from './pages/chat/chatpage';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Route  path='/' component={HomePage} exact/>
    <Route path='/chats' component ={ChatPage}/>
    
    
    </div>
  );
}

export default App;
