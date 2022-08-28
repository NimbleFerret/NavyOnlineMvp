package engine;

import engine.entity.EngineBaseGameEntity.Side;
import engine.entity.EngineShipEntity;
import engine.entity.EngineShellEntity;
import engine.entity.manager.ShipManager;
import engine.entity.manager.ShellManager;
import engine.GameLoop;
import engine.MathUtils;
import uuid.Uuid;

typedef ShipShitByShellCallbackParams = {ship:EngineShipEntity, damage:Int}

// TODO oprimize casts

enum EngineMode {
	Client;
	Server;
}

@:expose
class GameEngine {
	final gameLoop:GameLoop;

	public var tick:Int;

	public final engineMode:EngineMode;
	public final shipManager:ShipManager;
	public final shellManager:ShellManager;

	// TODO use setter ?
	// TODO add more tick params
	public var tickCallback:Void->Void;
	public var createShipCallback:EngineShipEntity->Void;
	public var createShellCallback:Array<EngineShellEntity>->Void;
	public var deleteShellCallback:EngineShellEntity->Void;
	public var deleteShipCallback:EngineShipEntity->Void;
	public var shipHitByShellCallback:ShipShitByShellCallbackParams->Void;

	private final playerShipMap = new Map<String, String>();

	public static function main() {}

	public static function GenerateId() {
		return Uuid.short();
	}

	var allowShoot = false;
	var framesPassed = 0;

	public function new(engineMode = EngineMode.Server) {
		this.engineMode = engineMode;
		shipManager = new ShipManager();
		shellManager = new ShellManager();

		gameLoop = new GameLoop(function loop(dt:Float, tick:Int) {
			this.tick = tick;

			framesPassed++;

			for (ship in shipManager.entities) {
				if (ship.isAlive) {
					ship.collides(false);
					ship.update(dt);

					final engineShipEntity = cast(ship, EngineShipEntity);

					if (framesPassed == 50) {
						engineShipEntity.allowShoot = true;
					}

					if (engineShipEntity.role == Role.Bot && engineShipEntity.allowShoot) {
						engineShipEntity.allowShoot = false;
						shipShootBySide(Side.Right, engineShipEntity.id);
					}
					for (ship2 in shipManager.entities) {
						if (ship.id != ship2.id) {
							if (ship.getGameRect().intersectsWithRect(ship2.getGameRect())) {
								ship.collides(true);
								ship2.collides(true);
							}
						}
					}
				}

				// Shit code
				if (framesPassed > 50) {
					framesPassed = 0;
				}
			}

			final shipsToDelete:Array<String> = [];
			final shellsToDelete:Array<String> = [];

			for (shell in shellManager.entities) {
				shell.update(dt);
				for (ship in shipManager.entities) {
					if (shell.ownerId != ship.id) {
						if (shell.getGameRect().intersectsWithRect(ship.getGameRect()) && ship.isAlive) {
							ship.collides(true);
							shell.collides(true);
							final engineShipEntity = cast(ship, EngineShipEntity);
							final engineShellEntity = cast(shell, EngineShellEntity);
							engineShipEntity.inflictDamage(engineShellEntity.baseDamage);
							if (shipHitByShellCallback != null) {
								shipHitByShellCallback({ship: engineShipEntity, damage: engineShellEntity.baseDamage});
							}
							if (!engineShipEntity.isAlive) {
								shipsToDelete.push(engineShipEntity.id);
							}
						}
					}
				}
				if (!shell.isAlive) {
					shellsToDelete.push(shell.id);
				}
			}

			for (i in 0...shellsToDelete.length) {
				var shell = cast(shellManager.getEntityById(shellsToDelete[i]), EngineShellEntity);
				if (shell != null) {
					if (deleteShellCallback != null) {
						deleteShellCallback(shell);
					}
					shellManager.remove(shell.id);
				}
			}

			for (i in 0...shipsToDelete.length) {
				var ship = cast(shipManager.getEntityById(shipsToDelete[i]), EngineShipEntity);
				if (ship != null) {
					removeShip(ship.id);
				}
			}

			if (tickCallback != null) {
				tickCallback();
			}
		});
	}

	public function destroy() {
		gameLoop.stopLoop();
		shipManager.destroy();
		shellManager.destroy();

		tickCallback = null;
		createShipCallback = null;
		createShellCallback = null;
		deleteShellCallback = null;
		deleteShipCallback = null;
		shipHitByShellCallback = null;
	}

	// -------------------------------------
	// Ship game object
	// --------------------------------------
	// TODO divide by client and server parts
	// Add existing ship
	public function addShip(ship:EngineShipEntity) {
		shipManager.add(ship);
		playerShipMap.set(ship.ownerId, ship.id);
	}

	// Create a new ship
	public function createShip(role:Role, x:Float, y:Float, ?id:String, ?ownerId:String):EngineShipEntity {
		final newShip = new EngineShipEntity(role, x, y, id, ownerId);
		shipManager.add(newShip);
		if (createShipCallback != null) {
			createShipCallback(newShip);
		}
		playerShipMap.set(newShip.ownerId, newShip.id);
		return newShip;
	}

	public function getShipById(id:String) {
		return shipManager.getEntityById(id);
	}

	// TODO ship by owner is not clear because each game object has an owner
	public function getShipIdByOwnerId(id:String) {
		return playerShipMap.get(id);
	}

	public function getShipByOwnerId(id:String) {
		return shipManager.getEntityById(playerShipMap.get(id));
	}

	public function getShips() {
		return shipManager.entities;
	}

	public function removeShip(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			if (deleteShipCallback != null) {
				deleteShipCallback(ship);
			}
			playerShipMap.remove(ship.ownerId);
			shipManager.remove(shipId);
		}
	}

	public function shipAccelerate(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			return ship.accelerate();
		} else {
			return false;
		}
	}

	public function shipDecelerate(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			return ship.decelerate();
		} else {
			return false;
		}
	}

	public function shipRotateLeft(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			return ship.rotateLeft();
		} else {
			return false;
		}
	}

	public function shipRotateRight(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			return ship.rotateRight();
		} else {
			return false;
		}
	}

	// Pass an array of shoot rnd
	public function shipShootBySide(side:Side, shipId:String, serverSide:Bool = true, ?shellRnd:Array<ShellRnd>) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null && ship.tryShoot(side)) {
			final shipSideRadRotation = ship.rotation + MathUtils.degreeToRads(side == Left ? -90 : 90);

			// TODO double check ship guns
			final pos1 = ship.getCanonOffsetBySideAndIndex(side, 0);
			final pos2 = ship.getCanonOffsetBySideAndIndex(side, 1);
			final pos3 = ship.getCanonOffsetBySideAndIndex(side, 2);

			final shell1 = addShell(side, 0, pos1.x, pos1.y, shipSideRadRotation, ship.id, (shellRnd != null && shellRnd[0] != null) ? shellRnd[0] : null);
			final shell2 = addShell(side, 1, pos2.x, pos2.y, shipSideRadRotation, ship.id, (shellRnd != null && shellRnd[1] != null) ? shellRnd[1] : null);
			final shell3 = addShell(side, 2, pos3.x, pos3.y, shipSideRadRotation, ship.id, (shellRnd != null && shellRnd[2] != null) ? shellRnd[2] : null);

			shell1.serverSide = serverSide;
			shell2.serverSide = serverSide;
			shell3.serverSide = serverSide;

			if (createShellCallback != null) {
				createShellCallback([shell1, shell2, shell3]);
			}

			return true;
		} else {
			return false;
		}
	}

	// -------------------------------------
	// Shell game object
	// --------------------------------------

	public function addShell(side:Side, pos:Int, x:Float, y:Float, rotation:Float, ownerId:String, ?shellRnd:ShellRnd):EngineShellEntity {
		final newShell = new EngineShellEntity(side, pos, x, y, rotation, ownerId, shellRnd);
		shellManager.add(newShell);
		return newShell;
	}
}
