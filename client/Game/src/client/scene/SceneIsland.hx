package client.scene;

import h2d.Scene;

class SceneIsland extends Scene {
	private final game:IslandGameplay;

	public function new() {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);

		game = new IslandGameplay(this, function callback() {});

		// final c = new EngineCharacterEntity(100, 100);
		// character = new ClientCharacter(this, c);

		// TODO implement geometry
	}

	public function update(dt:Float) {
		final c = camera;

		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
			c.scale(1.25, 1.25);
		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
			c.scale(0.8, 0.8);

		game.update(dt);
	}
}
