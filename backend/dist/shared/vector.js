"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    serialize() {
        return {
            x: this.x,
            y: this.y,
        };
    }
    deserialize(s) {
        this.x = s.x;
        this.y = s.y;
    }
    normalize() {
        const mag = Math.sqrt(this.x * this.x + this.y * this.y);
        return new Vector(this.x / mag, this.y / mag);
    }
}
exports.default = Vector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2hhcmVkL3ZlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLE1BQXFCLE1BQU07SUFJekIsWUFBWSxDQUFTLEVBQUUsQ0FBUztRQUM5QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1YsQ0FBQztJQUNKLENBQUM7SUFFTSxXQUFXLENBQUMsQ0FBYztRQUMvQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRU0sU0FBUztRQUNkLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUF6QkQseUJBeUJDIn0=