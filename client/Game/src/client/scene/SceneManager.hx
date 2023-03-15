package client.scene;

import client.network.RestProtocol.JoinSectorResponse;
import game.engine.base.core.BaseEngine.EngineMode;
import client.scene.base.BasicScene;
import client.scene.impl.HomeScene;
import client.scene.impl.SceneGeomTest;
import client.scene.impl.SceneShipsConfig;
import client.scene.impl.SceneIsland;
import client.scene.impl.SceneShips;

enum GameScene {
	SceneHome;
	SceneShipsSingleplayer;
	SceneIslandSingleplayer;
	SceneShipsMultiplayer;
	SceneIslandMultiplayer;
	SceneShipConfig;
	SceneGeomTest;
}

class SceneManager {
	private var sceneChangedCallback:BasicScene->Void;
	private var currentScene:BasicScene;

	public function new(sceneChangedCallback:BasicScene->Void, scene:GameScene = GameScene.SceneHome) {
		this.sceneChangedCallback = sceneChangedCallback;

		currentScene = new HomeScene(function callback(gameScene:GameScene) {
			switch (gameScene) {
				case SceneShipsSingleplayer:
					currentScene = new SceneShips(EngineMode.Client, null, null);
					currentScene.start(new JoinSectorResponse(true, null, 0, Player.instance.TestGameplayInstanceId, 1, null, null, null, false));
				case SceneIslandSingleplayer:
					currentScene = new SceneIsland(EngineMode.Client, null);
					currentScene.start(new JoinSectorResponse(true, null, 0, Player.instance.TestIslandInstanceId, 1, 'island_123',
						'0x87400A03678dd03c8BF536404B5B14C609a23b79', 'Green', true));
				case SceneShipsMultiplayer:
					currentScene = new SceneShips(EngineMode.Server, null, null);
					currentScene.start(new JoinSectorResponse(true, null, 0, Player.instance.TestGameplayInstanceId, 1, null, null, null, false));
				case SceneIslandMultiplayer:
					currentScene = new SceneIsland(EngineMode.Server, null);
					currentScene.start(new JoinSectorResponse(true, null, 0, Player.instance.TestIslandInstanceId, 1, 'island_123',
						'0x87400A03678dd03c8BF536404B5B14C609a23b79', 'Green', true));
				case SceneShipConfig:
					currentScene = new SceneShipsConfig();
					currentScene.start();
				case SceneGeomTest:
					currentScene = new SceneGeomTest();
					currentScene.start();
				default:
			}
			fireChangeSceneCallback();
		});

		fireChangeSceneCallback();
	}

	public function getCurrentScene() {
		return currentScene;
	}

	private function fireChangeSceneCallback() {
		if (sceneChangedCallback != null) {
			sceneChangedCallback(currentScene);
		}
	}
}
