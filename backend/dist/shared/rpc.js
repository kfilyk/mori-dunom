"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.Client = exports.EventType = exports.MessageType = void 0;
const ws_rpc_1 = require("@lcdev/ws-rpc");
var MessageType;
(function (MessageType) {
    MessageType["Ping"] = "Ping";
    MessageType["FindLobby"] = "FindLobby";
    MessageType["RegisterClient"] = "RegisterClient";
    MessageType["CloseClient"] = "CloseClient";
    MessageType["ClientUpdate"] = "ClientUpdate";
    MessageType["ProjectileSpawn"] = "ProjectileSpawn";
    MessageType["ProjectileHit"] = "ProjectileHit";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var EventType;
(function (EventType) {
    EventType["GameUpdated"] = "GameUpdated";
    EventType["NewProjectile"] = "NewProjectile";
    EventType["DeleteProjectile"] = "DeleteProjectile";
})(EventType = exports.EventType || (exports.EventType = {}));
class Client extends ws_rpc_1.Client {
}
exports.Client = Client;
class Server extends ws_rpc_1.Server {
}
exports.Server = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2hhcmVkL3JwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FLdUI7QUFFdkIsSUFBWSxXQVFYO0FBUkQsV0FBWSxXQUFXO0lBQ3JCLDRCQUFhLENBQUE7SUFDYixzQ0FBdUIsQ0FBQTtJQUN2QixnREFBaUMsQ0FBQTtJQUNqQywwQ0FBMkIsQ0FBQTtJQUMzQiw0Q0FBNkIsQ0FBQTtJQUM3QixrREFBbUMsQ0FBQTtJQUNuQyw4Q0FBK0IsQ0FBQTtBQUNqQyxDQUFDLEVBUlcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFRdEI7QUFFRCxJQUFZLFNBSVg7QUFKRCxXQUFZLFNBQVM7SUFDbkIsd0NBQTJCLENBQUE7SUFDM0IsNENBQStCLENBQUE7SUFDL0Isa0RBQXFDLENBQUE7QUFDdkMsQ0FBQyxFQUpXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBSXBCO0FBbURELE1BQWEsTUFBTyxTQUFRLGVBSzNCO0NBQUc7QUFMSix3QkFLSTtBQUNKLE1BQWEsTUFBTyxTQUFRLGVBSzNCO0NBQUc7QUFMSix3QkFLSSJ9