package engine;

import engine.BaseEngine;
import engine.MathUtils;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineBaseGameEntity.Side;
import engine.entity.EngineShipEntity;
import engine.entity.EngineShellEntity;
import engine.entity.manager.ShipManager;
import engine.entity.manager.ShellManager;

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
					shipShootBySide(Side.Right, engineShipEntity.id, 0);
				}
				for (ship2 in mainEntityManager.entities) {
					if (ship.id != ship2.id) {
						if (ship.getBodyRectangle().intersectsWithRect(ship2.getBodyRectangle())) {
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
					if (shell.getBodyRectangle().intersectsWithRect(ship.getBodyRectangle()) && ship.isAlive) {
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

	// TODO pass dir parameter here
	public function createEntity(serverShipRef:String, free:Bool, role:Role, x:Float, y:Float, size:ShipHullSize, windows:ShipWindows, cannons:ShipCannons,
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

	public function shipShootBySide(side:Side, shipId:String, serverSide:Bool = true, aimAngleRads:Float, ?shellRnd:Array<ShellRnd>) {
		final ship = cast(mainEntityManager.getEntityById(shipId), EngineShipEntity);
		if (ship != null && ship.tryShoot(side)) {
			final shipSideRadRotation = aimAngleRads == 0 ? ship.rotation + MathUtils.degreeToRads(side == Left ? -90 : 90) : aimAngleRads;
			final shells = new Array<EngineShellEntity>();

			var cannonsTotal = 0;
			switch (ship.shipCannons) {
				case ONE:
					cannonsTotal = 1;
				case TWO:
					cannonsTotal = 2;
				case THREE:
					cannonsTotal = 3;
				case FOUR:
					cannonsTotal = 4;
				case _:
			}

			for (i in 0...cannonsTotal) {
				final cannonPosition = ship.getCannonPositionBySideAndIndex(side, i);
				final shell = addShell(side, i, cannonPosition.x, cannonPosition.y, ship.cannonsDamage, ship.cannonsRange, shipSideRadRotation, ship.id,
					(shellRnd != null && shellRnd[i] != null) ? shellRnd[i] : null);
				shell.serverSide = serverSide;
				shells.push(shell);
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
