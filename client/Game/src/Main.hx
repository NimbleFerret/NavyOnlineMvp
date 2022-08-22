import h3d.Engine;
import hxd.Key in K;
import hxd.Timer;
import client.GuiApp;
import client.Hud;
import client.IslandsManager;
import client.EffectsManager;
import client.entity.ClientBaseGameEntity;
import client.entity.ClientShell;
import client.entity.ClientShip;
import engine.GameEngine;
import engine.entity.EngineBaseGameEntity.Side;
import engine.entity.EngineShellEntity;
import engine.entity.EngineShipEntity;

// import hxd.Math;

interface Updatable {
	public function update(dt:Float):Void;
}

enum InputType {
	Game;
	DebugCamera;
	DebugPlayerShip;
}

class Main extends GuiApp {
	// TODO add entity manager
	public static var DebugDraw = true;

	var gameEngine:GameEngine;

	final clientShips:Map<String, ClientShip> = [];
	final clientShells:Map<String, ClientShell> = [];

	var playerShipId:String;

	var effectsManager:EffectsManager;
	var islandsManager:IslandsManager;
	var hud:Hud;
	var inputType = InputType.Game;

	override function init() {
		super.init();

		engine.backgroundColor = 0x6BC2EE;

		// --------------------------------------
		// Game managers and services init
		// --------------------------------------

		gameEngine = new GameEngine();
		gameEngine.createShellCallback = function callback(engineShellEntities:Array<EngineShellEntity>) {
			final ownerShip = clientShips.get(engineShellEntities[0].ownerId);
			if (ownerShip != null) {
				for (engineShell in engineShellEntities) {
					final clientShell = new ClientShell(s2d, engineShell, ownerShip);
					clientShells.set(engineShell.id, clientShell);
				}
			}
		};
		gameEngine.deleteShellCallback = function callback(engineShellEntity:EngineShellEntity) {
			// clientShells.get(engineShellEntity.)
		};
		gameEngine.deleteShipCallback = function callback(engineShipEntity:EngineShipEntity) {
			// clientShells.get(engineShellEntity.)
			trace("Ship");
		};
		gameEngine.shipHitByShellCallback = function callback(params:ShipShitByShellCallbackParams) {
			final clientShip = clientShips.get(params.ship.id);
			if (clientShip != null) {
				effectsManager.addDamageText(clientShip.x, clientShip.y, params.damage);
			}
		};

		effectsManager = new EffectsManager(s2d);
		islandsManager = new IslandsManager(s2d);

		// --------------------------------------
		// UI init
		// --------------------------------------

		s2d.camera.setViewport(engine.width / 2, engine.height / 2, 0, 0);

		hud = new Hud();
		sevents.addScene(hud);

		hud.addChoice("Debug1211", ["Off", "On"], function(i) {
			switch (i) {
				case 0:
					Main.DebugDraw = false;
				case 1:
					Main.DebugDraw = true;
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

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		final newEngineShip = gameEngine.addShip(100, 100, "1");
		final newClientShip = new ClientShip(s2d, newEngineShip);
		clientShips.set(newEngineShip.id, newClientShip);
		playerShipId = newEngineShip.id;

		final newEngineShip2 = gameEngine.addShip(100, -200, "2");
		final newClientShip2 = new ClientShip(s2d, newEngineShip2);
		clientShips.set(newEngineShip2.id, newClientShip2);
	}

	override function render(e:Engine) {
		hud.render(e);
		s2d.render(e);
		debugDraw();
	}

	function debugDraw() {
		function drawDebugRect(entity:ClientBaseGameEntity) {
			if (entity.debugRect == null) {
				entity.debugRect = new h2d.Graphics(s2d);
			}
			if (entity.debugRect != null) {
				entity.debugRect.clear();
			}

			if (Main.DebugDraw) {
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

			if (Main.DebugDraw) {
				// Draw left side canons
				// 1
				if (ship.serverSideLeftCanonDebugRect1 == null) {
					ship.serverSideLeftCanonDebugRect1 = new h2d.Graphics(s2d);
				} else {
					ship.serverSideLeftCanonDebugRect1.clear();
				}

				final leftGunPos1 = ship.getCanonOffsetBySideAndIndex(Side.Left, 0);

				ship.serverSideLeftCanonDebugRect1.beginFill(0x00ff00);
				ship.serverSideLeftCanonDebugRect1.drawRect(leftGunPos1.x, leftGunPos1.y, 10, 10);
				ship.serverSideLeftCanonDebugRect1.endFill();

				// 2
				if (ship.serverSideLeftCanonDebugRect2 == null) {
					ship.serverSideLeftCanonDebugRect2 = new h2d.Graphics(s2d);
				} else {
					ship.serverSideLeftCanonDebugRect2.clear();
				}

				final leftGunPos2 = ship.getCanonOffsetBySideAndIndex(Side.Left, 1);

				ship.serverSideLeftCanonDebugRect2.beginFill(0x00ff00);
				ship.serverSideLeftCanonDebugRect2.drawRect(leftGunPos2.x, leftGunPos2.y, 10, 10);
				ship.serverSideLeftCanonDebugRect2.endFill();

				// 3
				if (ship.serverSideLeftCanonDebugRect3 == null) {
					ship.serverSideLeftCanonDebugRect3 = new h2d.Graphics(s2d);
				} else {
					ship.serverSideLeftCanonDebugRect3.clear();
				}

				final leftGunPos3 = ship.getCanonOffsetBySideAndIndex(Side.Left, 2);

				ship.serverSideLeftCanonDebugRect3.beginFill(0x00ff00);
				ship.serverSideLeftCanonDebugRect3.drawRect(leftGunPos3.x, leftGunPos3.y, 10, 10);
				ship.serverSideLeftCanonDebugRect3.endFill();

				// Draw right side canons
				// 1
				if (ship.serverSideRightCanonDebugRect1 == null) {
					ship.serverSideRightCanonDebugRect1 = new h2d.Graphics(s2d);
				} else {
					ship.serverSideRightCanonDebugRect1.clear();
				}

				final rightGunPos1 = ship.getCanonOffsetBySideAndIndex(Side.Right, 0);

				ship.serverSideRightCanonDebugRect1.beginFill(0x00ff00);
				ship.serverSideRightCanonDebugRect1.drawRect(rightGunPos1.x, rightGunPos1.y, 10, 10);
				ship.serverSideRightCanonDebugRect1.endFill();

				// 2
				if (ship.serverSideRightCanonDebugRect2 == null) {
					ship.serverSideRightCanonDebugRect2 = new h2d.Graphics(s2d);
				} else {
					ship.serverSideRightCanonDebugRect2.clear();
				}

				final rightGunPos2 = ship.getCanonOffsetBySideAndIndex(Side.Right, 1);

				ship.serverSideRightCanonDebugRect2.beginFill(0x00ff00);
				ship.serverSideRightCanonDebugRect2.drawRect(rightGunPos2.x, rightGunPos2.y, 10, 10);
				ship.serverSideRightCanonDebugRect2.endFill();

				// 3
				if (ship.serverSideRightCanonDebugRect3 == null) {
					ship.serverSideRightCanonDebugRect3 = new h2d.Graphics(s2d);
				} else {
					ship.serverSideRightCanonDebugRect3.clear();
				}

				final rightGunPos3 = ship.getCanonOffsetBySideAndIndex(Side.Right, 2);

				ship.serverSideRightCanonDebugRect3.beginFill(0x00ff00);
				ship.serverSideRightCanonDebugRect3.drawRect(rightGunPos3.x, rightGunPos3.y, 10, 10);
				ship.serverSideRightCanonDebugRect3.endFill();
			}
		}

		for (shell in clientShells) {
			drawDebugRect(shell);
		}
	}

	override function update(dt:Float) {
		hud.update(dt);
		hud.updateSystemInfo(engine.fps);

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
					s2d.removeChild(shell.debugRect);
				}
				s2d.removeChild(shell);
				clientShells.remove(key);
			}
		}

		if (inputType == InputType.Game) {
			final playerShip = getPlayerShip();
			if (playerShip != null) {
				hud.updatePlayerParams(playerShip);
				s2d.camera.x = hxd.Math.lerp(s2d.camera.x, playerShip.x, 0.1);
				s2d.camera.y = hxd.Math.lerp(s2d.camera.y, playerShip.y, 0.1);
			}
		}
	}

	function fixedUpdate(dt:Float) {
		// for (ship in ships) {
		// 	ship.collides(false);
		// 	ship.fixedUpdate(dt);

		// 	for (ship2 in ships) {
		// 		if (ship.id != ship2.id) {
		// 			// TODO add distance check
		// 			if (ship.getRect().intersectsWithRect(ship2.getRect())) {
		// 				ship.collides(true);
		// 				ship2.collides(true);
		// 			}
		// 		}
		// 	}
		// }

		// final shellsToDelete:Array<Int> = [];
		// for (shell in shells) {
		// 	shell.fixedUpdate(dt);

		// 	for (ship in ships) {
		// 		if (shell.ownerId != ship.id) {
		// 			// TODO add distance check
		// 			if (shell.getRect().intersectsWithRect(ship.getRect())) {
		// 				ship.collides(true);
		// 				shell.collides(true);
		// 			}
		// 		}
		// 	}

		// 	if (!shell.alive) {
		// 		shellsToDelete.push(shell.id);
		// 	}
		// }

		// for (i in 0...shellsToDelete.length) {
		// 	final shell = shells.get(shellsToDelete[i]);
		// 	if (shell.dieEffect == DieEffect.Splash) {
		// 		effectsManager.addSplash(shell.x, shell.y);
		// 	} else if (shell.dieEffect == DieEffect.Explosion) {
		// 		effectsManager.addExplosion(shell.x, shell.y);
		// 	}
		// 	if (shell.debugRect != null) {
		// 		shell.debugRect.clear();
		// 	}
		// 	s2d.removeChild(shell);
		// 	shells.remove(shellsToDelete[i]);
		// }
	}

	function getPlayerShip() {
		return clientShips.get(playerShipId);
	}

	// Move to input file
	// TODO move delay logic into the engine
	var timeSinceLastShipsPosUpdate = 0.0;
	var lastMovementInputCheck = 0.0;
	var inputMovementCheckDelayMS = 1.0;
	var lastShootInputCheck = 0.0;
	var inputShootCheckDelayMS = 0.200;

	function updateInput() {
		final now = Timer.lastTimeStamp;

		final c = s2d.camera;

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
						// TODO direct input only for standalone mode
						if (up)
							gameEngine.shipAccelerate(playerShipId);
						if (down)
							gameEngine.shipDecelerate(playerShipId);
						if (left)
							gameEngine.shipRotateLeft(playerShipId);
						if (right)
							gameEngine.shipRotateRight(playerShipId);
					}
				if (q || e)
					if (lastShootInputCheck == 0 || lastShootInputCheck + inputShootCheckDelayMS < now) {
						lastShootInputCheck = now;
						if (q)
							gameEngine.shipShootBySide(Side.Left, playerShipId);
						if (e)
							gameEngine.shipShootBySide(Side.Right, playerShipId);
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

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
