package client.scene.impl;

import client.network.RestProtocol.JoinSectorResponse;
import client.scene.SceneManager.GameScene;
import client.scene.base.BasicScene;
import haxe.ui.components.Button;
import haxe.ui.core.Screen;
import haxe.ui.Toolkit;
import haxe.ui.ComponentBuilder;

class HomeScene extends BasicScene {
	private var selectSceneCallback:GameScene->Void;

	public function new(selectSceneCallback:GameScene->Void) {
		super();

		this.selectSceneCallback = selectSceneCallback;

		final vBox = ComponentBuilder.fromFile("res/main-view.xml");
		Toolkit.init({root: this, manualUpdate: false});
		Screen.instance.addComponent(vBox);

		vBox.findComponent("sp_ships_btn", Button).onClick = function(e) {
			selectScene(GameScene.SceneShipsSingleplayer);
		};
		vBox.findComponent("sp_island_btn", Button).onClick = function(e) {
			selectScene(GameScene.SceneIslandSingleplayer);
		};
		vBox.findComponent("mp_ships_btn", Button).onClick = function(e) {
			selectScene(GameScene.SceneShipsMultiplayer);
		};
		vBox.findComponent("mp_island_btn", Button).onClick = function(e) {
			selectScene(GameScene.SceneIslandMultiplayer);
		};
		vBox.findComponent("ship_config_btn", Button).onClick = function(e) {
			selectScene(GameScene.SceneShipConfig);
		};
		vBox.findComponent("geom_test_btn", Button).onClick = function(e) {
			selectScene(GameScene.SceneGeomTest);
		};
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public function start(?joinSectorResponse:JoinSectorResponse) {}

	public function update(dt:Float, fps:Float) {}

	public function getInputScene() {
		return this;
	}

	// --------------------------------------
	// General
	// --------------------------------------

	private function selectScene(gameScene:GameScene) {
		if (selectSceneCallback != null) {
			selectSceneCallback(gameScene);
		}
	}
}
