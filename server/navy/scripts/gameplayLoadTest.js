const { io } = require("socket.io-client");

const transports = ["websocket"];

const URL = process.env.URL || "http://localhost:4020";
const MAX_CLIENTS = 100;
const CLIENT_CREATION_INTERVAL_IN_MS = 2000;
const SHOOTING_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

class Client {
    constructor(playerId) {
        this.playerId = playerId;
        this.inputIndex = 0;
        this.socket = io(URL, {
            transports,
        });

        this.socket.on("SocketServerEventAddEntity", () => {
            packetsSinceLastReport++;
        });
        this.socket.on("SocketServerEventRemoveEntity", () => {
            packetsSinceLastReport++;
        });
        this.socket.on("SocketServerEventUpdateWorldState", () => {
            packetsSinceLastReport++;
        });
        this.socket.on("SocketServerEventEntityInput", () => {
            packetsSinceLastReport++;
        });
        this.socket.on("SocketServerEventEntityInputs", () => {
            packetsSinceLastReport++;
        });
        this.socket.on("SocketServerEventSync", () => {
            packetsSinceLastReport++;
        });

        this.socket.on("disconnect", (reason) => {
            console.log(`disconnect due to ${reason}`);
        });

        setTimeout(() => {
            this.socket.emit('SocketClientEventJoinGame', {
                playerId: 'player_' + this.playerId,
                instanceId: '9fd5b610-93a3-45cf-9d38-311775a33ec5',
                sectorType: 1,
                entityId: 'testShip_' + playerId
            });
            setInterval(() => {
                this.socket.emit('SocketClientEventInput', {
                    index: this.inputIndex++,
                    playerId: 'player_' + this.playerId,
                    playerInputType: 5,
                    shootDetails: {
                        side: 2,
                        aimAngleRads: 1.576341556462854
                    }
                });
            }, SHOOTING_INTERVAL_IN_MS);
        }, 200);
    }
}


const printReport = () => {
    const now = new Date().getTime();
    const durationSinceLastReport = (now - lastReport) / 1000;
    const packetsPerSeconds = (
        packetsSinceLastReport / durationSinceLastReport
    ).toFixed(2);

    console.log(
        `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
    );

    packetsSinceLastReport = 0;
    lastReport = now;
};

setInterval(printReport, 5000);

const createClientInterval = setInterval(() => {
    if (clientCount < MAX_CLIENTS) {
        new Client(clientCount);
        console.log('Client ' + clientCount + ' created! from total: ' + MAX_CLIENTS);
        clientCount++;
    } else {
        clearInterval(createClientInterval);
        console.log('All clients created! total: ' + clientCount);
    }
}, CLIENT_CREATION_INTERVAL_IN_MS);
