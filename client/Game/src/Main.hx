import client.network.RestProtocol.JoinSectorResponse;
import client.network.RestProtocol.GameWorldData;
import client.scene.SceneWorldMap;
import client.scene.SceneIsland;
import client.scene.SceneShipConfig;
import client.scene.SceneHomeMenu;
import client.scene.SceneDemo1;
import client.scene.SceneGeomTest;
import client.scene.SceneOnlineDemo1;

interface Updatable {
	public function update(dt:Float):Void;
}

enum Scene {
	SceneHomeMenu;
	SceneDemo1;
	SceneGeomTest;
	SceneOnlineDemo1;
	SceneShipConfig;
	SceneIsland;
	SceneWorldMap;
}

class Main extends hxd.App {
	// private final defaultScene = Scene.SceneDemo1;
	private final defaultScene = Scene.SceneOnlineDemo1;
	private var sceneHomeMenu:SceneHomeMenu;
	private var sceneDemo1:SceneDemo1;
	private var sceneGeomTest:SceneGeomTest;
	private var sceneShipConfig:SceneShipConfig;
	private var sceneOnlineDemo1:SceneOnlineDemo1;
	private var sceneIsland:SceneIsland;
	private var sceneWorldMap:SceneWorldMap;
	private var currentScene:Scene;
	private var lastAddedIteractiveScene:hxd.SceneEvents.InteractiveScene;

	public static var ScreenWidth:Int = 1920;
	public static var ScreenHeight:Int = 1080;
	public static var IsWeb3Available = false;

	// TODO refactor game input scenes
	override function init() {
		super.init();

		engine.backgroundColor = 0xFCDCA1;

		// Init scene home menu
		sceneHomeMenu = new SceneHomeMenu(function startCallback() {
			initiateSceneWorldMap();
		});

		// Init scene demo 1
		sceneDemo1 = new SceneDemo1(engine.width, engine.height);

		// Init scene geometry test
		sceneGeomTest = new SceneGeomTest(engine.width, engine.height);

		// Init scene ship config
		sceneShipConfig = new SceneShipConfig();

		// Init scene island
		sceneIsland = new SceneIsland(engine.width, engine.height, function leaveCallback() {
			initiateSceneWorldMap();
		});

		// init scene world map
		sceneWorldMap = new SceneWorldMap(function callback(sector:EnterSectorCallback) {
			if (sector.joinSectorResponse.sectorType == GameWorldData.SectorIslandType) {
				initiateSceneIsland(sector.joinSectorResponse);
			} else {
				initiateSceneOnlineDemo1(sector.joinSectorResponse.instanceId);
			}
		}, function mainMenuCallback() {
			initiateSceneHomeMenu();
		});

		// init scene online demo 1
		sceneOnlineDemo1 = new SceneOnlineDemo1(function leaveCallback() {
			initiateSceneWorldMap();
		}, function diedCallback() {});

		// TODO better start scene selection
		// Start default scene

		switch (defaultScene) {
			case SceneHomeMenu:
				sceneHomeMenu.start();
				setScene2D(sceneHomeMenu);
			case SceneDemo1:
				sceneDemo1.start();
				sevents.addScene(sceneDemo1.getHud());
				// sevents.addScene(sceneDemo1.debugHud);
				setScene2D(sceneDemo1);
			case SceneGeomTest:
				sceneGeomTest.start();
				setScene2D(sceneGeomTest);
			case SceneOnlineDemo1:
				sceneOnlineDemo1.start("9fd5b610-93a3-45cf-9d38-311775a33ec5");
				setScene2D(sceneOnlineDemo1);
			case SceneShipConfig:
				sceneShipConfig.start();
				sevents.addScene(sceneShipConfig.hud);
				setScene2D(sceneShipConfig);
			case SceneIsland:
				final response = new JoinSectorResponse(true, null, 0, 'instance', 1, 'islandId', '0x87400A03678dd03c8BF536404B5B14C609a23b79', 'Green', true);
				sceneIsland.start(response);
				sevents.addScene(sceneIsland.getHud());
				setScene2D(sceneIsland);
			case SceneWorldMap:
				setScene2D(sceneWorldMap);
		}

		currentScene = defaultScene;
	}

	private function initiateSceneHomeMenu() {
		currentScene = SceneHomeMenu;
		sceneHomeMenu.start();

		sevents.removeScene(lastAddedIteractiveScene);
		lastAddedIteractiveScene = sceneHomeMenu.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		setScene2D(sceneHomeMenu);
	}

	private function initiateSceneWorldMap() {
		currentScene = SceneWorldMap;
		sceneWorldMap.start();

		sevents.removeScene(lastAddedIteractiveScene);
		lastAddedIteractiveScene = sceneWorldMap.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		setScene2D(sceneWorldMap);
	}

	private function initiateSceneIsland(joinSectorResponse:JoinSectorResponse) {
		currentScene = SceneIsland;
		sceneIsland.start(joinSectorResponse);

		sevents.removeScene(lastAddedIteractiveScene);
		lastAddedIteractiveScene = sceneIsland.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		setScene2D(sceneIsland);
	}

	private function initiateSceneOnlineDemo1(instanceId:String) {
		currentScene = SceneOnlineDemo1;

		sceneOnlineDemo1.start(instanceId);

		sevents.removeScene(lastAddedIteractiveScene);
		lastAddedIteractiveScene = sceneOnlineDemo1.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		setScene2D(sceneOnlineDemo1);
	}

	override function update(dt:Float) {
		switch (currentScene) {
			case SceneOnlineDemo1:
				sceneOnlineDemo1.update(dt, engine.fps);
			case SceneGeomTest:
				sceneGeomTest.update(dt, engine.fps);
			case SceneShipConfig:
				sceneShipConfig.update();
			case SceneIsland:
				sceneIsland.update(dt, engine.fps);
			case SceneDemo1:
				sceneDemo1.update(dt, engine.fps);
			case _:
		}
	}

	override function onResize() {
		if (currentScene == SceneOnlineDemo1) {
			sceneOnlineDemo1.onResize();
		}
	}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
