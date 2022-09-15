package client.gameplay.island;

import client.network.Socket;
import client.gameplay.BasicGameplay.GameState;
import engine.IslandEngine;
import engine.BaseEngine.EngineMode;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineCharacterEntity;
import h2d.col.Point;
import hxd.Window;

class Contour {
	private final from:Point;
	private final to:Point;

	public function new(from:Point, to:Point) {
		this.from = from;
		this.to = to;
	}

	public function print() {
		trace(from.x, from.y, to.x, to.y);
	}
}

class IslandGameplay extends BasicGameplay {
	private final islandsManager:IslandsManager;

	// UI
	public var hud:IslandHud;

	public final waterBg:WaterBg;

	public function new(scene:h2d.Scene, leaveCallback:Void->Void, engineMode = EngineMode.Server) {
		super(scene, new IslandEngine(engineMode));

		waterBg = new WaterBg(scene, -Main.ScreenWidth / 3.5, -Main.ScreenHeight / 3.5);

		// Pass additional island info here.
		islandsManager = new IslandsManager(scene, 'Green');

		final islandEngine = cast(baseEngine, IslandEngine);

		for (lineCollider in islandEngine.lineColliders) {
			addLineCollider(scene, lineCollider.x1, lineCollider.y1, lineCollider.x2, lineCollider.y2);
		}

		hud = new IslandHud(function callback() {
			destroy();
			Socket.instance.leaveGame({playerId: playerId});
			if (leaveCallback != null) {
				leaveCallback();
			}
		});

		if (engineMode == EngineMode.Client) {
			gameState = GameState.Playing;
		}
	}

	// --------------------------------------
	// Collider debug stuff
	// --------------------------------------

	function addColliderObject() {
		if (firstColliderAdded) {
			final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			scene.camera.screenToCamera(to);

			final g = new h2d.Graphics(scene);
			g.lineStyle(3, 0xff0000);
			g.lineTo(previousClick.x, previousClick.y);
			g.lineTo(to.x, to.y);

			contour.push(new Contour(previousClick, to));

			previousClick = to;
		} else {
			if (clicks == 2) {
				clicks = 0;

				final g = new h2d.Graphics(scene);
				g.lineStyle(3, 0xff0000);
				g.lineTo(previousClick.x, previousClick.y);

				final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
				scene.camera.screenToCamera(to);

				g.lineTo(to.x, to.y);

				contour.push(new Contour(previousClick, to));

				firstColliderAdded = true;

				previousClick = to;
			} else {
				previousClick = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
				scene.camera.screenToCamera(previousClick);
			}
		}
	}

	private var previousClick:Point;
	private var clicks = 0;
	private var firstColliderAdded = false;
	private var contour = new Array<Contour>();

	private function addLineCollider(scene:h2d.Scene, x1:Float, y1:Float, x2:Float, y2:Float) {
		final g = new h2d.Graphics(scene);
		g.lineStyle(3, 0xff0000);
		g.lineTo(x1, y1);
		g.lineTo(x2, y2);
	}

	// --------------------------------------
	// Basic implementations
	// --------------------------------------

	public function customUpdate(dt:Float, fps:Float) {
		waterBg.update(dt);

		for (character in clientMainEntities) {
			character.update(dt);

			if (character.debugRect == null) {
				character.debugRect = new h2d.Graphics(scene);
			}
			if (character.debugRect != null) {
				character.debugRect.clear();
			}

			final graphics = character.debugRect;
			final rect = character.getEngineEntityRect();

			graphics.lineStyle(3, character.shapeColor);

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

	public function customStartGame() {}

	public function customInput() {
		// final space = K.isPressed(K.SPACE);
		// if (space) {
		// 	for (value in contour) {
		// 		value.print();
		// 	}
		// }
		// if (K.isPressed(K.MOUSE_LEFT)) {
		// 	addColliderObject();
		// 	clicks++;
		// }
	}

	public function customUpdateWorldState() {}

	public function customSync() {}

	// --------------------------------------
	// Singleplayer
	// --------------------------------------

	public function startGameByClient(playerId:String) {
		if (gameState == GameState.Init) {
			this.playerId = playerId;
			gameState = GameState.Playing;
		}
	}

	// --------------------------------------
	// Utils
	// --------------------------------------

	public function jsEntityToEngineEntity(message:Dynamic):EngineBaseGameEntity {
		return new EngineCharacterEntity(message.entity.x, message.entity.y, message.entity.id, message.entity.ownerId);
	}

	public function jsEntitiesToEngineEntities(entities:Dynamic):Array<EngineBaseGameEntity> {
		return entities.map(entity -> {
			return new EngineCharacterEntity(entity.x, entity.y, entity.id, entity.ownerId);
		});
	}
}
