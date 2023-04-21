import { useContext, useEffect, useState, useRef } from "react";
import React from 'react';

import { UserContext } from "../UserContext";
import {uniqBy} from 'lodash';
import axios from "axios";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Avatar from "./Avatar";

const Chat = () => {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople,setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const {username, id, setId, setUsername} = useContext(UserContext);
    const divUnderMessages = useRef();

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
          div.scrollIntoView({behavior:'smooth', block:'end'});
        }
      }, [messages]);

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            })
        }
    }, [selectedUserId])

    useEffect(() => {
        axios.get('/people').then(res => {
          const offlinePeopleArr = res.data
            .filter(p => p._id !== id)
            .filter(p => !Object.keys(onlinePeople).includes(p._id));
          const offlinePeople = {};
          offlinePeopleArr.forEach(p => {
            offlinePeople[p._id] = p;
          });
          setOfflinePeople(offlinePeople);
        });
      }, [onlinePeople]);

    useEffect(() => {
        connectToWs();
    }, []);

    const connectToWs = () => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage)
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect.');
                connectToWs();
            }, 1000)
        })
    }

    const showOnlinePeople = (peopleArray) => {
        const people = {};
        peopleArray.forEach(({userId, username}) => {
            people[userId] = username;
            // console.log(people[userId])
        })
        setOnlinePeople(people);
    }
    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data);
        if ('online' in messageData) {
            showOnlinePeople(messageData.online)
        } else if ('text' in messageData){
            setMessages(prev => ([...prev, {...messageData}]));
        }
    }
    const sendMessage = (e, file = null) => {
        if (e) e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessage,
            file,
        }));
        if (file) {
            axios.get('/messages/'+selectedUserId).then(res => {
                setMessages(res.data);
            });
        } else {
            setNewMessage('');
            setMessages(prev => ([...prev, {
                text: newMessage, 
                sender: id,
                recipient: selectedUserId,
                _id: Date.now()
            }]))
        }
    }

    const sendFile = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                name: e.target.files[0].name,
                data: reader.result,
            });
        };
    }

    const onlinePeopleExcludeCurrentUser = {...onlinePeople}
    delete onlinePeopleExcludeCurrentUser[id];

    const messagesWithoutDupes = uniqBy(messages, '_id');

    return (
        <>
        <div className="flex h-screen flex-col bg-gray-800">
            <div className="">
                <Navbar username={username}/>
            </div>
            <div className="flex flex-grow m-10 gap-3">
                <div className="bg-gray-900 w-1/3 flex flex-col text-white border border-gray-500 rounded-xl">
                    <div className="text-white text-xl font-bold ml-6 mt-5">Contacts</div>
                    <div className="flex-grow m-5 mt-4 border border-gray-700 rounded-xl pt-4">
                        {Object.keys(onlinePeopleExcludeCurrentUser).map(userId => (
                            <Contact 
                                key={userId}
                                id={userId}
                                username={onlinePeopleExcludeCurrentUser[userId]}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                                online={true} />
                        ))}
                        {Object.keys(offlinePeople).map(userId => (
                            <Contact 
                                key={userId}
                                id={userId}
                                username={offlinePeople[userId].username}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                                online={false} />
                        ))}
                    </div>
                    </div>
                    <div className="bg-gray-900 w-2/3 p-2 flex flex-col border border-gray-500 rounded-xl">
                        <div className="flex-grow">
                            {!selectedUserId && (
                                <div className="flex flex-grow items-center justify-center h-full">
                                    <div className="text-gray-400">&larr; Select a contact person</div>
                                </div>
                            )}
                            {!!selectedUserId && (
                                <div className="relative h-full">
                                    <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                    {messagesWithoutDupes.map(message => (
                                        <div key={message._id} className={(message.sender === id ? 'text-right': 'text-left')}>
                                            <div className={"text-left inline-block p-2 my-2 mx-3 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white':'bg-gray-200 text-gray-500')}>
                                            {message.text}
                                            {message.file && (
                                                <div className="">
                                                <a target="_blank" className="flex items-center gap-1 border-b border-b-gray-400" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                                                    </svg>
                                                    {message.file}
                                                </a>
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                        ))}
                                        <div ref={divUnderMessages}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!!selectedUserId && (
                            <form className="flex gap-2" onSubmit={sendMessage}>
                            <input 
                                type="text" className="bg-white border border-gray-500 p-2 flex-grow rounded-xl"
                                placeholder="Type your message"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)} />
                            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-xl border border-blue-300">
                                <input type="file" className="hidden" onChange={sendFile} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                                </svg>
                            </label>
                            <button type="submit" className="bg-blue-500 p-2 text-white rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat;