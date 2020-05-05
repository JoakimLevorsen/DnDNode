import WebSocket from "ws";
const type = "DiceRoll";

const wrapPayload = (payload: object) =>
  JSON.stringify({ type, payload: JSON.stringify(payload) });

export interface diceRollPayload {
  diceType: number;
  campaignID: number;
}

export default (socket: WebSocket) => (payload: diceRollPayload) =>
  socket.send(wrapPayload(payload));
