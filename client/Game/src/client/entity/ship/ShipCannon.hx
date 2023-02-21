package client.entity.ship;

import client.entity.ship.ShipCannonConfig.ShipCannonsConfig;
import game.engine.MathUtils;
import game.engine.geometry.Line;
import game.engine.entity.TypesAndClasses;

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
			case East:
				if (side == Right) {
					end_y -= 5;
				} else {
					end_y += 5;
				}
			case NorthEast:
				if (side == Right) {
					end_x -= 2.5;
					end_y -= 2.5;
				} else {
					end_x += 2.5;
					end_y += 2.5;
				}
			case North:
				if (side == Right) {
					end_x -= 5;
				} else {
					end_x += 5;
				}
			case NorthWest:
				if (side == Right) {
					end_x -= 2.5;
					end_y += 2.5;
				} else {
					end_x += 2.5;
					end_y -= 2.5;
				}
			case West:
				if (side == Right) {
					end_y += 5;
				} else {
					end_y -= 5;
				}
			case SouthWest:
				if (side == Right) {
					end_x += 2.5;
					end_y += 2.5;
				} else {
					end_x -= 2.5;
					end_y -= 2.5;
				}
			case South:
				if (side == Right) {
					end_x += 5;
				} else {
					end_x -= 5;
				}
			case SouthEast:
				if (side == Right) {
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

	private var bmp_wood_top:h2d.Bitmap;
	private var bmp_wood_bottom:h2d.Bitmap;
	private var bmp_cannon:h2d.Bitmap;

	private final shipHullSize:ShipHullSize;
	private final recoilAnim:CannonRecoilTween;

	public function new(parent:h2d.Object, shipHullSize:ShipHullSize, direction:GameEntityDirection, side:Side) {
		super(direction, side);

		this.shipHullSize = shipHullSize;

		if (!tilesInitialized) {
			ShipCannonsConfig.RightCannonParamsByDirMid.get(East).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(East).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(East).c_t = hxd.Res.mid_ship.ok_gun.gun_right_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NorthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NorthEast).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NorthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_right_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(North).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(North).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(North).c_t = hxd.Res.mid_ship.ok_gun.gun_right_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NorthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NorthWest).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(NorthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_right_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(West).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(West).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(West).c_t = hxd.Res.mid_ship.ok_gun.gun_right_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SouthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SouthWest).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SouthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_right_sw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(South).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(South).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(South).c_t = hxd.Res.mid_ship.ok_gun.gun_right_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SouthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SouthEast).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirMid.get(SouthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_right_se.toTile();

			ShipCannonsConfig.LeftCannonParamsByDirMid.get(East).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(East).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(East).c_t = hxd.Res.mid_ship.ok_gun.gun_left_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NorthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NorthEast).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NorthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_left_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(North).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(North).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(North).c_t = hxd.Res.mid_ship.ok_gun.gun_left_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NorthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NorthWest).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(NorthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_left_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(West).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(West).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(West).c_t = hxd.Res.mid_ship.ok_gun.gun_left_w.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SouthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SouthWest).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SouthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_left_sw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(South).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(South).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(South).c_t = hxd.Res.mid_ship.ok_gun.gun_left_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SouthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SouthEast).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirMid.get(SouthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_left_se.toTile();

			ShipCannonsConfig.RightCannonParamsByDirSm.get(East).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(East).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(East).c_t = hxd.Res.mid_ship.ok_gun.gun_right_e.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NorthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NorthEast).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NorthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_right_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(North).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(North).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(North).c_t = hxd.Res.mid_ship.ok_gun.gun_right_n.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NorthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NorthWest).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(NorthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_right_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(West).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(West).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(West).c_t = hxd.Res.mid_ship.ok_gun.gun_right_w.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SouthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SouthWest).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SouthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_right_sw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(South).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(South).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(South).c_t = hxd.Res.mid_ship.ok_gun.gun_right_s.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SouthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SouthEast).w_b_t = null;
			ShipCannonsConfig.RightCannonParamsByDirSm.get(SouthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_right_se.toTile();

			ShipCannonsConfig.LeftCannonParamsByDirSm.get(East).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_w_small.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(East).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(East).c_t = hxd.Res.mid_ship.ok_gun.gun_left_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NorthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NorthEast).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NorthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_left_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(North).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(North).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(North).c_t = hxd.Res.mid_ship.ok_gun.gun_left_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NorthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NorthWest).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(NorthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_left_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(West).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(West).w_b_t = hxd.Res.mid_ship.wood_bottom.wood_bottom_e.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(West).c_t = hxd.Res.mid_ship.ok_gun.gun_left_w.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SouthWest).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_ne.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SouthWest).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SouthWest).c_t = hxd.Res.mid_ship.ok_gun.gun_left_sw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(South).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_n.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(South).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(South).c_t = hxd.Res.mid_ship.ok_gun.gun_left_s.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SouthEast).w_t_t = hxd.Res.mid_ship.wood_top.wood_top_nw.toTile();
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SouthEast).w_b_t = null;
			ShipCannonsConfig.LeftCannonParamsByDirSm.get(SouthEast).c_t = hxd.Res.mid_ship.ok_gun.gun_left_se.toTile();

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

		var paramsByDir = getCannonParams();

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

	public function shoot() {
		recoilAnim.reset();
	}

	private function getCannonParams() {
		if (shipHullSize == ShipHullSize.SMALL) {
			return side == Right ? ShipCannonsConfig.RightCannonParamsByDirSm.get(direction) : ShipCannonsConfig.LeftCannonParamsByDirSm.get(direction);
		} else {
			return side == Right ? ShipCannonsConfig.RightCannonParamsByDirMid.get(direction) : ShipCannonsConfig.LeftCannonParamsByDirMid.get(direction);
		}
	}
}
