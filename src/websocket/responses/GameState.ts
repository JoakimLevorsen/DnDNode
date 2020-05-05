import { Campaign } from "./Campaigns";

interface GameStateCampaign extends Campaign {
    dungeonMaster: string;
}

export interface GameState {
    characters: Array<{
        owner: string;
        campaign: number;
        cRace: string;
        cClass: string;
        name: string;
        ID: number;
        xp: number;
        level: number;
        turnIndex: number;
    }>;
    diceRolls: {
        [index: number]: Array<{
            ID: number;
            diceType: number;
            roll: number;
            date: string;
        }>;
    };
    me: string;
    ownedCampaigns: Array<GameStateCampaign>;
    joinedCampaigns: Array<GameStateCampaign>;
}
