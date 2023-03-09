package client.entity.ship;

import h2d.col.Point;
import client.entity.ship.ShipCannonConfig.ShipCannonsConfig;
import game.engine.base.MathUtils;
import game.engine.base.geometry.Line;
import game.engine.base.BaseTypesAndClasses;
import game.engine.navy.NavyTypesAndClasses;

using tweenxcore.Tools;

// w_t - wood top offset x y
// w_b - wood bottom offset x y
// c_x - cannon offset x
// c_y - cannon offset y
// w_t_t - wood top tile
// w_b_t - wood bottom tile
// c_t - cannon tile

typedef CannonParams = {
	w_t_x:Int,
	w_t_y:Int,
	w_b_x:Int,
	w_b_y:Int,
	c_x:Int,
	c_y:Int,
	w_t_t:h2d.Tile,
	w_b_t:h2d.Tile,
	c_t:h2d.Tile
}

class CannonRecoilTween {
	private final side:Side;
	private var tweeningObject:Dynamic;
	private var x = 0.0;
	private var y = 0.0;
	private var frameCount = 0;
	private var play = false;
	private var start_x:Float;
	private var end_x:Float;
	private var start_y:Float;
	private var end_y:Float;

	private var totalFrames = 1 * 45;

	public function new(direction:GameEntityDirection, side:Side, tweeningObject:Dynamic) {
		this.side = side;
		this.tweeningObject = tweeningObject;

		updateObjectAndDirection(tweeningObject, direction);
	}

	public function update() {
		if (play) {
			final rate = frameCount / totalFrames;
			if (rate <= 1) {
				x = rate.yoyo(Easing.quintOut).lerp(start_x, end_x);
				y = rate.yoyo(Easing.quintOut).lerp(start_y, end_y);
				tweeningObject.setPosition(x, y);
			} else {
				play = false;
			}
			frameCount++;
		}
	}

	public function updateObjectAndDirection(tweeningObject:Dynamic, direction:GameEntityDirection) {
		this.tweeningObject = tweeningObject;

		start_x = x = tweeningObject.x;
		start_y = y = tweeningObject.y;
		end_x = tweeningObject.x;
		end_y = tweeningObject.y;

		switch (direction) {
			case EAST:
				if (side == RIGHT) {
					end_y -= 5;
				} else {
					end_y += 5;
				}
			case NORTH_EAST:
				if (side == RIGHT) {
					end_x -= 2.5;
					end_y -= 2.5;
				} else {
					end_x += 2.5;
					end_y += 2.5;
				}
			case NORTH:
				if (side == RIGHT) {
					end_x -= 5;
				} else {
					end_x += 5;
				}
			case NORTH_WEST:
				if (side == RIGHT) {
					end_x -= 2.5;
					end_y += 2.5;
				} else {
					end_x += 2.5;
					end_y -= 2.5;
				}
			case WEST:
				if (side == RIGHT) {
					end_y += 5;
				} else {
					end_y -= 5;
				}
			case SOUTH_WEST:
				if (side == RIGHT) {
					end_x += 2.5;
					end_y += 2.5;
				} else {
					end_x -= 2.5;
					end_y -= 2.5;
				}
			case SOUTH:
				if (side == RIGHT) {
					end_x += 5;
				} else {
					end_x -= 5;
				}
			case SOUTH_EAST:
				if (side == RIGHT) {
					end_x += 5;
				} else {
					end_x -= 2.5;
					end_y += 2.5;
				}
		}
	}

	public function reset() {
		play = true;
		frameCount = 0;

		// Random
		final dir = Std.random(2);
		final rnd = 5;
		totalFrames = 45;
		totalFrames += dir == 1 ? rnd : -rnd;
	}
}

class ShipCannon extends ShipVisualComponent {
	private static var tilesInitialized = false;

	public final leftFiringAreaLine = new Line();
	public final rightFiringAreaLine = new Line();

	public var positionOffset = new Point();

	public var lastSightEndPointPos = new Point();
	public var lastSignAngle = 0.0;

	private var bmp_wood_top:h2d.Bitmap;
	private var bmp_wood_bottom:h2d.Bitmap;
	private var bmp_cannon:h2d.Bitmap;

	private final shipHullSize:ShipHullSize;
	private final recoilAnim:CannonRecoilTween;

	public function new(parent:h2d.Object, shipHullSize:ShipHullSize, direction:GameEntityDirection, side:Side, defaultPosition:PosOffset) {
		super(direction, side);

		this.shipHullSize = shipHullSize;

		if (!tilesInitialized) {
			ShipCannonsConfig.RightCannonParamsByDirMid.get(EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(EAST).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH_EAST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH).c_t = hxd.Res.mid_ship.ok_gun.gun_right_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH_WEST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NORTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(WEST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH_WEST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_sw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH).c_t = hxd.Res.mid_ship.ok_gun.gun_right_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH_EAST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SOUTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_se.toTile();

			ShipCannonsConfig.LeftCannonParamsByDirMid.get(EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(EAST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH_EAST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH).c_t = hxd.Res.mid_ship.ok_gun.gun_left_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH_WEST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NORTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(WEST).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_w.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH_WEST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_sw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH).c_t = hxd.Res.mid_ship.ok_gun.gun_left_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH_EAST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SOUTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_se.toTile();

			ShipCannonsConfig.RightCannonParamsByDirSm.get(EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(EAST).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH_EAST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH).c_t = hxd.Res.mid_ship.ok_gun.gun_right_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH_WEST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NORTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(WEST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH_WEST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_sw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH).c_t = hxd.Res.mid_ship.ok_gun.gun_right_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH_EAST).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SOUTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_right_se.toTile();

			ShipCannonsConfig.LeftCannonParamsByDirSm.get(EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w_small.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(EAST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH_EAST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH).c_t = hxd.Res.mid_ship.ok_gun.gun_left_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH_WEST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NORTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(WEST).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_w.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH_WEST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH_WEST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH_WEST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_sw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH).c_t = hxd.Res.mid_ship.ok_gun.gun_left_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH_EAST).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH_EAST).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SOUTH_EAST).c_t = hxd.Res.mid_ship.ok_gun.gun_left_se.toTile();

			for (key in ShipCannonsConfig.RightCannonParamsByDirSm.keys()) {
				final rightCannonParam = ShipCannonsConfig.RightCannonParamsByDirSm.get(key);
				if (rightCannonParam.w_b_t != null) {
					ShipCannonsConfig.RightCannonParamsByDirSm.get(key).w_b_t = ShipCannonsConfig.RightCannonParamsByDirSm.get(key).w_b_t.center();
				}
				ShipCannonsConfig.RightCannonParamsByDirSm.get(key).w_t_t = ShipCannonsConfig.RightCannonParamsByDirSm.get(key).w_t_t.center();
				ShipCannonsConfig.RightCannonParamsByDirSm.get(key).c_t = ShipCannonsConfig.RightCannonParamsByDirSm.get(key).c_t.center();

				final leftCannonParam = ShipCannonsConfig.LeftCannonParamsByDirSm.get(key);
				if (leftCannonParam.w_b_t != null) {
					ShipCannonsConfig.LeftCannonParamsByDirSm.get(key).w_b_t = ShipCannonsConfig.LeftCannonParamsByDirSm.get(key).w_b_t.center();
				}
				ShipCannonsConfig.LeftCannonParamsByDirSm.get(key).w_t_t = ShipCannonsConfig.LeftCannonParamsByDirSm.get(key).w_t_t.center();
				ShipCannonsConfig.LeftCannonParamsByDirSm.get(key).c_t = ShipCannonsConfig.LeftCannonParamsByDirSm.get(key).c_t.center();
			}

			for (key in ShipCannonsConfig.RightCannonParamsByDirMid.keys()) {
				final rightCannonParam = ShipCannonsConfig.RightCannonParamsByDirMid.get(key);
				if (rightCannonParam.w_b_t != null) {
					ShipCannonsConfig.RightCannonParamsByDirMid.get(key).w_b_t = ShipCannonsConfig.RightCannonParamsByDirMid.get(key).w_b_t.center();
				}
				ShipCannonsConfig.RightCannonParamsByDirMid.get(key).w_t_t = ShipCannonsConfig.RightCannonParamsByDirMid.get(key).w_t_t.center();
				ShipCannonsConfig.RightCannonParamsByDirMid.get(key).c_t = ShipCannonsConfig.RightCannonParamsByDirMid.get(key).c_t.center();

				final leftCannonParam = ShipCannonsConfig.LeftCannonParamsByDirMid.get(key);
				if (leftCannonParam.w_b_t != null) {
					ShipCannonsConfig.LeftCannonParamsByDirMid.get(key).w_b_t = ShipCannonsConfig.LeftCannonParamsByDirMid.get(key).w_b_t.center();
				}
				ShipCannonsConfig.LeftCannonParamsByDirMid.get(key).w_t_t = ShipCannonsConfig.LeftCannonParamsByDirMid.get(key).w_t_t.center();
				ShipCannonsConfig.LeftCannonParamsByDirMid.get(key).c_t = ShipCannonsConfig.LeftCannonParamsByDirMid.get(key).c_t.center();
			}
			tilesInitialized = true;
		}

		final paramsByDir = getCannonParams();

		if (paramsByDir.w_b_t != null) {
			bmp_wood_bottom = new h2d.Bitmap(paramsByDir.w_b_t);
			bmp_wood_bottom.setPosition(paramsByDir.w_b_x, paramsByDir.w_b_y);

			addChild(bmp_wood_bottom);
		}

		if (paramsByDir.w_t_t != null && paramsByDir.c_t != null) {
			bmp_wood_top = new h2d.Bitmap(paramsByDir.w_t_t);
			bmp_cannon = new h2d.Bitmap(paramsByDir.c_t);

			bmp_wood_top.setPosition(paramsByDir.w_t_x, paramsByDir.w_t_y);
			bmp_cannon.setPosition(paramsByDir.c_x, paramsByDir.c_y);

			addChild(bmp_cannon);
			addChild(bmp_wood_top);

			recoilAnim = new CannonRecoilTween(this.direction, side, bmp_cannon);
		}

		setPosition(defaultPosition.x, defaultPosition.y);
	}

	public function changeTilesDirection() {
		final paramsByDir = getCannonParams();

		// TODO Refactor bottom tile and bmp_wood_bottom null check
		if (paramsByDir.w_b_t != null) {
			if (bmp_wood_bottom == null) {
				bmp_wood_bottom = new h2d.Bitmap(paramsByDir.w_b_t);
				removeChild(bmp_cannon);
				removeChild(bmp_wood_top);
				addChild(bmp_wood_bottom);
				addChild(bmp_cannon);
				addChild(bmp_wood_top);
			} else {
				bmp_wood_bottom.alpha = 1;
				bmp_wood_bottom.tile = paramsByDir.w_b_t;
			}
			bmp_wood_bottom.setPosition(paramsByDir.w_b_x, paramsByDir.w_b_y);
		} else if (bmp_wood_bottom != null) {
			bmp_wood_bottom.alpha = 0;
		}

		bmp_wood_top.tile = paramsByDir.w_t_t;
		bmp_cannon.tile = paramsByDir.c_t;
		bmp_wood_top.setPosition(paramsByDir.w_t_x, paramsByDir.w_t_y);
		bmp_cannon.setPosition(paramsByDir.c_x, paramsByDir.c_y);
		recoilAnim.updateObjectAndDirection(bmp_cannon, direction);
	}

	public function update() {
		recoilAnim.update();
	}

	public function updatePosition() {
		if (GameConfig.ShipConfigMode) {
			final paramsByDir = getCannonParams();
			if (bmp_wood_bottom != null) {
				bmp_wood_bottom.setPosition(paramsByDir.w_b_x + positionOffset.x, paramsByDir.w_b_y + positionOffset.y);
			}
			bmp_wood_top.setPosition(paramsByDir.w_t_x + positionOffset.x, paramsByDir.w_t_y + positionOffset.y);
			bmp_cannon.setPosition(paramsByDir.c_x + positionOffset.x, paramsByDir.c_y + positionOffset.y);
		}
	}

	public function shoot() {
		recoilAnim.reset();
	}

	private function getCannonParams() {
		if (shipHullSize == ShipHullSize.SMALL) {
			return side == RIGHT ? ShipCannonsConfig.RightCannonParamsByDirSm.get(direction) : ShipCannonsConfig.LeftCannonParamsByDirSm.get(direction);
		} else {
			return side == RIGHT ? ShipCannonsConfig.RightCannonParamsByDirMid.get(direction) : ShipCannonsConfig.LeftCannonParamsByDirMid.get(direction);
		}
	}
}
