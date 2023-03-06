package game.engine;

import game.engine.BaseEngine.PlayerInputCommandEngineWrapped;
import game.engine.BaseEngine.EngineGameMode;
import game.engine.BaseEngine.EngineMode;
import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;
import game.engine.entity.EngineShipEntity;
import game.engine.entity.EngineShellEntity;
import game.engine.entity.manager.ShipManager;
import game.engine.entity.manager.ShellManager;
import game.engine.geometry.Line;

typedef ShipHitByShellCallbackParams = {ship:EngineShipEntity, damage:Int}
typedef CreateShellCallbackParams = {shells:Array<EngineShellEntity>, shooterId:String, side:Side, aimAngleRads:Float}

@:expose
class GameEngine extends BaseEngine {
	public final shellManager = new ShellManager();

	public var createShellCallback:CreateShellCallbackParams->Void;
	public var deleteShellCallback:EngineShellEntity->Void;
	public var shipHitByShellCallback:ShipHitByShellCallbackParams->Void;

	public static function main() {}

	var allowShoot = false;
	var framesPassed = 0;
	var botsAllowShoot = false;
	var timePassed = 0.0;
	var lastBotShootTime = 0.0;
	final botShootDelaySeconds = 1;

	public function new(engineMode = EngineMode.Server) {
		super(engineMode, EngineGameMode.Sea, new ShipManager());
	}

	// ------------------------------------
	// Implementation
	// ------------------------------------

	public function processInputCommands(inputs:Array<PlayerInputCommandEngineWrapped>) {
		for (input in inputs) {
			final inputInitiator = input.playerInputCommand.playerId;
			final entityId = playerEntityMap.get(inputInitiator);
			final ship = cast(mainEntityManager.getEntityById(entityId), EngineShipEntity);
			if (ship == null || ship.getOwnerId() != inputInitiator) {
				continue;
			}
			switch (input.playerInputCommand.inputType) {
				case MOVE_UP:
					ship.accelerate();
				case MOVE_DOWN:
					ship.decelerate();
				case MOVE_LEFT:
					ship.rotateLeft();
				case MOVE_RIGHT:
					ship.rotateRight();
				case SHOOT:
					final shootDetails = input.playerInputCommand.shootDetails;
					final side = shootDetails.side;
					if (ship != null && ship.tryShoot(side)) {
						final aimAngleRads = shootDetails.aimAngleRads;
						final shipSideRadRotation = aimAngleRads == 0 ? ship.rotation + MathUtils.degreeToRads(side == LEFT ? 90 : -90) : aimAngleRads;
						final shells = new Array<EngineShellEntity>();

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
								damage: ship.getCannonsDamage(),
								range: ship.getCannonsRange()
							});
							shells.push(shell);
						}

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

	public function engineLoopUpdate(dt:Float) {
		framesPassed++;
		timePassed += dt;

		if (lastBotShootTime == 0) {
			lastBotShootTime = timePassed;
		} else if (timePassed - lastBotShootTime >= botShootDelaySeconds) {
			lastBotShootTime = timePassed;
			botsAllowShoot = true;
		}

		for (ship in mainEntityManager.entities) {
			if (ship.isAlive) {
				ship.collides(false);
				ship.update(dt);

				final engineShipEntity = cast(ship, EngineShipEntity);

				if (engineShipEntity.shipObjectEntity.role == Role.BOT && botsAllowShoot) {
					botsAllowShoot = false;
					addInputCommand({
						playerId: engineShipEntity.getOwnerId(),
						inputType: PlayerInputType.SHOOT,
						shootDetails: {
							side: RIGHT,
							aimAngleRads: MathUtils.getGunRadByDir(engineShipEntity.getDirection())
						}
					});
				}

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

		final shipsToDelete:Array<String> = [];
		final shellsToDelete:Array<String> = [];

		for (shell in shellManager.entities) {
			shell.update(dt);
			for (ship in mainEntityManager.entities) {
				if (shell.getOwnerId() != ship.getOwnerId()) {
					if (checkShellAndShipCollision(shell, ship) && ship.isAlive) {
						ship.collides(true);
						shell.collides(true);
						final engineShipEntity = cast(ship, EngineShipEntity);
						final engineShellEntity = cast(shell, EngineShellEntity);
						engineShipEntity.inflictDamage(engineShellEntity.getDamage());
						if (shipHitByShellCallback != null) {
							shipHitByShellCallback({ship: engineShipEntity, damage: engineShellEntity.getDamage()});
						}
						if (!engineShipEntity.isAlive) {
							engineShipEntity.killerId = shell.getOwnerId();
							shipsToDelete.push(engineShipEntity.getId());
						}
					}
				}
			}
			if (!shell.isAlive) {
				shellsToDelete.push(shell.getId());
			}
		}

		for (i in 0...shellsToDelete.length) {
			final shell = cast(shellManager.getEntityById(shellsToDelete[i]), EngineShellEntity);
			if (shell != null) {
				if (deleteShellCallback != null) {
					deleteShellCallback(shell);
				}
				shellManager.remove(shell.getId());
			}
		}

		for (i in 0...shipsToDelete.length) {
			final ship = cast(mainEntityManager.getEntityById(shipsToDelete[i]), EngineShipEntity);
			if (ship != null) {
				removeMainEntity(ship.getId());
			}
		}
	}

	public function customDelete() {
		createShellCallback = null;
		deleteShellCallback = null;
		shipHitByShellCallback = null;
	}

	public function buildEngineEntity(struct:Dynamic) {
		return new EngineShipEntity(new ShipObjectEntity(struct));
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
	// --------------------------------------

	public function addShell(entity:ShellObjectEntityStruct):EngineShellEntity {
		final newShell = new EngineShellEntity(new ShellObjectEntity(entity));
		shellManager.add(newShell);
		return newShell;
	}
}
