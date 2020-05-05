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
                return typeof value === "number";
            case "name":
                return typeof value === "string";
            case "log":
                return typeof value === "string";
            case "turnIndex":
                return typeof value === "number";
            case "joinable":
                return typeof value === "boolean";
            case "maxPlayers":
                return typeof value === "number";
            case "password":
                return typeof value === "string";
            case "modificationDate":
                return typeof value === "string";
            default:
                return false;
        }
    });

export const isCampaignArray = (input: any): input is Campaign[] =>
    typeof input === "object" &&
    input instanceof Array &&
    input.every(v => isCampaign(v));
