export interface Campaign {
  ID: number;
  name: string;
  log: string;
  turnIndex: number;
  joinable: boolean;
  maxPlayers: number;
  password?: string;
  modificationDate: string;
}

export const isCampaign = (input: any): input is Campaign =>
  typeof input === "object" &&
  Object.entries(input).every(([key, value]) => {
    switch (key) {
      case "ID":
      case "turnIndex":
      case "maxPlayers":
        return typeof value === "number";
      case "name":
      case "log":
      case "password":
      case "modificationDate":
        return typeof value === "string";
      case "joinable":
        return typeof value === "boolean";
      default:
        return false;
    }
  });

export const isCampaignArray = (input: any): input is Campaign[] =>
  typeof input === "object" &&
  input instanceof Array &&
  input.every((v) => isCampaign(v));
