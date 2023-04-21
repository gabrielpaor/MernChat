# ChatApp

This is a real-time chat application developed using MERN stack. It allows user to register, login, send a message and file. It is designed using tailwind library.

## Installation

Before running the application, make sure you have Node.js and MongoDB on your local computer, you can also use MongoDB atlas for the mongo url.

1. Clone the repository:<br/><br/>
`git clone https://github.com/gabrielpaor/MernChat.git`

2. Install dependencies:<br/><br/>
`cd server` <br />
`npm install` <br />
`cd client` <br />
`npm install` <br />

3. Start the server:<br/><br/>
`cd client` <br />
`npm start`<br /><br />
  *The server should be running on `http://localhost:4000`.*
  
4. Start the server:<br/><br/>
`cd server` <br />
`npm run dev`<br /><br />
  *The server should be running on `http://localhost:5173`.*

I included the .env file in the repository for the convenience purposes.

## Usage

### Register or Login

To register or login, you can click the register button when the page render login and after submitting your registration, you will automatically logged in.

### Send a message

Once you're logged in, you should select a contact first before you can send a message. After selecting a contact person, you can then send a message or file.

### Logout

To logout, click the logout button beside your username in the navbar section.
