package game.engine.navy;

import js.lib.Date;
import game.engine.base.MathUtils;
import game.engine.base.BaseTypesAndClasses;
import game.engine.base.core.BaseEngine;
import game.engine.base.core.BaseEngine.EngineGameMode;
import game.engine.base.core.BaseEngine.EngineMode;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.base.geometry.Line;
import game.engine.navy.NavyTypesAndClasses;
import game.engine.navy.entity.NavyShipEntity;
import game.engine.navy.entity.NavyShellEntity;
import game.engine.navy.entity.manager.ShipManager;
import game.engine.navy.entity.manager.ShellManager;

typedef ShipHitByShellCallbackParams = {ship:NavyShipEntity, damage:Int}
typedef CreateShellCallbackParams = {shells:Array<NavyShellEntity>, shooterId:String, side:Side, aimAngleRads:Float}

@:expose
class NavyGameEngine extends BaseEngine {
	public final shellManager = new ShellManager();

	public var createShellCallback:CreateShellCallbackParams->Void;
	public var deleteShellCallback:NavyShellEntity->Void;
	public var shipHitByShellCallback:ShipHitByShellCallbackParams->Void;

	public var enableShooting = true;
	public var enableCollisions = true;

	private var framesPassed = 0;
	private var allowShoot = false;
	private var botsAllowShoot = false;
	private var timePassed = 0.0;
	private var lastBotShootTime = 0.0;
	private final botShootDelaySeconds = 3;

	public static function main() {}

	public function new(engineMode = EngineMode.Server) {
		super(engineMode, EngineGameMode.Sea, new ShipManager());
	}

	// ------------------------------------
	// Implementation
	// ------------------------------------

	public function processInputCommands(inputs:Array<InputCommandEngineWrapped>) {
		for (i in inputs) {
			final input = cast(i.playerInputCommand, NavyInputCommand);
			final inputInitiator = input.playerId;
			final entityId = playerEntityMap.get(inputInitiator);
			final ship = cast(mainEntityManager.getEntityById(entityId), NavyShipEntity);
			if (ship == null || ship.getOwnerId() != inputInitiator) {
				continue;
			}
			switch (input.inputType) {
				case MOVE_UP:
					if (ship.accelerate())
						validatedInputCommands.push(input);
				case MOVE_DOWN:
					if (ship.decelerate())
						validatedInputCommands.push(input);
				case MOVE_LEFT:
					if (ship.rotateLeft())
						validatedInputCommands.push(input);
				case MOVE_RIGHT:
					if (ship.rotateRight())
						validatedInputCommands.push(input);
				case SHOOT:
					if (enableShooting) {
						final shootDetails = input.shootDetails;
						final side = shootDetails.side;
						if (ship != null && ship.tryShoot(side)) {
							final aimAngleRads = shootDetails.aimAngleRads;
							final shipSideRadRotation = aimAngleRads == 0 ? ship.getRotation() + MathUtils.degreeToRads(side == LEFT ? 90 : -90) : aimAngleRads;
							final shells = new Array<NavyShellEntity>();

							var cannonsTotal = 0;
							switch (ship.getShipCannons()) {
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
								final shell = addShell({
									x: cannonPosition.x,
									y: cannonPosition.y,
									ownerId: inputInitiator,
									rotation: shipSideRadRotation,
									side: side,
									pos: i,
									currentSpeed: ship.getCannonsShellSpeed(),
									damage: ship.getCannonsDamage(),
									range: ship.getCannonsRange()
								});
								shells.push(shell);
							}

							validatedInputCommands.push(input);

							if (createShellCallback != null) {
								createShellCallback({
									shells: shells,
									side: side,
									aimAngleRads: aimAngleRads,
									shooterId: inputInitiator
								});
							}
						}
					}
			}
		}
	}

	public function engineLoopUpdate(dt:Float) {
		final beginTime = Date.now();

		framesPassed++;
		timePassed += dt;

		if (engineMode == EngineMode.Server) {
			if (lastBotShootTime == 0) {
				lastBotShootTime = timePassed;
			} else if (timePassed - lastBotShootTime >= botShootDelaySeconds) {
				lastBotShootTime = timePassed;
				botsAllowShoot = true;
			}
		}

		for (ship in mainEntityManager.entities) {
			if (ship.isAlive) {
				ship.collides(false);
				ship.update(dt);

				final engineShipEntity = cast(ship, NavyShipEntity);

				if (engineShipEntity.getRole() == Role.BOT && botsAllowShoot) {
					addInputCommand(new NavyInputCommand(PlayerInputType.SHOOT, engineShipEntity.getOwnerId(), 0, {
						side: RIGHT,
						aimAngleRads: MathUtils.getGunRadByDir(engineShipEntity.getDirection())
					}));
				}

				if (enableCollisions) {
					for (ship2 in mainEntityManager.entities) {
						if (ship.getId() != ship2.getId()) {
							if (ship.getBodyRectangle().intersectsWithRect(ship2.getBodyRectangle())) {
								ship.collides(true);
								ship2.collides(true);
							}
						}
					}
				}
			}
		}

		final shipsToDelete:Array<String> = [];
		final shellsToDelete:Array<String> = [];

		for (shell in shellManager.entities) {
			shell.update(dt);
			if (shell.isAlive) {
				if (enableCollisions) {
					for (ship in mainEntityManager.entities) {
						if (shell.getOwnerId() != ship.getOwnerId() && ship.isAlive) {
							if (checkShellAndShipCollision(shell, ship)) {
								ship.collides(true);
								shell.collides(true);
								final engineShipEntity = cast(ship, NavyShipEntity);
								final engineShellEntity = cast(shell, NavyShellEntity);
								engineShipEntity.inflictDamage(engineShellEntity.getDamage());
								if (shipHitByShellCallback != null) {
									shipHitByShellCallback({ship: engineShipEntity, damage: engineShellEntity.getDamage()});
								}
								if (!engineShipEntity.isAlive) {
									engineShipEntity.killerId = shell.getOwnerId();
									shipsToDelete.push(engineShipEntity.getId());
								}
								break;
							}
						}
					}
				}
			} else {
				shellsToDelete.push(shell.getId());
			}
		}

		for (i in 0...shellsToDelete.length) {
			final shell = cast(shellManager.getEntityById(shellsToDelete[i]), NavyShellEntity);
			if (shell != null) {
				if (deleteShellCallback != null) {
					deleteShellCallback(shell);
				}
				shellManager.remove(shell.getId());
			}
		}

		for (i in 0...shipsToDelete.length) {
			final ship = cast(mainEntityManager.getEntityById(shipsToDelete[i]), NavyShipEntity);
			if (ship != null) {
				removeMainEntity(ship.getId());
			}
		}

		botsAllowShoot = false;

		recentEngineLoopTime = Date.now() - beginTime;
	}

	public function customDestroy() {
		createShellCallback = null;
		deleteShellCallback = null;
		shipHitByShellCallback = null;
		shellManager.destroy();
	}

	public function buildEngineEntity(struct:Dynamic) {
		return new NavyShipEntity(new ShipObjectEntity(struct));
	}

	// ------------------------------------

	private function checkShellAndShipCollision(shell:EngineBaseGameEntity, ship:EngineBaseGameEntity) {
		final shellLine = shell.getForwardLookingLine(15);
		if (ship.getBodyRectangle().intersectsWithPoint(shellLine.p1))
			return true;
		return ship.getBodyRectangle().intersectsWithLine(new Line(shellLine.p1.x, shellLine.p1.y, shellLine.p2.x, shellLine.p2.y));
	}

	// -------------------------------------
	// Shell game object
	// -------------------------------------

	public function addShell(entity:ShellObjectEntityStruct):NavyShellEntity {
		final newShell = new NavyShellEntity(new ShellObjectEntity(entity));
		shellManager.add(newShell);
		return newShell;
	}

	// -------------------------------------
	// Input wrappers
	// -------------------------------------

	public function applyPlayerInput(inputType:PlayerInputType, playerId:String, ?index:Int, ?shootDetails:ShootInputDetails) {
		addInputCommand(new NavyInputCommand(inputType, playerId, index, shootDetails));
	}
}
