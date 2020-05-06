import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import path from "path";
import program from "commander";
import { GameState } from "./websocket/responses/GameState";
import { Campaign } from "./websocket/responses/Campaigns";
import { WebSocketService } from "./websocket";
import inquirer from "inquirer";

const isWindows = /^win/.test(process.platform);
const listType = isWindows ? "rawlist" : "list";

clear();
console.log(
  chalk.green(
    figlet.textSync("Dungeons&Dragons CLI", { horizontalLayout: "full" })
  )
);

program.version("1.0.0").description("CLI for playing Dungeons and Dragons");
program.outputHelp();

type PageProps =
  | { type: "SignIn"; username?: string; password?: string }
  | { type: "Menu" | "Loading" }
  | { type: "Create"; name?: string; race?: string; class?: string }
  | { type: "Play"; gameID?: number };

class Game {
  private gameState?: GameState;
  private joinableCampaigns: Campaign[] = [];
  private fetchedCampaigns = new Map<number, Campaign>();
  private signedIn = false;
  private socketService = new WebSocketService(
    (authState) => {
      // If we're not signed in, and got a false, this means the login info was wrong
      if (!this.signedIn && !authState) {
        this.currentPage = { type: "SignIn" };
        this.render("Forkert login information");
      } else {
        this.signedIn = authState;
        this.currentPage = authState ? { type: "Menu" } : { type: "SignIn" };
        this.render();
      }
    },
    () => {
      this.currentPage = { type: "SignIn" };
      this.render();
    },
    (newJoinableCampaings) => {
      this.joinableCampaigns = newJoinableCampaings;
      this.render();
    },
    (newFetchedCampaigns) => {
      this.fetchedCampaigns = newFetchedCampaigns;
      this.render();
    },
    (newGameState) => {
      this.gameState = newGameState;
      this.render();
    }
  );
  // What page do we display now
  private currentPage: PageProps = { type: "Loading" };

  public get title() {
    switch (this.currentPage.type) {
      case "Create":
        return chalk.green(figlet.textSync("Create character"));
      case "Loading":
        return chalk.blue(figlet.textSync("Loading"));
      case "Menu":
        return chalk.white(figlet.textSync("Menu"));
      case "SignIn":
        return chalk.white(figlet.textSync("Sign in"));
    }
  }

  public render(message?: string) {
    //   First we clear the current page
    clear();
    console.log(this.title);
    if (message) console.log(message);
    const { currentPage } = this;
    switch (currentPage.type) {
      case "Loading":
        return;
      case "SignIn": {
        const { username, password } = currentPage;
        console.log("Login with javabog");
        if (username && password) console.log("Loading");
        else
          inquirer
            .prompt([
              {
                name: "username",
                type: "input",
                message: "What is your username?",
              },
              {
                name: "password",
                type: "password",
                message: "What is your password?",
              },
            ])
            .then(({ username, password }) =>
              this.socketService.requestBuilders.login({ username, password })
            );
        return;
      }
      case "Menu":
        if (!this.gameState) this.socketService.requestBuilders.update();
        inquirer
          .prompt({
            type: listType,
            name: "action",
            choices: [
              { name: "Create character", value: "Create" },
              { name: "Join game", value: "Join" },
              { name: "Play game", value: "Play" },
            ],
          })
          .then(({ action }) => {
            switch (action) {
              case "Create":
                this.currentPage = { type: "Create" };
                this.render();
                return;
              case "Play":
                this.currentPage = { type: "Play" };
                this.render();
                return;
            }
          });
        return;
      case "Create":
        inquirer
          .prompt([
            {
              type: "text",
              message: "What is the name of your new character?",
              name: "name",
            },
            {
              type: listType,
              name: "race",
              message: "What race is your new character",
              choices: ["Dwarf", "Elf", "Dragonborn", "Human", "Orc"],
            },
            {
              type: listType,
              name: "cClass",
              message: "What class is your new character?",
              choices: [
                "Accountant",
                "Bard",
                "Druid",
                "Fighter",
                "Rouge",
                "Sorcerer",
              ],
            },
          ])
          .then(({ name, race, cClass }) => {
            this.socketService.requestBuilders.character.create({
              name,
              race,
              characterClass: cClass,
            });
            this.currentPage = { type: "Menu" };
            this.render();
          });
        return;
      case "Play":
        // If we're in a campaign we render that view, otherwise we show a list of your campaigns
        if (this.currentPage.type === "Play" && this.currentPage.gameID) {
        } else
          inquirer
            .prompt([
              {
                type: listType,
                message: "What game do you want to join?",
                name: "choice",
                choices: [
                  ...(this.gameState?.joinedCampaigns.map((j) => ({
                    name: j.name,
                    value: j.ID,
                  })) ?? []),
                  { type: "separator", name: "space" },
                  { type: listType, name: "Back", value: "Back" },
                ],
              },
            ])
            .then(({ choice }) => {
              if (choice === "Back") {
                this.currentPage = { type: "Menu" };
                this.render();
              }
            });
        return;
    }
  }
}

const game = new Game();
game.render();
