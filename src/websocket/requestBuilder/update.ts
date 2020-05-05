import WebSocket from "ws";
const type = "Update";

const wrapPayload = () => JSON.stringify({ type });

export default (socket: WebSocket) => () => socket.send(wrapPayload());
