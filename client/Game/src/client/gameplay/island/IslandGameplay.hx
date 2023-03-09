// package client.gameplay.island;
// import h2d.col.Point;
// import hxd.Window;
// import utils.Utils;
// import client.entity.ClientCharacter;
// import client.gameplay.BasicGameplay.GameState;
// import client.manager.IslandsManager;
// import client.network.Socket;
// import client.ui.hud.IslandHud;
// import game.engine.IslandEngine;
// import game.engine.BaseEngine.EngineMode;
// import game.engine.entity.EngineBaseGameEntity;
// import game.engine.entity.EngineCharacterEntity;
// import game.engine.entity.TypesAndClasses;
// class Contour {
// 	private final from:Point;
// 	private final to:Point;
// 	public function new(from:Point, to:Point) {
// 		this.from = from;
// 		this.to = to;
// 	}
// 	public function print() {
// 		trace(from.x, from.y, to.x, to.y);
// 	}
// }
// class IslandGameplay extends BasicGameplay {
// 	private final islandsManager:IslandsManager;
// 	private final waterBg:WaterBg;
// 	// UI
// 	public var hud:IslandHud;
// 	public function new(scene:h2d.Scene, islandId:String, islandOwner:String, islandTerrain:String, islandMining:Bool, leaveCallback:Void->Void,
// 			engineMode = EngineMode.Server) {
// 		super(scene, new IslandEngine(engineMode));
// 		waterBg = new WaterBg(scene, -1650, -700, 5, 21, 10);
// 		// Pass additional island info here.
// 		islandsManager = new IslandsManager(scene, islandTerrain, islandMining);
// 		final islandEngine = cast(baseEngine, IslandEngine);
// 		islandEngine.deleteMainEntityCallback = function callback(engineCharacterEntity:EngineBaseGameEntity) {
// 			if (gameState == GameState.Playing) {
// 				final clientEntity = clientMainEntities.get(engineCharacterEntity.getId());
// 				if (clientEntity != null) {
// 					scene.removeChild(clientEntity);
// 					clientMainEntities.remove(engineCharacterEntity.getId());
// 					clientMainEntitiesCount--;
// 				}
// 			}
// 		};
// 		final islandEngine = cast(baseEngine, IslandEngine);
// 		for (lineCollider in islandEngine.lineColliders) {
// 			// addLineCollider(scene, lineCollider.x1, lineCollider.y1, lineCollider.x2, lineCollider.y2);
// 		}
// 		hud = new IslandHud(islandId, islandOwner, function callback() {
// 			destroy();
// 			Socket.instance.leaveGame({playerId: playerId});
// 			if (leaveCallback != null) {
// 				leaveCallback();
// 			}
// 		});
// 		maxDragX = 200;
// 		maxDragY = 100;
// 	}
// 	// --------------------------------------
// 	// Collider debug stuff
// 	// --------------------------------------
// 	function addColliderObject() {
// 		if (firstColliderAdded) {
// 			final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
// 			scene.camera.screenToCamera(to);
// 			final g = new h2d.Graphics(scene);
// 			g.lineStyle(3, 0xff0000);
// 			g.lineTo(previousClick.x, previousClick.y);
// 			g.lineTo(to.x, to.y);
// 			contour.push(new Contour(previousClick, to));
// 			previousClick = to;
// 		} else {
// 			if (clicks == 2) {
// 				clicks = 0;
// 				final g = new h2d.Graphics(scene);
// 				g.lineStyle(3, 0xff0000);
// 				g.lineTo(previousClick.x, previousClick.y);
// 				final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
// 				scene.camera.screenToCamera(to);
// 				g.lineTo(to.x, to.y);
// 				contour.push(new Contour(previousClick, to));
// 				firstColliderAdded = true;
// 				previousClick = to;
// 			} else {
// 				previousClick = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
// 				scene.camera.screenToCamera(previousClick);
// 			}
// 		}
// 	}
// 	private var previousClick:Point;
// 	private var clicks = 0;
// 	private var firstColliderAdded = false;
// 	private var contour = new Array<Contour>();
// 	private function addLineCollider(scene:h2d.Scene, x1:Float, y1:Float, x2:Float, y2:Float) {
// 		final g = new h2d.Graphics(scene);
// 		g.lineStyle(3, 0xff0000);
// 		g.lineTo(x1, y1);
// 		g.lineTo(x2, y2);
// 	}
// 	// --------------------------------------
// 	// Basic implementations
// 	// --------------------------------------
// 	public function customUpdate(dt:Float, fps:Float) {
// 		islandsManager.update();
// 		waterBg.update(dt);
// 		for (character in clientMainEntities) {
// 			character.update(dt);
// 			// if (character.debugRect == null) {
// 			// 	character.debugRect = new h2d.Graphics(scene);
// 			// }
// 			// if (character.debugRect != null) {
// 			// 	character.debugRect.clear();
// 			// }
// 			// final graphics = character.debugRect;
// 			// final rect = character.getEngineEntityRect();
// 			// graphics.lineStyle(3, character.shapeColor);
// 			// // Top line
// 			// graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
// 			// graphics.lineTo(rect.getTopRightPoint().x, rect.getTopRightPoint().y);
// 			// // Right line
// 			// graphics.lineTo(rect.getBottomRightPoint().x, rect.getBottomRightPoint().y);
// 			// // Bottom line
// 			// graphics.lineTo(rect.getBottomLeftPoint().x, rect.getBottomLeftPoint().y);
// 			// // Left line
// 			// graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
// 		}
// 	}
// 	public function customStartGame() {}
// 	public function customInput(mousePos:Point, mouseLeft:Bool, mouseRight:Bool) {
// 		// final space = K.isPressed(K.SPACE);
// 		// if (space) {
// 		// 	for (value in contour) {
// 		// 		value.print();
// 		// 	}
// 		// }
// 		// if (K.isPressed(K.MOUSE_LEFT)) {
// 		// 	addColliderObject();
// 		// 	clicks++;
// 		// }
// 	}
// 	public function customUpdateWorldState() {}
// 	public function customSync() {}
// 	// --------------------------------------
// 	// Singleplayer
// 	// --------------------------------------
// 	public function addCharacterByClient(x:Int, y:Int, charId:String, ownerId:String) {
// 		final islandEngine = cast(baseEngine, IslandEngine);
// 		final charEntity = jsEntityToEngineEntity({
// 			x: x,
// 			y: y,
// 			id: charId,
// 			ownerId: ownerId
// 		});
// 		islandEngine.createMainEntity(charEntity, true);
// 		return charEntity;
// 	}
// 	// --------------------------------------
// 	// Utils
// 	// --------------------------------------
// 	public function jsEntityToEngineEntity(message:Dynamic):EngineBaseGameEntity {
// 		return new EngineCharacterEntity(serverMessageToObjectEntity(message));
// 	}
// 	public function jsEntitiesToEngineEntities(entities:Dynamic):Array<EngineBaseGameEntity> {
// 		return entities.map(entity -> {
// 			return new EngineCharacterEntity(serverMessageToObjectEntity(entity));
// 		});
// 	}
// 	private function serverMessageToObjectEntity(message:Dynamic):BaseObjectEntity {
// 		return new BaseObjectEntity({
// 			x: message.x,
// 			y: message.y,
// 			id: message.id,
// 			ownerId: message.ownerId
// 		});
// 	}
// }
