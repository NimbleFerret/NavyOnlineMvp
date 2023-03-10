package client.manager;

import h2d.Object;
import haxe.Timer;
import client.ui.components.UiToken.TokenType;
import client.ui.components.UiToken.TokenAnimation;

using tweenxcore.Tools;

private class CoinAnimationTween {
	public final tweeningObject:Dynamic;
	public var delete = false;

	// Two seconds
	private final totalFrames = 3 * 60;
	private final start_x:Float;
	private final end_x:Float;
	private final start_y:Float;
	private final end_y:Float;
	private var x = 0.0;
	private var y = 0.0;
	private var frameCount = 0;

	public function new(tweeningObject:Dynamic) {
		this.tweeningObject = tweeningObject;
		final max_rnd = 100;
		final rnd_x_dir = Std.random(2);
		final rnd_x_offset = rnd_x_dir == 0 ? Std.random(-max_rnd) : Std.random(max_rnd);
		final rnd_y_dir = Std.random(2);
		final rnd_y_offset = rnd_y_dir == 0 ? Std.random(-max_rnd) : Std.random(max_rnd);
		start_x = x = tweeningObject.x;
		end_x = tweeningObject.x + 75 * 1.5 + rnd_x_offset;
		start_y = y = tweeningObject.y;
		end_y = tweeningObject.y - 150 * 1.5 + rnd_y_offset;
	}

	public function update() {
		final rate = frameCount / totalFrames;
		if (rate <= 1) {
			tweeningObject.alpha = rate.quintOut().lerp(1, 0);
			x = rate.quintOut().lerp(start_x, end_x);
			y = rate.quintOut().lerp(start_y, end_y);
			tweeningObject.setPosition(x, y);
		} else {
			delete = true;
		}
		frameCount++;
	}
}

class IslandsManager {
	private final tweenAnimations:Array<CoinAnimationTween> = [];
	private final islandObject:h2d.Object;

	public function new(terrain:String, mining:Bool, offsetX:Float = 1000, offsetY:Float = 400) {
		islandObject = new Object();

		var islandCompositeTile = hxd.Res.island_green_composite.toTile().center();
		if (terrain == 'Snow') {
			islandCompositeTile = hxd.Res.island_snow_composite.toTile().center();
		} else if (terrain == 'Dark') {
			islandCompositeTile = hxd.Res.island_dark_composite.toTile().center();
		}

		final islandCompositeBmp = new h2d.Bitmap(islandCompositeTile);
		islandCompositeBmp.setScale(3);
		islandCompositeBmp.setPosition(offsetX, offsetY);
		islandObject.addChild(islandCompositeBmp);

		if (mining) {
			final miningAnimation1 = hxd.Res.mine_anims._1.toTile();
			final miningAnimation2 = hxd.Res.mine_anims._2.toTile();
			final miningAnimation3 = hxd.Res.mine_anims._3.toTile();
			final miningAnimation4 = hxd.Res.mine_anims._4.toTile();
			final miningAnimation5 = hxd.Res.mine_anims._5.toTile();
			final miningAnimation6 = hxd.Res.mine_anims._6.toTile();
			final miningAnimation7 = hxd.Res.mine_anims._7.toTile();
			final miningAnimation8 = hxd.Res.mine_anims._8.toTile();
			final miningAnimation = new h2d.Anim([
				miningAnimation1,
				miningAnimation2,
				miningAnimation3,
				miningAnimation4,
				miningAnimation5,
				miningAnimation6,
				miningAnimation7,
				miningAnimation8
			]);
			miningAnimation.setScale(4);
			miningAnimation.setPosition(656, 460);
			islandObject.addChild(miningAnimation);
			loop(1000);
			loop(1000);
			loop(1000);
			loop(2000);
			loop(2000);
			loop(2000);
		}
	}

	public function getIslandObject() {
		return islandObject;
	}

	public function update() {
		final tweensToDelete:Array<CoinAnimationTween> = [];
		for (tween in tweenAnimations) {
			tween.update();
			if (tween.delete) {
				tweensToDelete.push(tween);
			}
		}
		for (tween in tweensToDelete) {
			islandObject.removeChild(tween.tweeningObject);
			tweenAnimations.remove(tween);
		}
	}

	private function loop(delay:Int) {
		Timer.delay(function callback() {
			final coinAnimation = addCoinAnim();
			islandObject.addChild(coinAnimation);
			tweenAnimations.push(new CoinAnimationTween(coinAnimation));
			loop(delay);
		}, delay);
	}

	private function addCoinAnim() {
		return new TokenAnimation(TokenType.NVY, 3, 720, 520);
	}
}
