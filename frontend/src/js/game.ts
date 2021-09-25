declare let PORT: number;
declare let HOSTNAME: number;

import Player from "../../../shared/player";
import Arena from "../../../shared/arena";
import { Client, MessageType, EventType } from "../../../shared/rpc";
import * as Phaser from "phaser";
import ReconnectingWS from "reconnecting-websocket";
import { InputState } from "../../../shared/updatable";

import { v4 as uuidv4 } from "uuid";

const equipmentTypes = ["beer", "sniper"];
const playerColours = ["blue", "red", "yellow", "green"];

const ws = new ReconnectingWS(`ws://${HOSTNAME}:${PORT}`);
const client = new Client(ws);
let UUID: string;
let name: string;
var live_player_text;
var dead_player_text;
var winning_text;


const failedRPC = (msg: string) => {
  return (err: Error) => {
    console.error(`Failed to make ${msg} RPC call`);
    console.error(err);
  };
};

ws.addEventListener("open", () => {
  console.log("connected");
  const namePrompt = prompt("Enter your name");
  if (namePrompt !== null) {
    name = namePrompt;
    client
      .call(MessageType.RegisterClient, { name })
      .then(({ error, clientUUID }) => {
        if (error !== null || clientUUID === null) {
          alert("Failed to register client");
          console.error(error);
        } else {
          UUID = clientUUID;
          new Phaser.Game(config);
        }
      })
      .catch((e) => {
        alert("Failed to register client");
        console.error(e);
      });
  } else {
    alert("You must enter a name. Reload the page to try again");
  }
});

window.addEventListener("beforeunload", function () {
  ws.onclose = function () {}; // disable onclose handler first
  client
  .call(MessageType.CloseClient, { UUID })
  .then(({ error }) => {
    if (error !== null ) {
      alert("Failed to close client: "+ error);
    } 
  })
  .catch((e) => {
    alert("Failed to close client: "+ e);
  });
});

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  // @ts-ignore -- initialized in preload function
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  // @ts-ignore -- initialized in preload function
  private arena: Arena;

  private phaser_players: {
    [key: string]: Phaser.Physics.Arcade.Sprite;
  } = {};
  private phaser_player_overlays: {
    [key: string]: Phaser.GameObjects.Image;
  } = {};
  private hearts: {
    [key: string]: Phaser.Physics.Arcade.Sprite;
  } = {};
  private projectiles: {
    [key: string]: Phaser.Physics.Arcade.Sprite | null;
  } = {};

  private prevInputState = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  private renderHearts(health: integer) {
    let a;
    if (health === 0) {
      this.hearts[0].destroy(true);
      this.hearts[1].setTexture("dead");
      this.hearts[2].destroy(true);
    } else if (health > 0) {
      for (a = 0; a < health; a++) {
        this.hearts[a].setTexture("heart");
      }
      for (a = health; a < 3; a++) {
        this.hearts[a].setTexture("empty_heart");
      }
    }
  }

  private createHearts() {
    this.physics.add.sprite(24, 10, "heart_box");

    // this.physics.add.collider(this.phaser_players[UUID], this.heartBox);
    const y = 10;
    const xPos = [9, 23, 37];
    for (let a = 0; a < 3; a++) {
      this.hearts[a] = this.physics.add.sprite(xPos[a], y, "heart");
    }
  }

private createPlayer(id: string, coords: [number, number], colour?: string) {
    const [x,y] = coords;
    this.phaser_players[id] = this.physics.add.sprite(x, y, "player_" + colour);
    this.phaser_players[id].setBounce(0.2);
    this.phaser_players[id].setCollideWorldBounds(true);
    this.phaser_players[id].depth = 1;

    this.phaser_player_overlays[id] = this.add.image(
      this.phaser_players[id].x + 4,
      this.phaser_players[id].y,
      "arm"
    );
    this.phaser_player_overlays[id].setOrigin(0.5, 0.2);
    this.phaser_player_overlays[id].depth = 0;
  }

  // angle in radians
  private spawnProjectile(
    [x, y]: [number, number],
    angle: number,
    id: string,
    shooterID: string
  ) {
    if (this.arena.players.find(p=>p.uuid===shooterID)?.health != 0) {
      const projectile = this.physics.add.sprite(x, y, "bullet");
      projectile.setCollideWorldBounds(false);
      projectile.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
      this.projectiles[id] = projectile;

      this.arena.players.forEach((p) => {
        if (p.uuid !== shooterID) {
          this.physics.add.overlap(
            this.phaser_players[p.uuid],
            projectile,
            () => {
              if (this.projectiles[id]) {
                // @ts-ignore -- typescript having a stroke
                this.projectiles[id].destroy();
                this.projectiles[id] = null;

                if (p.uuid === UUID) {
                  client
                    .call(MessageType.ProjectileHit, {
                      clientUUID: UUID,
                      projectileID: id,
                    })
                    .catch(failedRPC("ProjectileHit"));
                }
              }
            }
          );
        }
      });
    }
  }

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.bitmapFont('carrier_command', '../assets/fonts/carrier_command.png', '../assets/fonts/carrier_command.xml');
    client
      .call(MessageType.FindLobby, { clientUUID: UUID })
      .then(({ gameUUID, error }) => {
        if (error !== null) {
          alert(error);
          console.error(error);
          throw new Error(error);
        } else if (gameUUID !== null) {
          this.arena = new Arena();
          this.arena.addPlayer(new Player(name, UUID));
        }
      });

    client.addEventListener(EventType.GameUpdated, ({ state }) => {
      this.arena.deserialize(JSON.parse(state));
    });

    client.addEventListener(
      EventType.NewProjectile,
      ({ x, y, angle, id, shooterID }) => {
        if (shooterID !== UUID) {
          this.spawnProjectile([x, y], angle, id, shooterID);
        }
      }
    );

    client.addEventListener(EventType.DeleteProjectile, ({ id }) => {
      if (this.projectiles[id]) {
        // @ts-ignore -- typescript having a stroke
        this.projectiles[id].destroy();
        this.projectiles[id] = null;
      }
    });

    this.load.image("desert_tiles", "../assets/arena/desert.png");
    this.load.image("hex_tiles", "../assets/tiles/hex_tiles.png");


    //load in each colour sprite
    playerColours.forEach((col) => {
      this.load.spritesheet("player_" + col, "../assets/player/player_" + col + ".png", {
        frameWidth: 17,
        frameHeight: 27
      });
    });

    //load weapons
    this.load.image("pistol", "../assets/equipment/pistol.png");
    this.load.image("sniper", "../assets/equipment/sniper.png");

    //load equipment
    this.load.image("beer", "../assets/equipment/beer_bottle.png");

    //load UI elements
    this.load.image("heart", "../assets/player/heart_full2.png");
    this.load.image("empty_heart", "../assets/player/heart_empty2.png");
    this.load.image("dead", "../assets/player/dead.png");
    this.load.image("heart_box", "../assets/player/heart_background.png");

    //load other items
    this.load.image("arm", "../assets/player/arm.png");
    this.load.image("bullet", "../assets/projectile/bullet2.png");

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  public create() {
    const groundmap = this.make.tilemap({
      data: this.arena.ground_level,
      tileWidth: 16,
      tileHeight: 16,
    });
    const objmap = this.make.tilemap({
      data: this.arena.obj_level,
      tileWidth: 16,
      tileHeight: 16,
    });

    // create desert tiles
    const tiles = groundmap.addTilesetImage("hex_tiles");
    const tiles2 = objmap.addTilesetImage("desert_tiles");
    groundmap.createStaticLayer(0, tiles, 0, 0);
    objmap.createStaticLayer(0, tiles2, 0, 0);

    // testing equipment
    // game.time.events.add(Phaser.Timer.SECOND * 30, this.generateItem, this);

    // const bullet = this.physics.add.sprite(100, 100, "bullet");

    // const pistol = this.physics.add.sprite(100,100,"pistol");
    // const sniper = this.physics.add.sprite(150,150,"sniper");
    // const beer = this.physics.add.sprite(200,200,"beer");

    // create player
    this.createHearts();

    //create player animations
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player_blue", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player_blue", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player_blue", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player_blue", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    //create enemy animations 
    this.anims.create({
      key: "up_red",
      frames: this.anims.generateFrameNumbers("player_red", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down_red",
      frames: this.anims.generateFrameNumbers("player_red", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left_red",
      frames: this.anims.generateFrameNumbers("player_red", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right_red",
      frames: this.anims.generateFrameNumbers("player_red", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    live_player_text = this.add.bitmapText(55, 0, 'carrier_command', 'ALIVE: '+ this.arena.living_players, 8);
    dead_player_text = this.add.bitmapText(55, 10, 'carrier_command', 'DECEASED: '+ this.arena.dead_players, 8);
    winning_text = this.add.bitmapText(30, 140, 'carrier_command', "YOU WON!", 30);
    winning_text.alpha=0;

  }

  public generateItem() {
    const equipGen = equipmentTypes[Math.floor(Math.random() * Array.length)];
    this.physics.add.sprite(150, 150, equipGen);
  }

  private mouseWasDown = false;
  public update() {

    this.arena.players.forEach((p) => {
      const uuid = p.uuid;
      const [xVel, yVel] = p.velocity;
      const anim = p.anim;
      if (this.phaser_players[uuid] === undefined) {
        if(p.uuid == UUID){
          this.createPlayer(uuid, p.position, "blue");
        } else{
          this.createPlayer(uuid, p.position, "red");
        }
      }

      if (p.uuid === UUID) {
        this.renderHearts(p.health);
      }

      if (p.health === 0) {
        this.phaser_players[uuid].destroy();
        this.phaser_player_overlays[uuid].destroy();
        return;
      }

      const phaser_player = this.phaser_players[uuid];
      if (xVel === 0 && yVel === 0) {
        phaser_player.setPosition(p.position[0], p.position[1]);
      }
      phaser_player.setVelocity(xVel, yVel);
      if (anim) {
        if(p.uuid === UUID){
          phaser_player.anims.play(anim, true);
        } else{
          phaser_player.anims.play(anim + "_red", true);
        }
      } else {
        phaser_player.anims.stop();
      }

      const overlay = this.phaser_player_overlays[uuid];
      const playerX = phaser_player.x;
      const playerY = phaser_player.y;

      if (anim == "up") {
        overlay.setDepth(0);
        overlay.setPosition(playerX + 4, playerY);
      } else if (anim == "down") {
        overlay.setDepth(2);
        overlay.setPosition(playerX - 5, playerY + 2);
      } else if (anim == "left") {
        overlay.setDepth(0);
        overlay.setPosition(playerX - 2, playerY + 2);
      } else if (anim == "right") {
        overlay.setDepth(2);
        overlay.setPosition(playerX + 3, playerY + 1);
      }
    });

    const mouseIsDown = this.input.mousePointer.leftButtonDown();
    const inputState = {
      up: this.cursors.up?.isDown ?? false,
      down: this.cursors.down?.isDown ?? false,
      left: this.cursors.left?.isDown ?? false,
      right: this.cursors.right?.isDown ?? false,
      pos: <[number, number]>[
        this.phaser_players[UUID].x,
        this.phaser_players[UUID].y,
      ],
      mouse:
        mouseIsDown && !this.mouseWasDown
          ? <[number, number]>[
              this.input.mousePointer.x,
              this.input.mousePointer.y,
            ]
          : null,
    };

    this.mouseWasDown = mouseIsDown;

    const updateState: InputState = {
      [UUID]: inputState,
    };

    if (
      this.prevInputState.up !== inputState.up ||
      this.prevInputState.down !== inputState.down ||
      this.prevInputState.left !== inputState.left ||
      this.prevInputState.right !== inputState.right ||
      (mouseIsDown && !this.mouseWasDown)
    ) {
      /*
      client
        .call(MessageType.ClientUpdate, {
          inputState: JSON.stringify({ ...updateState }),
          clientUUID: UUID,
        })
        .catch((e) => {
          console.error(e);
        });
        */
    }

    // Set the player arm rotation
    const angleToPointer = Phaser.Math.Angle.Between(
      this.phaser_players[UUID].x,
      this.phaser_players[UUID].y,
      this.game.input.mousePointer.x,
      this.game.input.mousePointer.y
    );
    this.phaser_player_overlays[UUID].rotation = angleToPointer - Math.PI / 2;

    if (inputState.mouse !== null) {
      const x = this.phaser_players[UUID].x;
      const y = this.phaser_players[UUID].y;
      const id = uuidv4();
      this.spawnProjectile([x, y], angleToPointer, id, UUID);
      client
        .call(MessageType.ProjectileSpawn, {
          x,
          y,
          angle: angleToPointer,
          id,
          clientUUID: UUID,
        })
        .catch(failedRPC("ProjectileSpawn"));
    }

    this.arena.update(updateState);
    this.prevInputState = inputState;
    Object.entries(this.arena.projectiles).forEach(([id, proj]) => {
      if (this.projectiles[id] === undefined) {
        this.spawnProjectile(
          [proj.position.x, proj.position.y],
          proj.direction,
          id,
          proj.shooterID
        );
      }
    });
    client
    .call(MessageType.ClientUpdate, {
      inputState: JSON.stringify({ ...updateState }),
      clientUUID: UUID,
    })
    .catch((e) => {
      console.error(e);
    });
    live_player_text.text = 'ALIVE: '+ this.arena.living_players;
    dead_player_text.text = 'DECEASED: '+ this.arena.dead_players;
    if(this.arena.living_players==1 && this.arena.dead_players>0) {
      winning_text.alpha = 1;
    } else {
      winning_text.alpha = 0;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "desert-showdown",

  scale: {
    parent: "desert-showdown",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 320,
    height: 320,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  pixelArt: true,
  scene: GameScene,
};
