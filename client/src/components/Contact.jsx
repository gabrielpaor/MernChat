import Avatar from './Avatar';

const Contact = ({id, username, onClick, selected, online}) => {
    return (
        <div
        className={" flex gap-2 items-center cursor-pointer mx-5 my-2 rounded-xl "+(selected ? 'bg-gray-600' : '')}
        key={id} onClick={() => onClick(id)}>
            
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={username} userId={id} />
                <span className="text-gray-100">{username}</span>
            </div>
        </div>
    )
}

export default Contact;