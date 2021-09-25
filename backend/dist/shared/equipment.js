"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentFromSerialized = void 0;
function equipmentFromSerialized(s) {
    const e = new Equipment(s.name, s.type);
    return e;
}
exports.equipmentFromSerialized = equipmentFromSerialized;
class Equipment {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    serialize() {
        return {
            name: this.name,
            type: this.type,
        };
    }
    deserialize(s) {
        this.name = s.name;
        this.type = s.type;
    }
}
exports.default = Equipment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2hhcmVkL2VxdWlwbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxTQUFnQix1QkFBdUIsQ0FBQyxDQUFpQjtJQUN2RCxNQUFNLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFIRCwwREFHQztBQUVELE1BQXFCLFNBQVM7SUFJNUIsWUFBWSxJQUFZLEVBQUUsSUFBbUI7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVyxDQUFDLENBQWlCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztDQUNGO0FBcEJELDRCQW9CQyJ9