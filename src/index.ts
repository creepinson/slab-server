import { ServerEvent, SocketEvent } from "./common/constants";
import { World } from "./common/world";
import { ServerSocket, SocketServer } from "./server";

const server = new SocketServer();
let world: World;

// Called when the server is started
server.on(ServerEvent.INIT, () => {
    world = new World();
    world.generateWorld();

    server.on(ServerEvent.CONNECT, (socket: ServerSocket) => {
        // TODO: add player to entity list in World
        console.log(`new player connected: ${socket.id}`);
        socket.emit(SocketEvent.HELLO, { id: socket.id });

        socket.emit(SocketEvent.CHUNK, world.chunks[0]);

        socket.eventSystem.on(SocketEvent.DISCONNECT, () => {
            console.log("Player disconnected.");
        });
    });
});

server.listen().catch((err) => {
    console.error(err);
    process.exit(1);
});
