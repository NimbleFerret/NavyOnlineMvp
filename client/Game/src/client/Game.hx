package client;

import h2d.Scene;
import hxd.Key in K;
import hxd.Timer;
import engine.GameEngine;
import client.entity.ClientBaseGameEntity;
import client.entity.ClientShell;
import client.entity.ClientShip;
import client.network.Protocol;
import client.network.Socket;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShellEntity;
import engine.entity.EngineShipEntity;

// TODO refactor states
enum GameState {
	Init;
	Playing;
	Died;
}

enum InputType {
	Game;
	DebugCamera;
	DebugPlayerShip;
}

class Game {
	// Global config
	public static final ShowIslands = false;
	//
	public static var DebugDraw = true;

	public var gameState = GameState.Init;

	public var playerId:String;
	public var playerShipId:String;

	//
	private var gameEngine:GameEngine;

	private final clientShips:Map<String, ClientShip> = [];
	private final clientShells:Map<String, ClientShell> = [];

	private var effectsManager:EffectsManager;
	private var islandsManager:IslandsManager;
	private var inputType = InputType.Game;

	public var hud:Hud;

	// Player input
	private var timeSinceLastShipsPosUpdate = 0.0;
	private var lastMovementInputCheck = 0.0;
	private var inputMovementCheckDelayMS = 1.0;
	private var lastShootInputCheck = 0.0;
	private var inputShootCheckDelayMS = 0.200;

	private final scene:h2d.Scene;

	public function new(scene:h2d.Scene, engineMode:EngineMode) {
		this.scene = scene;

		// --------------------------------------
		// Game managers and services init
		// --------------------------------------

		gameEngine = new GameEngine(engineMode);
		gameEngine.createShipCallback = function callback(engineShipEntity:EngineShipEntity) {}
		gameEngine.createShellCallback = function callback(engineShellEntities:Array<EngineShellEntity>) {
			final ownerShip = clientShips.get(engineShellEntities[0].ownerId);
			final shotParams = new Array<ShotParams>();
			if (ownerShip != null) {
				for (engineShell in engineShellEntities) {
					final clientShell = new ClientShell(scene, engineShell, ownerShip);
					clientShells.set(engineShell.id, clientShell);
					shotParams.push({
						speed: engineShell.shellRnd.speed,
						dir: engineShell.shellRnd.dir,
						rotation: engineShell.shellRnd.rotation
					});
				}
			}
			if (engineShellEntities[0].serverSide) {
				trace('server side shells');
			} else {
				trace('client side shells');
			}
			if (gameEngine.engineMode == EngineMode.Server && !engineShellEntities[0].serverSide) {
				Socket.instance.shoot({
					playerId: playerId,
					left: engineShellEntities[0].side == Side.Left ? true : false,
					shotParams: shotParams
				});
			}
		};

		gameEngine.deleteShellCallback = function callback(engineShellEntity:EngineShellEntity) {
			// clientShells.get(engineShellEntity.)
			trace("Delete shell callback");
		};

		gameEngine.deleteShipCallback = function callback(engineShipEntity:EngineShipEntity) {
			final clientShip = clientShips.get(engineShipEntity.id);
			if (clientShip != null) {
				clientShip.clearDebugGraphics(scene);
				scene.removeChild(clientShip);

				if (engineShipEntity.ownerId == playerId) {
					gameState = GameState.Died;
					// TODO show retry dialog
				}

				clientShips.remove(engineShipEntity.id);
			}
		};

		gameEngine.shipHitByShellCallback = function callback(params:ShipShitByShellCallbackParams) {
			final clientShip = clientShips.get(params.ship.id);
			if (clientShip != null) {
				effectsManager.addDamageText(clientShip.x, clientShip.y, params.damage);
			}
		};

		effectsManager = new EffectsManager(scene);
		islandsManager = new IslandsManager(scene);

		// --------------------------------------
		// UI
		// --------------------------------------

		hud = new Hud();
		hud.addChoice("Debug draw", ["Off", "On"], function(i) {
			switch (i) {
				case 0:
					DebugDraw = false;
				case 1:
					DebugDraw = true;
			}
		});

		hud.addChoice("Input", ["Game", "Camera", "Player"], function(i) {
			switch (i) {
				case 0:
					inputType = InputType.Game;
				case 1:
					inputType = InputType.DebugCamera;
				case 2:
					inputType = InputType.DebugPlayerShip;
			}
		});
	}

	public function update(dt:Float, fps:Float) {
		if (gameState == GameState.Playing) {
			hud.update(dt);
			hud.updateSystemInfo(fps);

			effectsManager.update();

			updateInput();

			for (ship in gameEngine.getShips()) {
				if (clientShips.exists(ship.id)) {
					final clientShip = clientShips.get(ship.id);
					clientShip.update(dt);
				}
			}

			final shellsToDelete:Array<String> = [];

			for (shell in clientShells) {
				shell.update(dt);

				if (!shell.isAlive()) {
					shellsToDelete.push(shell.getId());
				}
			}

			for (i in 0...shellsToDelete.length) {
				final key = shellsToDelete[i];
				var shell = clientShells.get(key);
				if (shell != null) {
					final dieEffect = shell.getDieEffect();
					if (dieEffect == DieEffect.Splash) {
						effectsManager.addSplash(shell.x, shell.y);
					} else if (dieEffect == DieEffect.Explosion) {
						effectsManager.addExplosion(shell.x, shell.y);
					}
					if (shell.debugRect != null) {
						scene.removeChild(shell.debugRect);
					}
					scene.removeChild(shell);
					clientShells.remove(key);
				}
			}

			if (inputType == InputType.Game) {
				final playerShip = getPlayerShip();
				if (playerShip != null) {
					hud.updatePlayerParams(playerShip);
					scene.camera.x = hxd.Math.lerp(scene.camera.x, playerShip.x, 0.1);
					scene.camera.y = hxd.Math.lerp(scene.camera.y, playerShip.y, 0.1);
				}
			}
		}
	}

	public function debugDraw() {
		function drawDebugRect(entity:ClientBaseGameEntity) {
			if (entity.debugRect == null) {
				entity.debugRect = new h2d.Graphics(scene);
			}
			if (entity.debugRect != null) {
				entity.debugRect.clear();
			}

			if (DebugDraw) {
				final graphics = entity.debugRect;
				final rect = entity.getEngineEntityRect();

				graphics.lineStyle(3, entity.shapeColor);

				// Top line
				graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
				graphics.lineTo(rect.getTopRightPoint().x, rect.getTopRightPoint().y);

				// Right line
				graphics.lineTo(rect.getBottomRightPoint().x, rect.getBottomRightPoint().y);

				// Bottom line
				graphics.lineTo(rect.getBottomLeftPoint().x, rect.getBottomLeftPoint().y);

				// Left line
				graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
			}
		}

		for (ship in clientShips) {
			// Draw ship rect shape
			drawDebugRect(ship);

			if (DebugDraw) {
				// Draw left side canons
				// 1
				if (ship.leftSideCanonDebugRect1 == null) {
					ship.leftSideCanonDebugRect1 = new h2d.Graphics(scene);
				} else {
					ship.leftSideCanonDebugRect1.clear();
				}

				final leftGunPos1 = ship.getCanonOffsetBySideAndIndex(Side.Left, 0);

				ship.leftSideCanonDebugRect1.beginFill(0x00ff00);
				ship.leftSideCanonDebugRect1.drawRect(leftGunPos1.x, leftGunPos1.y, 10, 10);
				ship.leftSideCanonDebugRect1.endFill();

				// 2
				if (ship.leftSideCanonDebugRect2 == null) {
					ship.leftSideCanonDebugRect2 = new h2d.Graphics(scene);
				} else {
					ship.leftSideCanonDebugRect2.clear();
				}

				final leftGunPos2 = ship.getCanonOffsetBySideAndIndex(Side.Left, 1);

				ship.leftSideCanonDebugRect2.beginFill(0x00ff00);
				ship.leftSideCanonDebugRect2.drawRect(leftGunPos2.x, leftGunPos2.y, 10, 10);
				ship.leftSideCanonDebugRect2.endFill();

				// 3
				if (ship.leftSideCanonDebugRect3 == null) {
					ship.leftSideCanonDebugRect3 = new h2d.Graphics(scene);
				} else {
					ship.leftSideCanonDebugRect3.clear();
				}

				final leftGunPos3 = ship.getCanonOffsetBySideAndIndex(Side.Left, 2);

				ship.leftSideCanonDebugRect3.beginFill(0x00ff00);
				ship.leftSideCanonDebugRect3.drawRect(leftGunPos3.x, leftGunPos3.y, 10, 10);
				ship.leftSideCanonDebugRect3.endFill();

				// Draw right side canons
				// 1
				if (ship.rightSideCanonDebugRect1 == null) {
					ship.rightSideCanonDebugRect1 = new h2d.Graphics(scene);
				} else {
					ship.rightSideCanonDebugRect1.clear();
				}

				final rightGunPos1 = ship.getCanonOffsetBySideAndIndex(Side.Right, 0);

				ship.rightSideCanonDebugRect1.beginFill(0x00ff00);
				ship.rightSideCanonDebugRect1.drawRect(rightGunPos1.x, rightGunPos1.y, 10, 10);
				ship.rightSideCanonDebugRect1.endFill();

				// 2
				if (ship.rightSideCanonDebugRect2 == null) {
					ship.rightSideCanonDebugRect2 = new h2d.Graphics(scene);
				} else {
					ship.rightSideCanonDebugRect2.clear();
				}

				final rightGunPos2 = ship.getCanonOffsetBySideAndIndex(Side.Right, 1);

				ship.rightSideCanonDebugRect2.beginFill(0x00ff00);
				ship.rightSideCanonDebugRect2.drawRect(rightGunPos2.x, rightGunPos2.y, 10, 10);
				ship.rightSideCanonDebugRect2.endFill();

				// 3
				if (ship.rightSideCanonDebugRect3 == null) {
					ship.rightSideCanonDebugRect3 = new h2d.Graphics(scene);
				} else {
					ship.rightSideCanonDebugRect3.clear();
				}

				final rightGunPos3 = ship.getCanonOffsetBySideAndIndex(Side.Right, 2);

				ship.rightSideCanonDebugRect3.beginFill(0x00ff00);
				ship.rightSideCanonDebugRect3.drawRect(rightGunPos3.x, rightGunPos3.y, 10, 10);
				ship.rightSideCanonDebugRect3.endFill();
			}
		}

		for (shell in clientShells) {
			drawDebugRect(shell);
		}
	}

	private function getPlayerShip() {
		return clientShips.get(playerShipId);
	}

	private function updateInput() {
		final now = Timer.lastTimeStamp;

		final c = scene.camera;

		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
			c.scale(1.25, 1.25);
		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
			c.scale(0.8, 0.8);

		switch (inputType) {
			case InputType.Game:
				final left = K.isDown(K.LEFT);
				final right = K.isDown(K.RIGHT);
				final up = K.isDown(K.UP);
				final down = K.isDown(K.DOWN);
				final q = K.isDown(K.Q);
				final e = K.isDown(K.E);

				if (left || right || up || down)
					if (lastMovementInputCheck == 0 || lastMovementInputCheck + inputMovementCheckDelayMS < now) {
						lastMovementInputCheck = now;
						if (up)
							gameEngine.shipAccelerate(playerShipId);
						if (down)
							gameEngine.shipDecelerate(playerShipId);
						if (left)
							gameEngine.shipRotateLeft(playerShipId);
						if (right)
							gameEngine.shipRotateRight(playerShipId);
						if ((up || down || left || right) && gameEngine.engineMode == EngineMode.Server) {
							Socket.instance.move({
								playerId: playerId,
								up: up,
								down: down,
								left: left,
								right: right
							});
						}
					}
				if (q || e)
					if (lastShootInputCheck == 0 || lastShootInputCheck + inputShootCheckDelayMS < now) {
						lastShootInputCheck = now;
						if (q)
							gameEngine.shipShootBySide(Side.Left, playerShipId, false);
						if (e)
							gameEngine.shipShootBySide(Side.Right, playerShipId, false);
					}
			case InputType.DebugCamera:
				final moveMapSpeed = 10;
				if (hxd.Key.isDown(hxd.Key.RIGHT))
					c.x += moveMapSpeed / c.scaleX;
				if (hxd.Key.isDown(hxd.Key.LEFT))
					c.x -= moveMapSpeed / c.scaleX;
				if (hxd.Key.isDown(hxd.Key.DOWN))
					c.y += moveMapSpeed / c.scaleY;
				if (hxd.Key.isDown(hxd.Key.UP))
					c.y -= moveMapSpeed / c.scaleY;
			case InputType.DebugPlayerShip:
				// final playerShip = ships.get(playerShipId);
				// final moveSpeed = 1;
				// var dx = 0.0;
				// var dy = 0.0;
				// var r = 0.0;
				// if (hxd.Key.isDown(hxd.Key.RIGHT))
				// 	dx = moveSpeed;
				// if (hxd.Key.isDown(hxd.Key.LEFT))
				// 	dx = -moveSpeed;
				// if (hxd.Key.isDown(hxd.Key.DOWN))
				// 	dy = moveSpeed;
				// if (hxd.Key.isDown(hxd.Key.UP))
				// 	dy = -moveSpeed;
				// if (hxd.Key.isPressed(hxd.Key.Q))
				// 	playerShip.rotateLeft();
				// if (hxd.Key.isPressed(hxd.Key.E))
				// 	playerShip.rotateRight();
				// playerShip.x += dx;
				// playerShip.y += dy;
		}
	}

	// --------------------------------------
	// Multiplayer
	// --------------------------------------

	public function startGame(playerId:String, message:SocketServerMessageGameInit) {
		final ships = jsShipsToHaxeGameEngineShips(message.ships);

		if (gameState == GameState.Init) {
			for (ship in ships) {
				gameEngine.addShip(ship);

				final newClientShip = new ClientShip(scene, ship);
				clientShips.set(ship.id, newClientShip);

				if (ship.ownerId == playerId) {
					playerShipId = ship.id;
				}
			}
			this.playerId = playerId;
			gameState = GameState.Playing;
		}
	}

	public function addShip(message:SocketServerMessageAddShip) {
		final ship = jsShipToHaxeGameEngineShip(message.ship);

		if (gameState == GameState.Playing) {
			if (!clientShips.exists(ship.id)) {
				gameEngine.addShip(ship);
				final newClientShip = new ClientShip(scene, ship);
				clientShips.set(ship.id, newClientShip);
			}
		}
	}

	public function shipMove(message:SocketServerMessageShipMove) {
		if (gameState == GameState.Playing && playerShipId != message.shipId) {
			if (message.up)
				gameEngine.shipAccelerate(message.shipId);
			if (message.down)
				gameEngine.shipDecelerate(message.shipId);
			if (message.left)
				gameEngine.shipRotateLeft(message.shipId);
			if (message.right)
				gameEngine.shipRotateRight(message.shipId);
		}
	}

	public function shipShoot(message:SocketServerMessageShipShoot) {
		if (gameState == GameState.Playing && playerId != message.playerId) {
			final side = message.left ? Side.Left : Side.Right;
			final shipId = gameEngine.getShipIdByOwnerId(message.playerId);
			gameEngine.shipShootBySide(side, shipId, message.shotParams);
		}
	}

	public function removeShip(message:SocketServerMessageRemoveShip) {
		if (gameEngine.engineMode == EngineMode.Server) {
			gameEngine.removeShip(message.shipId);
		}
	}

	public function updateWorldState(message:SocketServerMessageUpdateWorldState) {
		if (gameEngine.engineMode == EngineMode.Server) {
			// TODO check last sync time in order to reduce computations
			for (ship in message.ships) {
				final clientShip = clientShips.get(ship.id);
				final clientShipHullAndArmor = clientShip.getHullAndArmor();

				if (clientShipHullAndArmor.currentHull != ship.currentHull || clientShipHullAndArmor.currentArmor != ship.currentArmor) {
					clientShip.updateHullAndArmor(ship.currentHull, ship.currentArmor);

					if (ship.currentHull == 0 && clientShipHullAndArmor.currentHull != 0) {
						gameEngine.removeShip(ship.id);
					}
				}

				final distanceBetweenServerAndClient = hxd.Math.distance(ship.x - clientShip.x, ship.y - clientShip.y);

				if (distanceBetweenServerAndClient >= 50) {
					clientShip.updateEntityPosition(ship.x, ship.y);
				}
			}
		}
	}

	// --------------------------------------
	// Single player
	// --------------------------------------

	public function startGameByClient(playerId:String, ships:Array<EngineShipEntity>) {
		if (gameState == GameState.Init) {
			for (ship in ships) {
				gameEngine.addShip(ship);

				final newClientShip = new ClientShip(scene, ship);
				clientShips.set(ship.id, newClientShip);

				if (ship.ownerId == playerId) {
					playerShipId = ship.id;
				}
			}
			this.playerId = playerId;
			gameState = GameState.Playing;
		}
	}

	public function addShipByClient(role:Role, x:Int, y:Int, shipId:String, ?ownerId:String) {
		return gameEngine.createShip(role, x, y, shipId, ownerId);
	}

	// --------------------------------------
	// Utils
	// --------------------------------------

	private function jsShipToHaxeGameEngineShip(ship:EntityShip) {
		return new EngineShipEntity(ship.x, ship.y, ship.id, ship.ownerId);
	}

	private function jsShipsToHaxeGameEngineShips(ships:Array<EntityShip>) {
		return ships.map(ship -> {
			return new EngineShipEntity(ship.x, ship.y, ship.id, ship.ownerId);
		});
	}
}
