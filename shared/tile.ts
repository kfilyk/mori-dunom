import Equipment, { equipmentFromSerialized } from "./equipment";
import { EquipmentState } from "./equipment";
import { Serializable } from "./serialize";

export type TileState = {
  equipment: EquipmentState[];
  texture: string;
};

export function tileFromSerialized(s: TileState): Tile {
  const t = new Tile(s.texture);
  t.deserialize(s);
  return t;
}

export default class Tile implements Serializable<TileState> {
  private _texture: string;
  private equipment: Equipment[] = [];

  constructor(texture: string) {
    this._texture = texture;
  }

  public serialize(): TileState {
    return {
      equipment: this.equipment.map((e) => e.serialize()),
      texture: this._texture,
    };
  }

  public deserialize(s: TileState): void {
    this.equipment = s.equipment.map((r) => equipmentFromSerialized(r));
  }

  get texture() {
    return this._texture;
  }

  set texture(texture: string) {
    this._texture = texture;
  }

  public addEquipment(equipment: Equipment) {
    this.equipment.push(equipment);
  }
}
