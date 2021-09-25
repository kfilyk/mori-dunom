export interface Serializable<T> {
  serialize(): T;
  deserialize(serialized: T): void;
}
