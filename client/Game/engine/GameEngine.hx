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

@:expose
class GameEngine {
	final gameLoop:GameLoop;

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

	public static function main() {}

	public static function GenerateId() {
		return Uuid.short();
	}

	var allowShoot = false;
	var framesPassed = 0;

	public function new() {
		shipManager = new ShipManager();
		shellManager = new ShellManager();

		gameLoop = new GameLoop(function loop(dt:Float, tick:Int) {
			framesPassed++;
			if (framesPassed == 50) {
				allowShoot = true;
			}
			for (ship in shipManager.entities) {
				if (ship.isAlive) {
					ship.collides(false);
					ship.update(dt);
					if (ship.id == "2" && allowShoot) {
						allowShoot = false;
						framesPassed = 0;
						shipShootBySide(Side.Right, "2");
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
					if (deleteShipCallback != null) {
						deleteShipCallback(ship);
					}
					shipManager.remove(ship.id);
				}
			}

			if (tickCallback != null) {
				tickCallback();
			}
		});
	}

	// -------------------------------------
	// Ship game object
	// --------------------------------------

	@:expose
	public function addShip(x:Float, y:Float, ?id:String):EngineShipEntity {
		final newShip = new EngineShipEntity(x, y, id);
		shipManager.add(newShip);
		if (createShipCallback != null) {
			createShipCallback(newShip);
		}
		return newShip;
	}

	public function getShipById(id:String) {
		return shipManager.getEntityById(id);
	}

	public function getShips() {
		return shipManager.entities;
	}

	public function removeShip() {}

	public function shipAccelerate(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			ship.accelerate();
		}
	}

	public function shipDecelerate(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			ship.decelerate();
		}
	}

	public function shipRotateLeft(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			ship.rotateLeft();
		}
	}

	public function shipRotateRight(shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			ship.rotateRight();
		}
	}

	public function shipShootBySide(side:Side, shipId:String) {
		final ship = cast(shipManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null) {
			final shipSideRadRotation = ship.rotation + MathUtils.degreeToRads(side == Left ? -90 : 90);
			final pos1 = ship.getCanonOffsetBySideAndIndex(side, 0);
			// final pos2 = ship.getCanonOffsetBySideAndIndex(side, 1);
			// final pos3 = ship.getCanonOffsetBySideAndIndex(side, 2);
			final shell1 = addShell(side, 0, pos1.x, pos1.y, shipSideRadRotation, ship.id);
			// final shell2 = addShell(side, 1, pos2.x, pos2.y, shipSideRadRotation, ship.id);
			// final shell3 = addShell(side, 2, pos3.x, pos3.y, shipSideRadRotation, ship.id);
			if (createShellCallback != null) {
				createShellCallback([shell1]);
				// createShellCallback([shell1, shell2, shell3]);
			}
		}
	}

	// -------------------------------------
	// Shell game object
	// --------------------------------------
	public function addShell(side:Side, pos:Int, x:Float, y:Float, rotation:Float, ownerId:String):EngineShellEntity {
		final newShell = new EngineShellEntity(side, pos, x, y, rotation, ownerId);
		shellManager.add(newShell);
		return newShell;
	}
}
