import { Serializable } from "./serialize";
export type VectorState = {
  x: number;
  y: number;
};

export default class Vector implements Serializable<VectorState> {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public serialize(): VectorState {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public deserialize(s: VectorState): void {
    this.x = s.x;
    this.y = s.y;
  }

  public normalize(): Vector {
    const mag = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector(this.x / mag, this.y / mag);
  }
}
