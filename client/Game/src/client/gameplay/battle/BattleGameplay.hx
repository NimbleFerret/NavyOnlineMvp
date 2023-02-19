package client.gameplay.battle;

import engine.geometry.Line;
import h2d.col.Point;
import h2d.Scene;
import hxd.Key in K;
import client.entity.ClientShell;
import client.entity.ClientShip;
import client.network.SocketProtocol;
import client.network.Socket;
import client.gameplay.BasicGameplay.GameState;
import client.manager.EffectsManager;
import engine.BaseEngine;
import engine.GameEngine;
import engine.MathUtils;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShellEntity;
import engine.entity.EngineShipEntity;
import engine.geometry.Rectangle;

enum InputType {
	Game;
	DebugCamera;
	DebugPlayerShip;
}

class BattleGameplay extends BasicGameplay {
	public static var CurrentSectorX = 0;
	public static var CurrentSectorY = 0;

	private final clientShells = new Map<String, ClientShell>();
	private final effectsManager:EffectsManager;

	// UI
	public final hud:BattleHud;
	public final waterScene:WaterScene;

	private var inputType = InputType.Game;

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
						final clientShell = new ClientShell(engineShell, ownerShip);
						clientShells.set(engineShell.id, clientShell);
						addGameEntityToScene(clientShell);

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
			gameEngine.shipShootBySide(side, shipId, true, 0, message.shotParams);
		}
	}

	// --------------------------------------
	// Singleplayer
	// --------------------------------------

	public override function startGameSingleplayer(playerId:String, entities:Array<EngineBaseGameEntity>) {
		super.startGameSingleplayer(playerId, entities);
		hud.show(true);
		// retryDialogComp.alpha = 0;
		// startGameDialogComp.alpha = 0;
	}

	// TODO rmk !!!
	public function addShipByClient(role:Role, x:Int, y:Int, size:ShipHullSize, windows:ShipWindows, cannons:ShipCannons, cannonsRange:Int, cannonsDamage:Int,
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
					scene.removeChild(shell);
					clientShells.remove(key);
				}
			}

			final playerShip = cast(getPlayerEntity(), ClientShip);

			if (playerShip != null) {
				waterScene.updatePlayerMovement(playerShip.isMoving, playerShip.isMovingForward, playerShip.localDirection, playerShip.currentSpeed);
			} else {
				waterScene.updatePlayerMovement(false);
			}

			hud.updatePlayerParams(playerShip);
		}
	}

	public function customStartGame() {
		trace('customStartGame');
		hud.show(true);
	}

	public function customInput(mousePos:Point, mouseLeft:Bool, mouseRight:Bool) {
		final leftClick = K.isPressed(K.MOUSE_LEFT);
		if (leftClick) {
			final gameEngine = cast(baseEngine, GameEngine);
			final projectedMouseCoords = mouseCoordsToCamera();
			final playerShip = cast(getPlayerEntity(), ClientShip);
			final playerShipRect = playerShip.getBodyRectangle();
			final cursorToPlayerShipLine = new Line(projectedMouseCoords.x, projectedMouseCoords.y, playerShip.x, playerShip.y);

			// TODO
			playerShip.getCannonsFiringAreaBySide(Left);

			// TODO get shooting angle for each cannon
			final leftCannonPos = playerShip.getCannonPos();

			final shootAngle = MathUtils.angleBetweenPoints(new Point(leftCannonPos.x, leftCannonPos.y),
				new Point(projectedMouseCoords.x, projectedMouseCoords.y));

			trace(MathUtils.radsToDegree(shootAngle));

			// final shootAngle = MathUtils.degreeToRads(20);

			if (playerShipRect.getLines().lineA.intersectsWithLine(cursorToPlayerShipLine)) {
				gameEngine.shipShootBySide(Left, playerEntityId, false, shootAngle);
			} else if (playerShipRect.getLines().lineC.intersectsWithLine(cursorToPlayerShipLine)) {
				// gameEngine.shipShootBySide(Right, playerEntityId, false, shootAngle);
			}
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
		final shipCannons = ShipCannons.createByIndex(message.shipCannons);

		var role = Role.Player;
		if (message.role == 'Bot') {
			role = Role.Bot;
		} else if (message.role == 'Boss') {
			role = Role.Boss;
		}

		return new EngineShipEntity('', message.free, role, message.x, message.y, shipHullSize, shipWindows, shipCannons, message.cannonsRange,
			message.cannonsDamage, message.armor, message.hull, message.maxSpeed, message.acc, message.accDelay, message.turnDelay, message.fireDelay,
			message.id, message.ownerId);
	}

	public function jsEntitiesToEngineEntities(entities:Dynamic):Array<EngineBaseGameEntity> {
		return entities.map(entity -> {
			final shipHullSize = ShipHullSize.createByIndex(entity.shipHullSize);
			final shipWindows = ShipWindows.createByIndex(entity.shipWindows);
			final shipCannons = ShipCannons.createByIndex(entity.shipCannons);

			var role = Role.Player;
			if (entity.role == 'Bot') {
				role = Role.Bot;
			} else if (entity.role == 'Boss') {
				role = Role.Boss;
			}

			return new EngineShipEntity('', entity.free, role, entity.x, entity.y, shipHullSize, shipWindows, shipCannons, entity.cannonsRange,
				entity.cannonsDamage, entity.armor, entity.hull, entity.maxSpeed, entity.acc, entity.accDelay, entity.turnDelay, entity.fireDelay, entity.id,
				entity.ownerId);
		});
	}

	private function clearObjects() {
		effectsManager.clear();
		scene.removeChildren();
	}
}
