import { useContext } from 'react';
import RegisterLoginForm from './components/RegisterAndLoginForm';
import Chat from './components/Chat';
import { UserContext } from './UserContext';

export default function Route() {
    const { username, id } = useContext(UserContext);

    if (username) {
        return <Chat />;
    }

    return (
        <RegisterLoginForm />
    )
}