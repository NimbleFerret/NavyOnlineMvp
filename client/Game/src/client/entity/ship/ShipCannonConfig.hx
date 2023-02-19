package client.entity.ship;

import client.entity.ship.ShipCannon.CannonParams;
import engine.entity.EngineBaseGameEntity.GameEntityDirection;

class ShipCannonsConfig {
	// Mid
	public static final RightCannonParamsByDirMid:Map<GameEntityDirection, CannonParams> = [
		GameEntityDirection.East => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 8,
			c_x: 0,
			c_y: 13,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 7,
			c_y: 5,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.North => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.West => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 0,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.South => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -9,
			c_y: 4,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		}
	];

	public static final LeftCannonParamsByDirMid:Map<GameEntityDirection, CannonParams> = [
		GameEntityDirection.East => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 8,
			c_x: 0,
			c_y: -2,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.North => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -7,
			c_y: 4,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.West => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 8,
			c_x: 0,
			c_y: 13,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 7,
			c_y: 5,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.South => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		}
	];

	// Sm
	public static final RightCannonParamsByDirSm:Map<GameEntityDirection, CannonParams> = [
		GameEntityDirection.East => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 8,
			c_x: 0,
			c_y: 13,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 7,
			c_y: 5,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.North => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.West => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 0,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.South => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -9,
			c_y: 4,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		}
	];

	public static final LeftCannonParamsByDirSm:Map<GameEntityDirection, CannonParams> = [
		GameEntityDirection.East => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 8,
			c_x: 0,
			c_y: -2,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.North => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.NorthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -7,
			c_y: 4,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.West => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 8,
			c_x: 0,
			c_y: 13,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthWest => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 7,
			c_y: 5,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.South => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: 4,
			c_y: 0,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		},
		GameEntityDirection.SouthEast => {
			w_t_x: 0,
			w_t_y: 0,
			w_b_x: 0,
			w_b_y: 0,
			c_x: -3,
			c_y: 1,
			w_t_t: null,
			w_b_t: null,
			c_t: null
		}
	];
}
