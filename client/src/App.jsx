import axios from 'axios';
import { UserContextProvider } from './UserContext';
import Route from './Route';

function App() {
  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Route />
    </UserContextProvider>
  )
}

export default App
