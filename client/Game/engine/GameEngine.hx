package engine;

import client.entity.ship.ShipGun;
import engine.BaseEngine;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineBaseGameEntity.Side;
import engine.entity.EngineShipEntity;
import engine.entity.EngineShellEntity;
import engine.entity.manager.ShipManager;
import engine.entity.manager.ShellManager;
import engine.MathUtils;

typedef ShipHitByShellCallbackParams = {ship:EngineShipEntity, damage:Int}

@:expose
class GameEngine extends BaseEngine {
	public final shellManager = new ShellManager();

	public var createShellCallback:Array<EngineShellEntity>->Void;
	public var deleteShellCallback:EngineShellEntity->Void;
	public var shipHitByShellCallback:ShipHitByShellCallbackParams->Void;

	public static function main() {}

	var allowShoot = false;
	var framesPassed = 0;

	public function new(engineMode = EngineMode.Server) {
		super(engineMode, GameEntityType.Ship, new ShipManager());
	}

	public function engineLoopUpdate(dt:Float) {
		framesPassed++;

		for (ship in mainEntityManager.entities) {
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
				for (ship2 in mainEntityManager.entities) {
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
			for (ship in mainEntityManager.entities) {
				if (shell.ownerId != ship.id) {
					if (shell.getGameRect().intersectsWithRect(ship.getGameRect()) && ship.isAlive) {
						ship.collides(true);
						shell.collides(true);
						final engineShipEntity = cast(ship, EngineShipEntity);
						final engineShellEntity = cast(shell, EngineShellEntity);
						engineShipEntity.inflictDamage(engineShellEntity.damage);
						if (shipHitByShellCallback != null) {
							shipHitByShellCallback({ship: engineShipEntity, damage: engineShellEntity.damage});
						}
						if (!engineShipEntity.isAlive) {
							engineShipEntity.killerId = shell.ownerId;
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
			final shell = cast(shellManager.getEntityById(shellsToDelete[i]), EngineShellEntity);
			if (shell != null) {
				if (deleteShellCallback != null) {
					deleteShellCallback(shell);
				}
				shellManager.remove(shell.id);
			}
		}

		for (i in 0...shipsToDelete.length) {
			final ship = cast(mainEntityManager.getEntityById(shipsToDelete[i]), EngineShipEntity);
			if (ship != null) {
				removeMainEntity(ship.id);
			}
		}
	}

	public function customDelete() {
		createShellCallback = null;
		deleteShellCallback = null;
		shipHitByShellCallback = null;
	}

	public function createEntity(serverShipRef:String, free:Bool, role:Role, x:Float, y:Float, size:ShipHullSize, windows:ShipWindows, cannons:ShipGuns,
			cannonsRange:Int, cannonsDamage:Int, armor:Int, hull:Int, maxSpeed:Int, acc:Int, accDelay:Float, turnDelay:Float, fireDelay:Float, id:String,
			?ownerId:String) {
		final entity = new EngineShipEntity(serverShipRef, free, role, x, y, size, windows, cannons, cannonsRange, cannonsDamage, armor, hull, maxSpeed, acc,
			accDelay, turnDelay, fireDelay, id, ownerId);
		createMainEntity(entity, true);
		return entity;
	}

	public function entityMoveUp(id:String) {
		final ship = cast(mainEntityManager.getEntityById(id), EngineShipEntity);
		if (ship != null) {
			return ship.accelerate();
		} else {
			return false;
		}
	}

	public function entityMoveDown(id:String) {
		final ship = cast(mainEntityManager.getEntityById(id), EngineShipEntity);
		if (ship != null) {
			return ship.decelerate();
		} else {
			return false;
		}
	}

	public function entityMoveLeft(id:String) {
		final ship = cast(mainEntityManager.getEntityById(id), EngineShipEntity);
		if (ship != null) {
			return ship.rotateLeft();
		} else {
			return false;
		}
	}

	public function entityMoveRight(id:String) {
		final ship = cast(mainEntityManager.getEntityById(id), EngineShipEntity);
		if (ship != null) {
			return ship.rotateRight();
		} else {
			return false;
		}
	}

	// Pass an array of shoot rnd
	public function shipShootBySide(side:Side, shipId:String, serverSide:Bool = true, ?shellRnd:Array<ShellRnd>) {
		final ship = cast(mainEntityManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null && ship.tryShoot(side)) {
			final shipSideRadRotation = ship.rotation + MathUtils.degreeToRads(side == Left ? -90 : 90);

			final pos1 = ship.getCanonOffsetBySideAndIndex(side, 0);
			final shell1 = addShell(side, 0, pos1.x, pos1.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
				(shellRnd != null && shellRnd[0] != null) ? shellRnd[0] : null);
			shell1.serverSide = serverSide;

			final shells = [shell1];

			if (ship.shipGuns == ShipGuns.TWO) {
				final pos2 = ship.getCanonOffsetBySideAndIndex(side, 1);
				final shell2 = addShell(side, 1, pos2.x, pos2.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[1] != null) ? shellRnd[1] : null);
				shell2.serverSide = serverSide;
				shells.push(shell2);
			}
			if (ship.shipGuns == ShipGuns.THREE) {
				final pos2 = ship.getCanonOffsetBySideAndIndex(side, 1);
				final pos3 = ship.getCanonOffsetBySideAndIndex(side, 2);

				final shell2 = addShell(side, 1, pos2.x, pos2.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[1] != null) ? shellRnd[1] : null);
				final shell3 = addShell(side, 2, pos3.x, pos3.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[2] != null) ? shellRnd[2] : null);

				shell2.serverSide = serverSide;
				shell3.serverSide = serverSide;

				shells.push(shell2);
				shells.push(shell3);
			}
			if (ship.shipGuns == ShipGuns.FOUR) {
				final pos2 = ship.getCanonOffsetBySideAndIndex(side, 1);
				final pos3 = ship.getCanonOffsetBySideAndIndex(side, 2);
				final pos4 = ship.getCanonOffsetBySideAndIndex(side, 3);

				final shell2 = addShell(side, 1, pos2.x, pos2.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[1] != null) ? shellRnd[1] : null);
				final shell3 = addShell(side, 2, pos3.x, pos3.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[2] != null) ? shellRnd[2] : null);
				final shell4 = addShell(side, 3, pos4.x, pos4.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[3] != null) ? shellRnd[3] : null);

				shell2.serverSide = serverSide;
				shell3.serverSide = serverSide;
				shell4.serverSide = serverSide;

				shells.push(shell2);
				shells.push(shell3);
				shells.push(shell4);
			}

			if (createShellCallback != null) {
				createShellCallback(shells);
			}

			return true;
		} else {
			return false;
		}
	}

	// -------------------------------------
	// Shell game object
	// --------------------------------------

	public function addShell(side:Side, pos:Int, x:Float, y:Float, damage:Int, range:Int, rotation:Float, ownerId:String,
			?shellRnd:ShellRnd):EngineShellEntity {
		final newShell = new EngineShellEntity(side, pos, x, y, rotation, damage, range, ownerId, shellRnd);
		shellManager.add(newShell);
		return newShell;
	}
}
