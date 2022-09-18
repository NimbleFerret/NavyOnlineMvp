package client;

using tweenxcore.Tools;

// TODO add abstraction and move to some effects folder ?

class TextDamageTween {
	public final tweeningObject:Dynamic;
	public var delete = false;

	// Two seconds
	private final totalFrames = 2 * 60;

	private final start_x:Float;
	private final end_x:Float;
	private final start_y:Float;
	private final end_y:Float;

	private var x = 0.0;
	private var y = 0.0;

	private var frameCount = 0;

	public function new(tweeningObject:Dynamic) {
		this.tweeningObject = tweeningObject;

		final max_rnd = 50;

		final rnd_x_dir = Std.random(2);
		final rnd_x_offset = rnd_x_dir == 0 ? Std.random(-max_rnd) : Std.random(max_rnd);

		final rnd_y_dir = Std.random(2);
		final rnd_y_offset = rnd_y_dir == 0 ? Std.random(-max_rnd) : Std.random(max_rnd);

		start_x = x = tweeningObject.x;
		end_x = tweeningObject.x + 75 + rnd_x_offset;

		start_y = y = tweeningObject.y;
		end_y = tweeningObject.y - 150 + rnd_y_offset;
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

class EffectsManager {
	final s2d:h2d.Scene;

	final splashTexture:h3d.mat.Texture;

	final fire1Tile:h2d.Tile;
	final fire2Tile:h2d.Tile;

	final explosion1Tile:h2d.Tile;
	final explosion2Tile:h2d.Tile;
	final explosion3Tile:h2d.Tile;

	final tweenAnimations:Array<TextDamageTween> = [];

	public function new(s2d:h2d.Scene) {
		this.s2d = s2d;

		splashTexture = hxd.Res.Splash.toTexture();

		fire1Tile = hxd.Res.fire1.toTile();
		fire1Tile = fire1Tile.center();

		fire2Tile = hxd.Res.fire2.toTile();
		fire2Tile = fire2Tile.center();

		explosion1Tile = hxd.Res.explosion1.toTile();
		explosion1Tile = explosion1Tile.center();

		explosion2Tile = hxd.Res.explosion2.toTile();
		explosion2Tile = explosion2Tile.center();

		explosion3Tile = hxd.Res.explosion3.toTile();
		explosion3Tile = explosion3Tile.center();
	}

	public function clear() {
		for (i in 0...tweenAnimations.length) {
			s2d.removeChild(tweenAnimations[i].tweeningObject);
		}
	}

	public function update() {
		final tweensToDelete:Array<TextDamageTween> = [];
		for (tween in tweenAnimations) {
			tween.update();
			if (tween.delete) {
				tweensToDelete.push(tween);
			}
		}
		for (tween in tweensToDelete) {
			s2d.removeChild(tween.tweeningObject);
			tweenAnimations.remove(tween);
		}
	}

	// -----------------
	// Animation effects
	// -----------------

	public function addFire(x:Float, y:Float) {
		var anim = new h2d.Anim([fire1Tile, fire2Tile], s2d);
		anim.setPosition(x, y);
		anim.scale(1.5);
		anim.loop = false;
		anim.fading = true;
	}

	public function addExplosion(x:Float, y:Float) {
		var anim = new h2d.Anim([explosion1Tile, explosion2Tile, explosion3Tile], s2d);
		anim.setPosition(x, y);
		anim.scale(1.5);
		anim.loop = false;
		anim.fading = true;
	}

	public function addSplash(x:Float, y:Float) {
		var anim = new h2d.Anim([
			h2d.Tile.fromTexture(splashTexture).sub(0, 0, 32, splashTexture.height),
			h2d.Tile.fromTexture(splashTexture).sub(32, 0, 32, splashTexture.height),
			h2d.Tile.fromTexture(splashTexture).sub(64, 0, 32, splashTexture.height),
			h2d.Tile.fromTexture(splashTexture).sub(96, 0, 32, splashTexture.height)
		], s2d);
		anim.setPosition(x - 22, y - 15);
		anim.scale(1.5);
		anim.loop = false;
		anim.fading = true;
	}

	// -----------------
	// Text effects
	// -----------------

	public function addDamageText(x:Float, y:Float, damage:Int) {
		final text = new h2d.Text(getFont(), s2d);
		text.setPosition(x, y);
		text.textColor = 0xFF0000;
		text.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};
		text.scale(5);
		text.text = "- " + damage + " !";

		tweenAnimations.push(new TextDamageTween(text));
	}

	private function getFont() {
		return hxd.res.DefaultFont.get();
	}
}
