"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tile_1 = require("./tile");
const vector_1 = __importDefault(require("./vector"));
const player_1 = require("./player");
const projectile_1 = __importStar(require("./projectile"));
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
class Arena {
    constructor() {
        this.tiles = [];
        this.players = [];
        this.projectiles = {};
        this.living_players = 0;
        this.dead_players = 0;
        const ground_level = new Array(MAP_HEIGHT);
        const dunes = [
            [5, 6, 7, 8],
            [18, 19, 20, 21],
            [31, 32, 33, 34],
            [44, 45, 46, 47, 48],
            [12],
            [25],
            [38],
            [29],
            [30],
            [48, 49],
            [60, 61],
            [72, 73, 74],
        ];
        // Create ground layer
        for (let i = 0; i < ground_level.length; i++) {
            ground_level[i] = new Array(MAP_WIDTH);
            for (let j = 0; j < MAP_WIDTH;) {
                // pick dune from tile sheet
                let dune = Math.floor(Math.random() * dunes.length);
                if (dune == 0 ||
                    dune == 1 ||
                    dune == 2 ||
                    dune == 3 ||
                    dune == 9 ||
                    dune == 10 ||
                    dune == 11) {
                    dune = Math.floor(Math.random() * dunes.length);
                }
                if (dune == 0 ||
                    dune == 1 ||
                    dune == 2 ||
                    dune == 3 ||
                    dune == 9 ||
                    dune == 10 ||
                    dune == 11) {
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
    update(state) {
        this.players.forEach((player) => player.update(state));
    }
    serialize() {
        const projectiles = {};
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
    addProjectile([x, y], angle, id, shooterID) {
        this.projectiles[id] = new projectile_1.default(200, new vector_1.default(x, y), angle, 1, shooterID);
    }
    deleteProjectile(id) {
        if (this.projectiles[id]) {
            delete this.projectiles[id];
        }
    }
    projectileHitPlayer(playerId) {
        const player = this.players.find((p) => p.uuid === playerId);
        if (player) {
            // FIXME death check
            player.health -= 1;
        }
    }
    deserialize(s) {
        this.tiles = s.tiles.map((r) => tile_1.tileFromSerialized(r));
        this.players = s.players.map((r) => player_1.playerFromSerialized(r));
        const newProjectiles = {};
        Object.keys(s.projectiles).map((k) => {
            newProjectiles[k] = projectile_1.projectileFromSerialized(s.projectiles[k]);
        });
        this.projectiles = newProjectiles;
        this.living_players = s.living_players;
        this.dead_players = s.dead_players;
    }
    addPlayer(player) {
        if (this.players.some((p) => p.uuid === player.uuid)) {
            return;
        }
        this.living_players++;
        this.players.push(player);
    }
    removePlayer(player) {
        console.log("PLAYER: " + player);
        let i = this.players.findIndex(p => p.uuid === player); // this isnt working!
        console.log("FOUND INDEX: " + i);
        this.players.splice(i, 1);
        console.log(this.players);
        this.living_players--;
        this.dead_players++;
    }
}
exports.default = Arena;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlbmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zaGFyZWQvYXJlbmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQWtEO0FBRWxELHNEQUErQztBQUMvQyxxQ0FBcUU7QUFDckUsMkRBR3NCO0FBS3RCLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNyQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFVdEIsTUFBcUIsS0FBSztJQXVGeEI7UUF0RkEsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLGdCQUFXLEdBQWtDLEVBQUUsQ0FBQztRQXFGOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0MsTUFBTSxLQUFLLEdBQUc7WUFDWixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNaLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ2hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ2hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNwQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVB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