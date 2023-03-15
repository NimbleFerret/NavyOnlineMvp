import { BaseGameObject } from "./entity.base";

export interface CharacterObjectEntity extends BaseGameObject {
}

export class CharacterEntity {

    public static GetFreeCharacterStats(id: string, ownerId: string) {
        const captain: CharacterObjectEntity = {
            x: 350,
            y: 290,
            id,
            ownerId,
            acceleration: 150,
            minSpeed: 0,
            maxSpeed: 150,
            currentSpeed: 0,
            movementDelay: 0.100,
        };
        return captain;
    }

}