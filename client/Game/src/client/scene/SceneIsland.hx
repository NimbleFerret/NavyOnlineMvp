package client.scene;

import h2d.Scene;

class SceneIsland extends Scene {
	private var islandsManager:IslandsManager;

	public function new() {
		super();

		islandsManager = new IslandsManager(this);
	}
}
