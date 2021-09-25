import { Updatable, InputState } from "./updatable";
import Equipment, { equipmentFromSerialized } from "./equipment";
import { EquipmentState } from "./equipment";
import { Serializable } from "./serialize";

const MAX_EQUIPMENT = 3;
const STARTING_HEALTH = 3;
const PLAYER_SPEED = 60;

type Anim = "up" | "down" | "left" | "right";
type NumberPair = [number, number];

export type PlayerState = {
  name: string;
  uuid: string;
  health: number;
  weapon: string | undefined;
  equipment: EquipmentState[];
  velocity: NumberPair;
  position: NumberPair;
  anim?: Anim;
};

export function playerFromSerialized(s: PlayerState): Player {
  const p = new Player(s.name, s.uuid);
  p.deserialize(s);
  return p;
}

export default class Player implements Serializable<PlayerState> {
  public readonly uuid: string;
  readonly name: string;

  health: number = STARTING_HEALTH;
  weapon: string | undefined;
  equipment: Equipment[] = [];
  velocity: NumberPair = [0, 0];
  position: NumberPair = [0, 0];
  anim?: Anim;

  public update(state: InputState) {
    if (state[this.uuid] === undefined) return;

    const { up, down, left, right, pos } = state[this.uuid];
    // Set X velocity
    if (left) {
      this.velocity[0] = -PLAYER_SPEED;
    } else if (right) {
      this.velocity[0] = PLAYER_SPEED;
    } else {
      this.velocity[0] = 0;
    }

    // Set Y velocity
    if (up) {
      this.velocity[1] = -PLAYER_SPEED;
    } else if (down) {
      this.velocity[1] = PLAYER_SPEED;
    } else {
      this.velocity[1] = 0;
    }

    if (this.velocity[0] === 0 && this.velocity[1] === 0) {
      this.position[0] = pos[0];
      this.position[1] = pos[1];
    }

    this.anim = undefined;
    Object.entries(state[this.uuid]).forEach(([dir, pressed]) => {
      if (pressed === true) {
        // @ts-ignore
        this.anim = dir;
      }
    });
  }

  constructor(name: string, uuid: string) {
    this.uuid = uuid;
    this.name = name;
    this.position = [Math.random()*320, Math.random()*320];
  }

  public serialize(): PlayerState {
    return {
      name: this.name,
      uuid: this.uuid,
      health: this.health,
      weapon: this.weapon,
      equipment: this.equipment.map((e) => e.serialize()),
      velocity: [...this.velocity],
      position: [...this.position],
      anim: this.anim,
    };
  }

  public deserialize(s: PlayerState) {
    this.health = s.health;
    this.weapon = s.weapon;
    this.equipment = s.equipment.map((r) => equipmentFromSerialized(r));
    this.velocity = [...s.velocity];
    this.position = [...s.position];
    this.anim = s.anim;
  }

  public setPos(x: number, y: number) {
    this.position = [x, y];
  }

  public addHealth(amount: number) {
    this.health += amount;
  }

  public subtractHealth(amount: number) {
    this.health -= amount;
  }

  public pickupEquipment(equipment: Equipment) {
    if (this.equipment.length < MAX_EQUIPMENT) {
      this.equipment.push(equipment);
    }
  }
}
