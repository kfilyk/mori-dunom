export type InputState = {
  [key: string]: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    pos: [number, number];
    mouse: [number, number] | null;
  };
};

export abstract class Updatable<T> {
  public abstract update(state: InputState): T;
}
