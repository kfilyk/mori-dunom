import { Server, MessageType, EventType } from "../../shared/rpc";
import Arena from "../../shared/arena";
import Player from "../../shared/player";

import { v4 as uuidv4 } from "uuid";

const PORT = 4334;
const PLAYERS_PER_ARENA = 6;

type Game = {
  num_players: number;
  arena: Arena;
};

function main() {
  const server = new Server(PORT);
  const games: { [key: string]: Game } = {};
  const clients: {
    [key: string]: {
      name: string;
      gameID?: string;
    };
  } = {};

  server.registerHandler(MessageType.Ping, () => {
    return "pong";
  });

  server.registerHandler(MessageType.RegisterClient, ({ name }) => {
    const clientUUID = uuidv4();

    clients[clientUUID] = {
      name,
    };
    return { error: null, clientUUID };
  });

  server.registerHandler(MessageType.CloseClient, ({ UUID }) => {
    const client = clients[UUID];
    if (client === undefined) {
      return { error: "Client isn't registered", gameUUID: null };
    }

    console.log(`Removing client "${client.name}" from game ${client.gameID}`);
    const und = client.gameID != null ?
    console.log(games[client.gameID].arena.players): null;
    if(client.gameID != undefined){
      // @ts-ignore
      games[client.gameID].arena.removePlayer(UUID); 
      console.log(`Called arena.removePlayer(UUID) successfully.`);
      server.sendEvent(EventType.GameUpdated, {
        state: JSON.stringify(games[client.gameID].arena.serialize()),
      });
      delete(clients[UUID]);
    }
    return { error: null };
  });

  server.registerHandler(MessageType.FindLobby, ({ clientUUID }) => {
    const client = clients[clientUUID];
    if (client === undefined) {
      return { error: "Client isn't registered", gameUUID: null };
    }

    const name = client.name;
    const newPlayer = new Player(name, clientUUID);

    for (const [gameUUID, game] of Object.entries(games)) {
      if (game.num_players < PLAYERS_PER_ARENA) {
        game.num_players += 1;
        games[gameUUID].arena.addPlayer(newPlayer);
        client.gameID = gameUUID;
        console.log(`Adding client "${name}" to game ${gameUUID}`);
        return { gameUUID, error: null };
      }
    }

    const newGameUUID = uuidv4();
    games[newGameUUID] = {
      num_players: 1,
      arena: new Arena(),
    };

    games[newGameUUID].arena.addPlayer(newPlayer);
    client.gameID = newGameUUID;
    console.log(`Adding client "${name}" to game ${newGameUUID}`);
    return { gameUUID: newGameUUID, error: null };
  });

  server.registerHandler(
    MessageType.ClientUpdate,
    ({ inputState, clientUUID }) => {
      const client = clients[clientUUID];
      if (client === undefined || client.gameID === undefined) {
        return;
      }

      games[client.gameID].arena.update(JSON.parse(inputState));
      server.sendEvent(EventType.GameUpdated, {
        state: JSON.stringify(games[client.gameID].arena.serialize()),
      });
    }
  );

  server.registerHandler(
    MessageType.ProjectileSpawn,
    ({ x, y, angle, id, clientUUID }) => {
      const client = clients[clientUUID];
      if (client === undefined || client.gameID === undefined) {
        return;
      }

      games[client.gameID].arena.addProjectile([x, y], angle, id, clientUUID);
      server.sendEvent(EventType.GameUpdated, {
        state: JSON.stringify(games[client.gameID].arena.serialize()),
      });
    }
  );

  server.registerHandler(
    MessageType.ProjectileHit,
    ({ clientUUID, projectileID }) => {
      const client = clients[clientUUID];
      if (client === undefined || client.gameID === undefined) {
        return;
      }

      games[client.gameID].arena.deleteProjectile(projectileID);
      games[client.gameID].arena.projectileHitPlayer(clientUUID);
      server.sendEvent(EventType.GameUpdated, {
        state: JSON.stringify(games[client.gameID].arena.serialize()),
      });
    }
  );

  console.log(`Server listening on port ${PORT}`);
}

main();
