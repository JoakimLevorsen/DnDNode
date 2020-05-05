import { isLoginInfo } from "./responses/LoginInfo";
import requestBuilder from "./requestBuilder";
import { Campaign, isCampaign, isCampaignArray } from "./responses/Campaigns";
import { GameState } from "./responses/GameState";
import WebSocket from "ws";

export class WebSocketService {
  private socket: WebSocket;
  private _username?: string;
  private fetchedCampaigns = new Map<number, Campaign>();

  constructor(
    private authListener: (value: boolean) => void,
    private loadedListener: (value: boolean) => void,
    private joinableCampaignsListener: (items: Campaign[]) => void,
    private fetchedCampaignsListener: (
      campaigns: Map<number, Campaign>
    ) => void,
    private gameStateListener: (state: GameState) => void
  ) {
    //   We do a little fiddelin to make it work
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = (0 as unknown) as string;
    this.socket = new WebSocket("wss://localhost:5001/ws");
    this.socket.addEventListener("open", (o) => {
      this.loadedListener(true);
    });
    this.socket.addEventListener("message", (r) =>
      this.onMessage(r.data as string)
    );
    this.socket.addEventListener("error", (o) => console.log("e", o));
    this.socket.addEventListener("close", (o) =>
      console.log("server closed", o)
    );
  }

  // Auth
  signOut = () => this.authListener(false);
  public get username() {
    return this._username;
  }

  private onMessage(msg: string) {
    console.log("Got message", msg);
    try {
      const parsed = JSON.parse(msg);
      if (isLoginInfo(parsed)) {
        this._username = parsed.username;
        this.authListener(true);
        return;
      }
      if (isCampaign(parsed)) {
        const fetchedNow = this.fetchedCampaigns;
        fetchedNow.set(parsed.ID, parsed);
        this.fetchedCampaignsListener(fetchedNow);
        return;
      }
      if (isCampaignArray(parsed)) {
        this.joinableCampaignsListener(parsed);
        return;
      }
      // Since we've parsed some JSON, and the response was not the other types, this must be a gameState
      this.gameStateListener(parsed as GameState);
    } catch (e) {
      // We try to catch the error
      switch (msg) {
        case "LoginManager login 0: Wrong login info":
          return this.authListener(false);
        default:
          console.log(`Got error from websocket: '${msg}'`);
      }
    }
  }

  get requestBuilders() {
    return requestBuilder(this.socket);
  }

  sendSomething() {
    this.socket.send(
      JSON.stringify({
        type: "Login",
        payload: JSON.stringify({
          username: "s185023",
          password: "12345678",
        }),
      })
    );
    console.log("did send something");
  }
}
