import { Serializable } from "./serialize";
type EquipmentType = "weapon" | "food";

export type EquipmentState = {
  name: string;
  type: EquipmentType;
};

export function equipmentFromSerialized(s: EquipmentState): Equipment {
  const e = new Equipment(s.name, s.type);
  return e;
}

export default class Equipment implements Serializable<EquipmentState> {
  private name: string;
  private type: EquipmentType;

  constructor(name: string, type: EquipmentType) {
    this.name = name;
    this.type = type;
  }

  public serialize(): EquipmentState {
    return {
      name: this.name,
      type: this.type,
    };
  }

  public deserialize(s: EquipmentState) {
    this.name = s.name;
    this.type = s.type;
  }
}
