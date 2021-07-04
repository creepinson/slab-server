import * as net from "net";
import EventEmitter from "eventemitter3";
import {
    ServerEvent,
    ServerEventType,
    SocketEvent,
    SocketEventType,
} from "./common/constants";
import { nanoid } from "nanoid";

export class ServerSocket {
    readonly eventSystem: EventEmitter<SocketEventType> = new EventEmitter();

    constructor(
        public readonly server: SocketServer,
        public readonly socket: net.Socket,
        public readonly id: string
    ) {
        socket.on("data", (rawData) => {
            const data = JSON.parse(rawData.toString("utf-8"));
            this.eventSystem.emit(data.event, ...data.args);
        });
    }

    emit<T extends EventEmitter.EventNames<SocketEventType>>(
        eventName: T,
        args?: unknown
    ) {
        return this.socket.write(
            `${JSON.stringify({
                eventName,
                data: JSON.stringify(args || {}),
            })}\n`
        );
        // return super.emit(event, ...args);
    }

    broadcast<T extends EventEmitter.EventNames<SocketEventType>>(
        eventName: T,
        args: unknown
    ) {
        this.server
            .getClients()
            .filter((c) => c.id !== this.id)
            .forEach((c) => {
                c.emit(eventName, args);
            });
    }
}

export class SocketServer extends EventEmitter<ServerEventType> {
    public static readonly PORT: number = parseInt(process.env.PORT || "8000");

    private socketHandler: net.Server;
    private readonly sockets: ServerSocket[] = [];

    public getClients() {
        return this.sockets;
    }

    broadcastToAll<T extends EventEmitter.EventNames<SocketEventType>>(
        event: T,
        ...args: EventEmitter.EventArgs<SocketEventType, T>
    ) {
        this.getClients().forEach((c) => {
            c.emit(event, ...args);
        });
    }

    constructor() {
        super();
        // this.httpConnection = this.app.listen(() => {
        //     console.log(`Server listening at port ${SocketServer.PORT}`);
        // });
        this.socketHandler = net.createServer({}, (socket) => {
            const ss = new ServerSocket(this, socket, nanoid(32));
            this.sockets.push(ss);
            this.emit(ServerEvent.CONNECT, ss);
            socket.on("end", () => {
                ss.emit(SocketEvent.DISCONNECT);
                this.emit(ServerEvent.DISCONNECT, ss);
                console.log("DISCONNECTED: " + ss.id);
                // remove the client for list
                let index = this.sockets.indexOf(ss);
                if (index !== -1) this.sockets.splice(index, 1);
            });
        });
    }

    async listen() {
        return new Promise<void>((resolve) => {
            this.socketHandler.listen(SocketServer.PORT, () => {
                console.log(`Server listening at port ${SocketServer.PORT}`);
                this.emit("init");
                resolve();
            });
        });
    }
}
