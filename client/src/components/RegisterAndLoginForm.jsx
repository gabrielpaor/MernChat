import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);

  const handleSubmit = async(e) => {
      e.preventDefault();
      const url = isLoginOrRegister === 'register' ? 'register' : 'login';
      const {data} = await axios.post(url, {username, password})
      setLoggedInUsername(username);
      setId(data.id);
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
    <form className="w-100 p-5 border rounded-md border-gray-500 shadow-md" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-100 font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-100 font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          { isLoginOrRegister === 'register' ? 'Register' : 'Login' }
        </button>
      </div>
      <div className="mt-2 block text-gray-100">
          {isLoginOrRegister === 'register' && (
            <div className="text-center">
              <span className="mr-2">Have an account already?</span>
              <button onClick={() => setIsLoginOrRegister('login')}>
                Login
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div className="text-center">
              <span className="mr-2">Dont have an account?</span>
              <button onClick={() => setIsLoginOrRegister('register')}>
                Register
              </button>
            </div>
          )}
        </div>
    </form>
  </div>
  )
}

export default RegisterAndLoginForm;