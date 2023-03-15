package client.scene.impl;

import client.network.RestProtocol.JoinSectorResponse;
import client.gameplay.island.IslandGameplay;
import client.scene.base.BasicOnlineScene;
import game.engine.base.BaseTypesAndClasses;
import game.engine.base.core.BaseEngine.EngineMode;
import game.engine.navy.entity.NavyCharacterEntity;
import h3d.Engine;

class SceneIsland extends BasicOnlineScene {
	private var leaveCallback:Void->Void;

	public function new(engineMode:EngineMode, leaveCallback:Void->Void) {
		super(engineMode);
		this.leaveCallback = leaveCallback;
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public override function start(?response:JoinSectorResponse) {
		instanceId = response.instanceId;

		game = new IslandGameplay(this, response.islandId, response.islandOwner, response.islandTerrain, response.islandMining, function callback() {
			if (leaveCallback != null) {
				game = null;
				unsubscribeFromServerEvents();
				leaveCallback();
			}
		}, engineMode);

		if (game.baseEngine.engineMode == EngineMode.Server) {
			joinGame();
			subscribeToServerEvents();
		} else {
			final playerId = Player.instance.playerId;
			final char1 = new NavyCharacterEntity(new BaseObjectEntity({
				x: 350,
				y: 290,
				minSpeed: 0,
				maxSpeed: 150,
				acceleration: 150,
				currentSpeed: 0,
				movementDelay: 0.100,
				id: 'char_' + playerId,
				ownerId: playerId,
			}));
			game.startGameSingleplayer(playerId, [char1]);
		}
	}

	public function processCustomServerEvent(event:String, message:Dynamic) {
		trace('Unknown socket message');
	}

	public function getInputScene() {
		return getIslandGameplay().hud;
	}

	// --------------------------------------
	// General
	// --------------------------------------

	public override function render(e:Engine) {
		getIslandGameplay().waterScene.render(e);
		super.render(e);
		getIslandGameplay().hud.render(e);
		getIslandGameplay().debugDraw();
	}

	public function getHud() {
		return getIslandGameplay().hud;
	}

	private function getIslandGameplay() {
		return cast(game, IslandGameplay);
	}
}
