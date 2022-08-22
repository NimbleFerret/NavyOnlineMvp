import client.scene.SceneMain;
import engine.entity.EngineShipEntity;
import client.entity.ClientShip;
import client.GuiApp;
import client.Hud;
import hxd.Key in K;
import hxd.Timer;
import h3d.Engine;

// TODO implement multiplse screens for testing purpose
class Main extends GuiApp {
	public static var DebugDraw = true;

	var hud:Hud;

	var playerShip:ClientShip;

	var sceneMain:SceneMain;

	override function init() {
		super.init();

		engine.backgroundColor = 0x6BC2EE;
		sceneMain = new SceneMain();
		setScene2D(sceneMain);

		// s2d.camera.setViewport(engine.width / 2, engine.height / 2, 0, 0);

		// hud = new Hud();
		// sevents.addScene(hud);

		// final s = new EngineShipEntity(200, 200, ShipSize.Small);
		// playerShip = new ClientShip(s2d, s);

		// s2d.addChild(playerShip);

		// hud.addButton("Socket connect", function() {
		// Socket.instance.joinGame("0x0...0");
		// });
	}

	// override function render(e:Engine) {
	// hud.render(e);
	// s2d.render(e);
	// }

	override function update(dt:Float) {}

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
			}
		if (q || e)
			if (lastShootInputCheck == 0 || lastShootInputCheck + inputShootCheckDelayMS < now) {
				lastShootInputCheck = now;
				// TODO dakka dakka dakka
			}
	}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
