import WebSocket from "ws";
import { LoginInfo } from "../responses/LoginInfo";

const type = "Login";

const wrapPayload = (payload: object) =>
  JSON.stringify({ type, payload: JSON.stringify(payload) });

export default (socket: WebSocket) => (info: LoginInfo) =>
  socket.send(wrapPayload(info));
