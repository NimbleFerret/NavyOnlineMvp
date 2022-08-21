const io = require("socket.io-client");

const socket = new io('ws://localhost:3000');

socket.emit("login", "log me in");