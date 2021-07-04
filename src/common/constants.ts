export enum SocketEvent {
    CONNECT = "connection",
    DISCONNECT = "disconnect",
    HELLO = "say_hi",
    CHUNK = "chunk",
}
export type SocketEventType = `${SocketEvent}`;

export enum ServerEvent {
    CONNECT = "connection",
    DISCONNECT = "disconnect",
    INIT = "init",
}
export type ServerEventType = `${ServerEvent}`;

export enum NoiseType {
    SIMPLEX = "simplex",
}

export const clamp = (number: number, min: number, max: number) =>
    Math.max(min, Math.min(number, max));
