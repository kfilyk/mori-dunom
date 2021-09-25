import Tile, { tileFromSerialized } from "./tile";
import { TileState } from "./tile";
import Vector, { VectorState } from "./vector";
import Player, { PlayerState, playerFromSerialized } from "./player";
import Projectile, {
  ProjectileState,
  projectileFromSerialized,
} from "./projectile";
import { Updatable, InputState } from "./updatable";
import { Serializable } from "./serialize";
import Equipment from "./equipment";

const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

export type GameState = {
  tiles: TileState[];
  players: PlayerState[];
  projectiles: { [key: string]: ProjectileState };
  living_players: number;
  dead_players: number;
};

export default class Arena implements Serializable<GameState> {
  tiles: Tile[] = [];
  players: Player[] = [];
  projectiles: { [key: string]: Projectile } = {};
  living_players: number;
  dead_players: number;

  public readonly ground_level: number[][];
  public readonly obj_level: number[][];

  public update(state: InputState) {
    this.players.forEach((player) => player.update(state));
  }

  public serialize(): GameState {
    const projectiles: { [key: string]: ProjectileState } = {};
    Object.keys(this.projectiles).map((k) => {
      projectiles[k] = this.projectiles[k].serialize();
    });

    return {
      tiles: this.tiles.map((t) => t.serialize()),
      players: this.players.map((p) => p.serialize()),
      projectiles: projectiles,
      living_players: this.living_players,
      dead_players: this.dead_players
    };
  }

  public addProjectile(
    [x, y]: [number, number],
    angle: number,
    id: string,
    shooterID: string
  ) {
    this.projectiles[id] = new Projectile(
      200,
      new Vector(x, y),
      angle,
      1,
      shooterID
    );
  }

  public deleteProjectile(id: string) {
    if (this.projectiles[id]) {
      delete this.projectiles[id];
    }
  }

  public projectileHitPlayer(playerId: string) {
    const player = this.players.find((p) => p.uuid === playerId);
    if (player) {
      // FIXME death check
      player.health -= 1;
    }
  }

  public deserialize(s: GameState) {
    this.tiles = s.tiles.map((r) => tileFromSerialized(r));
    this.players = s.players.map((r) => playerFromSerialized(r));
    const newProjectiles: { [key: string]: Projectile } = {};
    Object.keys(s.projectiles).map((k) => {
      newProjectiles[k] = projectileFromSerialized(s.projectiles[k]);
    });
    this.projectiles = newProjectiles;
    this.living_players = s.living_players;
    this.dead_players = s.dead_players;
  }

  public addPlayer(player: Player) {
    if (this.players.some((p) => p.uuid === player.uuid)) {
      return;
    }
    this.living_players++;
    this.players.push(player);
  }
  public removePlayer(player: string) {
    console.log("PLAYER: "+player);
    let i = this.players.findIndex(p => p.uuid === player); // this isnt working!
    console.log("FOUND INDEX: "+ i);
    this.players.splice(i, 1);
    console.log(this.players);
    this.living_players--;
    this.dead_players++;
  }

  constructor() {
    this.living_players = 0;
    this.dead_players = 0;
    const ground_level = new Array(MAP_HEIGHT);
    const dunes = [
      [5, 6, 7, 8],
      [18, 19, 20, 21],
      [31, 32, 33, 34],
      [44, 45, 46, 47, 48],
      [12], // empty desert
      [25],
      [38],
      [29],
      [30],
      [48, 49], // tiny cactus:
      [60, 61], // rocks
      [72, 73, 74], // cactus
    ];

    // Create ground layer
    for (let i = 0; i < ground_level.length; i++) {
      ground_level[i] = new Array(MAP_WIDTH);
      for (let j = 0; j < MAP_WIDTH; ) {
        // pick dune from tile sheet
        let dune = Math.floor(Math.random() * dunes.length);
        if (
          dune == 0 ||
          dune == 1 ||
          dune == 2 ||
          dune == 3 ||
          dune == 9 ||
          dune == 10 ||
          dune == 11
        ) {
          dune = Math.floor(Math.random() * dunes.length);
        }
        if (
          dune == 0 ||
          dune == 1 ||
          dune == 2 ||
          dune == 3 ||
          dune == 9 ||
          dune == 10 ||
          dune == 11
        ) {
          dune = Math.floor(Math.random() * dunes.length);
        }
        if (dune == 9 || dune == 10 || dune == 11) {
          dune = Math.floor(Math.random() * dunes.length);
        }
        for (let k = 0; k < dunes[dune].length; k++) {
          // index between 5 and 9 a desert tile from tilesheet
          ground_level[i][j] = dunes[dune][k];
          j++;
          if (j == MAP_WIDTH) {
            break;
          }
        }
      }
    }
    // Create object layer
    const obj_level = new Array(MAP_HEIGHT);
    for (let i = 0; i < obj_level.length; i++) {
      obj_level[i] = new Array(MAP_WIDTH);
      for (let j = 0; j < MAP_WIDTH; j++) {
        // objects
      
      }
    }

    this.obj_level = obj_level;
    this.ground_level = ground_level;
  }
}
