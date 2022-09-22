package client.gameplay.battle;

import client.gameplay.BasicGameplay.GameState;
import h2d.Scene;
import hxd.Key in K;
import engine.BaseEngine;
import engine.GameEngine;
import client.entity.ClientBaseGameEntity;
import client.entity.ClientShell;
import client.entity.ClientShip;
import client.network.SocketProtocol;
import client.network.Socket;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShellEntity;
import engine.entity.EngineShipEntity;

enum InputType {
	Game;
	DebugCamera;
	DebugPlayerShip;
}

class BattleGameplay extends BasicGameplay {
	// Global config
	public static var DebugDraw = false;

	public static var CurrentSectorX = 0;
	public static var CurrentSectorY = 0;

	private final clientShells = new Map<String, ClientShell>();

	private var effectsManager:EffectsManager;
	private var inputType = InputType.Game;

	// UI
	public final hud:BattleHud;
	public final waterScene:WaterScene;

	private var leaveCallback:Void->Void;

	public function new(scene:h2d.Scene, engineMode:EngineMode, leaveCallback:Void->Void, diedCallback:Void->Void) {
		super(scene, new GameEngine(engineMode));

		this.leaveCallback = leaveCallback;

		// --------------------------------------
		// Game managers and services init
		// --------------------------------------

		final gameEngine = cast(baseEngine, GameEngine);

		gameEngine.createMainEntityCallback = function callback(engineShipEntity:EngineBaseGameEntity) {}
		gameEngine.createShellCallback = function callback(engineShellEntities:Array<EngineShellEntity>) {
			if (gameState == GameState.Playing) {
				final ownerEntity = clientMainEntities.get(engineShellEntities[0].ownerId);
				final shotParams = new Array<ShotParams>();
				if (ownerEntity != null) {
					final ownerShip = cast(ownerEntity, ClientShip);
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
				if (gameEngine.engineMode == EngineMode.Server && !engineShellEntities[0].serverSide) {
					Socket.instance.shoot({
						playerId: playerId,
						left: engineShellEntities[0].side == Side.Left ? true : false,
						shotParams: shotParams
					});
				}
				if (ownerEntity.getId() == playerEntityId) {
					// TODO update UI
				}
			}
		};

		gameEngine.deleteShellCallback = function callback(engineShellEntity:EngineShellEntity) {
			// clientShells.get(engineShellEntity.)
		};

		gameEngine.deleteMainEntityCallback = function callback(engineShipEntity:EngineBaseGameEntity) {
			if (gameState == GameState.Playing) {
				final clientEntity = clientMainEntities.get(engineShipEntity.id);
				if (clientEntity != null) {
					final clientShip = cast(clientEntity, ClientShip);

					for (i in 0...7) {
						final dirX = Std.random(2);
						final dirY = Std.random(2);
						final offsetX = Std.random(50);
						final offsetY = Std.random(50);
						effectsManager.addShipExplosion(clientShip.x + (dirX == 1 ? offsetX : -offsetX), clientShip.y + (dirY == 1 ? offsetY : -offsetY));
					}

					clientShip.clearDebugGraphics(scene);
					scene.removeChild(clientShip);

					clientMainEntities.remove(engineShipEntity.id);
					clientMainEntitiesCount--;

					if (engineShipEntity.ownerId == playerId) {
						gameState = GameState.Died;
						hud.show(false);
						hud.showDieDialog(client.Player.instance.isCurrentShipIsFree);
						clearObjects();
					}
				}
			}
		};

		gameEngine.shipHitByShellCallback = function callback(params:ShipHitByShellCallbackParams) {
			if (gameState == GameState.Playing) {
				final clientShip = clientMainEntities.get(params.ship.id);
				if (clientShip != null) {
					effectsManager.addDamageText(clientShip.x, clientShip.y, params.damage);
				}
			}
		};

		effectsManager = new EffectsManager(scene);

		// --------------------------------------
		// UI
		// --------------------------------------

		hud = new BattleHud(function callbackLeave() {
			destroy();
			Socket.instance.leaveGame({playerId: playerId});
			if (leaveCallback != null) {
				clearObjects();
				leaveCallback();
			}
		}, function callbackDied() {
			if (diedCallback != null) {
				clearObjects();
				diedCallback();
			}
		});

		waterScene = new WaterScene();

		maxDragX = 200;
		maxDragY = 200;
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

		for (entity in clientMainEntities) {
			// Draw ship rect shape
			drawDebugRect(entity);

			final ship = cast(entity, ClientShip);

			// if (ship.leftSideCanonDebugRect1 == null) {
			// 	ship.leftSideCanonDebugRect1 = new h2d.Graphics(scene);
			// } else {
			// 	ship.leftSideCanonDebugRect1.clear();
			// }

			// if (ship.leftSideCanonDebugRect2 == null) {
			// 	ship.leftSideCanonDebugRect2 = new h2d.Graphics(scene);
			// } else {
			// 	ship.leftSideCanonDebugRect2.clear();
			// }

			// if (ship.leftSideCanonDebugRect3 == null) {
			// 	ship.leftSideCanonDebugRect3 = new h2d.Graphics(scene);
			// } else {
			// 	ship.leftSideCanonDebugRect3.clear();
			// }

			// if (ship.rightSideCanonDebugRect1 == null) {
			// 	ship.rightSideCanonDebugRect1 = new h2d.Graphics(scene);
			// } else {
			// 	ship.rightSideCanonDebugRect1.clear();
			// }

			// if (ship.rightSideCanonDebugRect2 == null) {
			// 	ship.rightSideCanonDebugRect2 = new h2d.Graphics(scene);
			// } else {
			// 	ship.rightSideCanonDebugRect2.clear();
			// }

			// if (ship.rightSideCanonDebugRect3 == null) {
			// 	ship.rightSideCanonDebugRect3 = new h2d.Graphics(scene);
			// } else {
			// 	ship.rightSideCanonDebugRect3.clear();
			// }

			if (DebugDraw) {
				// Draw left side canons
				// 1
				// final leftGunPos1 = ship.getCanonOffsetBySideAndIndex(Side.Left, 0);

				// ship.leftSideCanonDebugRect1.beginFill(0x00ff00);
				// ship.leftSideCanonDebugRect1.drawRect(leftGunPos1.x, leftGunPos1.y, 10, 10);
				// ship.leftSideCanonDebugRect1.endFill();

				// // 2
				// final leftGunPos2 = ship.getCanonOffsetBySideAndIndex(Side.Left, 1);

				// ship.leftSideCanonDebugRect2.beginFill(0x00ff00);
				// ship.leftSideCanonDebugRect2.drawRect(leftGunPos2.x, leftGunPos2.y, 10, 10);
				// ship.leftSideCanonDebugRect2.endFill();

				// // 3
				// final leftGunPos3 = ship.getCanonOffsetBySideAndIndex(Side.Left, 2);

				// ship.leftSideCanonDebugRect3.beginFill(0x00ff00);
				// ship.leftSideCanonDebugRect3.drawRect(leftGunPos3.x, leftGunPos3.y, 10, 10);
				// ship.leftSideCanonDebugRect3.endFill();

				// // Draw right side canons
				// // 1
				// final rightGunPos1 = ship.getCanonOffsetBySideAndIndex(Side.Right, 0);

				// ship.rightSideCanonDebugRect1.beginFill(0x00ff00);
				// ship.rightSideCanonDebugRect1.drawRect(rightGunPos1.x, rightGunPos1.y, 10, 10);
				// ship.rightSideCanonDebugRect1.endFill();

				// // 2
				// final rightGunPos2 = ship.getCanonOffsetBySideAndIndex(Side.Right, 1);

				// ship.rightSideCanonDebugRect2.beginFill(0x00ff00);
				// ship.rightSideCanonDebugRect2.drawRect(rightGunPos2.x, rightGunPos2.y, 10, 10);
				// ship.rightSideCanonDebugRect2.endFill();

				// // 3
				// final rightGunPos3 = ship.getCanonOffsetBySideAndIndex(Side.Right, 2);

				// ship.rightSideCanonDebugRect3.beginFill(0x00ff00);
				// ship.rightSideCanonDebugRect3.drawRect(rightGunPos3.x, rightGunPos3.y, 10, 10);
				// ship.rightSideCanonDebugRect3.endFill();
			}
		}

		for (shell in clientShells) {
			drawDebugRect(shell);
		}
	}

	// --------------------------------------
	// Multiplayer
	// --------------------------------------

	public function updateDailyTasks() {
		hud.updateDailyTasks();
	}

	public function dailyTaskComplete(message:SocketServerDailyTaskComplete) {
		hud.dailyTaskComplete(message);
	}

	public function shipShoot(message:SocketServerMessageShipShoot) {
		if (gameState == GameState.Playing && playerId != message.playerId) {
			final side = message.left ? Side.Left : Side.Right;
			final gameEngine = cast(baseEngine, GameEngine);
			final shipId = gameEngine.getMainEntityIdByOwnerId(message.playerId);
			gameEngine.shipShootBySide(side, shipId, message.shotParams);
		}
	}

	// --------------------------------------
	// Single player
	// --------------------------------------

	public function startGameByClient(playerId:String, ships:Array<EngineShipEntity>) {
		if (gameState == GameState.Init) {
			for (ship in ships) {
				final newClientShip = new ClientShip(scene, ship);
				clientMainEntities.set(ship.id, newClientShip);

				if (ship.ownerId == playerId) {
					playerEntityId = ship.id;
				}
			}
			this.playerId = playerId;
			gameState = GameState.Playing;

			hud.show(true);
			// retryDialogComp.alpha = 0;
			// startGameDialogComp.alpha = 0;
		}
	}

	public function addShipByClient(role:Role, x:Int, y:Int, size:ShipHullSize, windows:ShipWindows, cannons:ShipGuns, cannonsRange:Int, cannonsDamage:Int,
			armor:Int, hull:Int, maxSpeed:Int, acc:Int, accDelay:Float, turnDelay:Float, fireDelay:Float, shipId:String, ?ownerId:String) {
		final gameEngine = cast(baseEngine, GameEngine);
		return gameEngine.createEntity('', true, role, x, y, size, windows, cannons, cannonsRange, cannonsDamage, armor, hull, maxSpeed, acc, accDelay,
			turnDelay, fireDelay, shipId, ownerId);
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public function customUpdate(dt:Float, fps:Float) {
		hud.update(dt);
		waterScene.update(dt);

		if (gameState == GameState.Playing) {
			hud.updateSystemInfo(fps);

			effectsManager.update();

			updateInput();

			for (ship in baseEngine.getMainEntities()) {
				if (clientMainEntities.exists(ship.id)) {
					final clientShip = clientMainEntities.get(ship.id);
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

			final playerShip = cast(getPlayerEntity(), ClientShip);

			if (playerShip != null) {
				waterScene.updatePlayerMovement(playerShip.isMoving, playerShip.isMovingForward, playerShip.direction, playerShip.currentSpeed);
			} else {
				waterScene.updatePlayerMovement(false);
			}

			hud.updatePlayerParams(playerShip);
		}
	}

	public function customStartGame() {
		hud.show(true);
	}

	public function customInput() {
		final q = K.isDown(K.Q);
		final e = K.isDown(K.E);
		if (q || e) {
			final gameEngine = cast(baseEngine, GameEngine);
			if (q)
				gameEngine.shipShootBySide(Side.Left, playerEntityId, false);
			if (e)
				gameEngine.shipShootBySide(Side.Right, playerEntityId, false);
		}
	}

	public function customUpdateWorldState() {
		// if (clientShipStats.currentHull != ship.currentHull || clientShipStats.currentArmor != ship.currentArmor) {
		// 	clientShip.updateHullAndArmor(ship.currentHull, ship.currentArmor);
		// 	if (ship.currentHull == 0 && clientShipStats.currentHull != 0) {
		// 		gameEngine.removeMainEntity(ship.id);
		// 	}
		// }
	}

	public function customSync() {
		// clientShip.updateHullAndArmor(ship.currentHull, ship.currentArmor);
	}

	// Utils

	public function jsEntityToEngineEntity(message:Dynamic):EngineBaseGameEntity {
		final shipHullSize = ShipHullSize.createByIndex(message.shipHullSize);
		final shipWindows = ShipWindows.createByIndex(message.shipWindows);
		final shipGuns = ShipGuns.createByIndex(message.shipGuns);

		var role = Role.Player;
		if (message.role == 'Bot') {
			role = Role.Bot;
		} else if (message.role == 'Boss') {
			role = Role.Boss;
		}

		return new EngineShipEntity('', message.free, role, message.x, message.y, shipHullSize, shipWindows, shipGuns, message.cannonsRange,
			message.cannonsDamage, message.armor, message.hull, message.maxSpeed, message.acc, message.accDelay, message.turnDelay, message.fireDelay,
			message.id, message.ownerId);
	}

	public function jsEntitiesToEngineEntities(entities:Dynamic):Array<EngineBaseGameEntity> {
		return entities.map(entity -> {
			final shipHullSize = ShipHullSize.createByIndex(entity.shipHullSize);
			final shipWindows = ShipWindows.createByIndex(entity.shipWindows);
			final shipGuns = ShipGuns.createByIndex(entity.shipGuns);

			var role = Role.Player;
			if (entity.role == 'Bot') {
				role = Role.Bot;
			} else if (entity.role == 'Boss') {
				role = Role.Boss;
			}

			return new EngineShipEntity('', entity.free, role, entity.x, entity.y, shipHullSize, shipWindows, shipGuns, entity.cannonsRange,
				entity.cannonsDamage, entity.armor, entity.hull, entity.maxSpeed, entity.acc, entity.accDelay, entity.turnDelay, entity.fireDelay, entity.id,
				entity.ownerId);
		});
	}

	private function clearObjects() {
		effectsManager.clear();
		scene.removeChildren();
	}
}
