import Vector, { VectorState } from "./vector";
import { Serializable } from "./serialize";

export type ProjectileState = {
  position: VectorState;
  direction: number;
  damage: number;
  velocity: number;
  shooterID: string;
};

export function projectileFromSerialized(s: ProjectileState): Projectile {
  const position = new Vector(s.position.x, s.position.y);
  const p = new Projectile(
    s.velocity,
    position,
    s.direction,
    s.damage,
    s.shooterID
  );
  return p;
}

export default class Projectile implements Serializable<ProjectileState> {
  readonly position: Vector;
  readonly direction: number;
  readonly damage: number;
  readonly velocity: number;
  readonly shooterID: string;

  constructor(
    velocity: number,
    position: Vector,
    direction: number,
    damage: number,
    shooterID: string
  ) {
    this.velocity = velocity;
    this.position = position;
    this.direction = direction;
    this.damage = damage;
    this.shooterID = shooterID;
  }

  public serialize(): ProjectileState {
    return {
      position: this.position.serialize(),
      direction: this.direction,
      damage: this.damage,
      velocity: this.velocity,
      shooterID: this.shooterID,
    };
  }

  public deserialize(s: ProjectileState): void {
    this.position.deserialize(s.position);
  }
}
