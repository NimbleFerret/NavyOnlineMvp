package client.gameplay.battle;

class WaterScene extends h2d.Scene {
	public final waterBg:WaterBg;

	public function new() {
		super();

		scaleMode = Stretch(1920, 1080);

		waterBg = new WaterBg(this, 0, 0, 4);
	}

	public function update(dt:Float) {
		waterBg.update(dt);
	}
}
