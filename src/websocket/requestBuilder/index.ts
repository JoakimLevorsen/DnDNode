import campaign from "./campaign";
import character from "./character";
import login from "./login";
import diceroll from "./diceroll";
import update from "./update";
import WebSocket from "ws";

export default (socket: WebSocket) => ({
  campaign: campaign(socket),
  character: character(socket),
  diceRoll: diceroll(socket),
  login: login(socket),
  update: update(socket),
});
