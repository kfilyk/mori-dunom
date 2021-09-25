import {
  Server as BaseServer,
  Client as BaseClient,
  MessageVariant,
  EventVariant,
} from "@lcdev/ws-rpc";

export enum MessageType {
  Ping = "Ping",
  FindLobby = "FindLobby",
  RegisterClient = "RegisterClient",
  CloseClient = "CloseClient",
  ClientUpdate = "ClientUpdate",
  ProjectileSpawn = "ProjectileSpawn",
  ProjectileHit = "ProjectileHit",
}

export enum EventType {
  GameUpdated = "GameUpdated",
  NewProjectile = "NewProjectile",
  DeleteProjectile = "DeleteProjectile",
}

export type Messages = {
  [MessageType.Ping]: MessageVariant<MessageType.Ping, void, "pong">;
  [MessageType.FindLobby]: MessageVariant<
    MessageType.FindLobby,
    { clientUUID: string },
    { gameUUID: string | null; error: string | null }
  >;
  [MessageType.RegisterClient]: MessageVariant<
    MessageType.RegisterClient,
    { name: string },
    { error: string | null; clientUUID: string | null }
  >;
  [MessageType.CloseClient]: MessageVariant< // closes client
    MessageType.CloseClient,
    { UUID: string },
    { error: string | null;}
  >;
  [MessageType.ClientUpdate]: MessageVariant<
    MessageType.ClientUpdate,
    { inputState: string; clientUUID: string },
    void
  >;
  [MessageType.ProjectileSpawn]: MessageVariant<
    MessageType.ProjectileSpawn,
    { x: number; y: number; angle: number; id: string; clientUUID: string },
    void
  >;
  [MessageType.ProjectileHit]: MessageVariant<
    MessageType.ProjectileHit,
    { clientUUID: string; projectileID: string },
    void
  >;
};

export type Events = {
  [EventType.GameUpdated]: EventVariant<
    EventType.GameUpdated,
    { state: string }
  >;
  [EventType.NewProjectile]: EventVariant<
    EventType.NewProjectile,
    { x: number; y: number; angle: number; id: string; shooterID: string }
  >;
  [EventType.DeleteProjectile]: EventVariant<
    EventType.DeleteProjectile,
    { id: string }
  >;
};

export class Client extends BaseClient<
  MessageType,
  EventType,
  Messages,
  Events
> {}
export class Server extends BaseServer<
  MessageType,
  EventType,
  Messages,
  Events
> {}
