package client.entity.ship;

import client.entity.ship.ShipCannon.CannonParams;
import game.engine.base.BaseTypesAndClasses;

class ShipCannonsConfig {
	// Mid
	public static final RightCannonParamsByDirMid:Map<GameEntityDirection, CannonParams> = [
		GameEntityDirection.EAST => {
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
		GameEntityDirection.NORTH_EAST => {
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
		GameEntityDirection.NORTH => {
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
		GameEntityDirection.NORTH_WEST => {
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
		GameEntityDirection.WEST => {
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
		GameEntityDirection.SOUTH_WEST => {
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
		GameEntityDirection.SOUTH => {
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
		GameEntityDirection.SOUTH_EAST => {
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
		GameEntityDirection.EAST => {
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
		GameEntityDirection.NORTH_EAST => {
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
		GameEntityDirection.NORTH => {
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
		GameEntityDirection.NORTH_WEST => {
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
		GameEntityDirection.WEST => {
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
		GameEntityDirection.SOUTH_WEST => {
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
		GameEntityDirection.SOUTH => {
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
		GameEntityDirection.SOUTH_EAST => {
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
		GameEntityDirection.EAST => {
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
		GameEntityDirection.NORTH_EAST => {
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
		GameEntityDirection.NORTH => {
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
		GameEntityDirection.NORTH_WEST => {
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
		GameEntityDirection.WEST => {
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
		GameEntityDirection.SOUTH_WEST => {
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
		GameEntityDirection.SOUTH => {
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
		GameEntityDirection.SOUTH_EAST => {
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
		GameEntityDirection.EAST => {
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
		GameEntityDirection.NORTH_EAST => {
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
		GameEntityDirection.NORTH => {
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
		GameEntityDirection.NORTH_WEST => {
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
		GameEntityDirection.WEST => {
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
		GameEntityDirection.SOUTH_WEST => {
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
		GameEntityDirection.SOUTH => {
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
		GameEntityDirection.SOUTH_EAST => {
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
