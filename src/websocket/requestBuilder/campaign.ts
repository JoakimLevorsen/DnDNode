import WebSocket from "ws";
const type = "Campaign";

const wrapPayload = (payload: object) =>
  JSON.stringify({ type, payload: JSON.stringify(payload) });

export interface createCampaignProps {
  name: string;
  joinable: boolean;
  maxPlayers: number;
  password?: string;
}

const create = (socket: WebSocket) => (payload: createCampaignProps) =>
  socket.send(
    wrapPayload({ type: "Create", payload: JSON.stringify(payload) })
  );

export interface updateCampaignProps {
  ID: number;
  name: string;
  log: string;
  turnIndex: number;
  joinable: boolean;
  maxPlayers: number;
  password?: string;
}

const update = (socket: WebSocket) => (payload: updateCampaignProps) =>
  socket.send(
    wrapPayload({ type: "Update", payload: JSON.stringify(payload) })
  );

export interface JoinCampaignPayload {
  campaignToJoinID: number;
  joiningCharacterID: number;
}

const join = (socket: WebSocket) => (payload: JoinCampaignPayload) =>
  socket.send(
    wrapPayload({ type: "JoinCampaign", payload: JSON.stringify(payload) })
  );

export default (socket: WebSocket) => ({
  create: create(socket),
  update: update(socket),
  join: join(socket),
});
