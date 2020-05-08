export interface DiceRoll {
  diceType: number;
  roll: number;
  date: string;
  campaign: number;
}

export const isDiceRoll = (input: any): input is DiceRoll =>
  typeof input === "object" &&
  Object.entries(input).every(([key, value]) => {
    switch (key) {
      case "diceType":
      case "roll":
      case "campaign":
        return typeof value === "number";
      case "date":
        return typeof value === "string";
      default:
        return false;
    }
  });
