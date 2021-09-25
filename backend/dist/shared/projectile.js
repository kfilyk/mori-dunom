"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectileFromSerialized = void 0;
const vector_1 = __importDefault(require("./vector"));
function projectileFromSerialized(s) {
    const position = new vector_1.default(s.position.x, s.position.y);
    const p = new Projectile(s.velocity, position, s.direction, s.damage, s.shooterID);
    return p;
}
exports.projectileFromSerialized = projectileFromSerialized;
class Projectile {
    constructor(velocity, position, direction, damage, shooterID) {
        this.velocity = velocity;
        this.position = position;
        this.direction = direction;
        this.damage = damage;
        this.shooterID = shooterID;
    }
    serialize() {
        return {
            position: this.position.serialize(),
            direction: this.direction,
            damage: this.damage,
            velocity: this.velocity,
            shooterID: this.shooterID,
        };
    }
    deserialize(s) {
        this.position.deserialize(s.position);
    }
}
exports.default = Projectile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NoYXJlZC9wcm9qZWN0aWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUErQztBQVcvQyxTQUFnQix3QkFBd0IsQ0FBQyxDQUFrQjtJQUN6RCxNQUFNLFFBQVEsR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FDdEIsQ0FBQyxDQUFDLFFBQVEsRUFDVixRQUFRLEVBQ1IsQ0FBQyxDQUFDLFNBQVMsRUFDWCxDQUFDLENBQUMsTUFBTSxFQUNSLENBQUMsQ0FBQyxTQUFTLENBQ1osQ0FBQztJQUNGLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQVZELDREQVVDO0FBRUQsTUFBcUIsVUFBVTtJQU83QixZQUNFLFFBQWdCLEVBQ2hCLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLE1BQWMsRUFDZCxTQUFpQjtRQUVqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRU0sU0FBUztRQUNkLE9BQU87WUFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDbkMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzFCLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVyxDQUFDLENBQWtCO1FBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUFsQ0QsNkJBa0NDIn0=