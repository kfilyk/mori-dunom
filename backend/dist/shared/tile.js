"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileFromSerialized = void 0;
const equipment_1 = require("./equipment");
function tileFromSerialized(s) {
    const t = new Tile(s.texture);
    t.deserialize(s);
    return t;
}
exports.tileFromSerialized = tileFromSerialized;
class Tile {
    constructor(texture) {
        this.equipment = [];
        this._texture = texture;
    }
    serialize() {
        return {
            equipment: this.equipment.map((e) => e.serialize()),
            texture: this._texture,
        };
    }
    deserialize(s) {
        this.equipment = s.equipment.map((r) => equipment_1.equipmentFromSerialized(r));
    }
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        this._texture = texture;
    }
    addEquipment(equipment) {
        this.equipment.push(equipment);
    }
}
exports.default = Tile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NoYXJlZC90aWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFpRTtBQVNqRSxTQUFnQixrQkFBa0IsQ0FBQyxDQUFZO0lBQzdDLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUpELGdEQUlDO0FBRUQsTUFBcUIsSUFBSTtJQUl2QixZQUFZLE9BQWU7UUFGbkIsY0FBUyxHQUFnQixFQUFFLENBQUM7UUFHbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkQsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3ZCLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVyxDQUFDLENBQVk7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsbUNBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxPQUFlO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFFTSxZQUFZLENBQUMsU0FBb0I7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNGO0FBOUJELHVCQThCQyJ9