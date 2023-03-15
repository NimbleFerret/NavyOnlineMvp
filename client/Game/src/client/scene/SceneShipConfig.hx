// package client.scene;
// import h2d.Scene;
// import h3d.Engine;
// import hxd.Key in K;
// import client.entity.ClientShip;
// import client.entity.ship.ShipDecorations.CaptainConfigPosition;
// import client.ui.hud.BasicHud;
// import game.engine.base.BaseTypesAndClasses;
// import game.engine.navy.NavyTypesAndClasses;
// import game.engine.navy.entity.NavyShipEntity;
// class SceneShipConfig extends Scene {
// 	public final hud:BasicHud;
// 	private final debugGraphics:h2d.Graphics;
// 	private final ship:ClientShip;
// 	public function new() {
// 		super();
// 		camera.setViewport(1920, 1080, 0, 0);
// 		camera.setScale(3.5, 3.5);
// 		ship = new ClientShip(new NavyShipEntity(new ShipObjectEntity({
// 			x: -100,
// 			y: -100,
// 			minSpeed: 0,
// 			maxSpeed: 300,
// 			acceleration: 50,
// 			direction: GameEntityDirection.EAST,
// 			id: null,
// 			ownerId: "123",
// 			serverShipRef: "",
// 			free: true,
// 			role: Role.PLAYER,
// 			shipHullSize: ShipHullSize.SMALL,
// 			shipWindows: ShipWindows.NONE,
// 			shipCannons: ShipCannons.TWO,
// 			cannonsRange: 500,
// 			cannonsDamage: 50,
// 			cannonsAngleSpread: 40,
// 			cannonsShellSpeed: 400,
// 			armor: 100,
// 			hull: 100,
// 			movementDelay: 0.500,
// 			turnDelay: 0.500,
// 			fireDelay: 0.500
// 		})));
// 		addChild(ship);
// 		this.debugGraphics = new h2d.Graphics(this);
// 		hud = new BasicHud(0, 20);
// 		// -------------------------------
// 		// Captain position
// 		// -------------------------------
// 		final defaultCaptainPosition = CaptainConfigPosition;
// 		final captainMinX = defaultCaptainPosition.x - 300;
// 		final captainMaxX = defaultCaptainPosition.x + 300;
// 		final captainMinY = defaultCaptainPosition.y - 200;
// 		final captainMaxY = defaultCaptainPosition.y + 200;
// 		hud.addSlider("Capt X ", function() return CaptainConfigPosition.x, function(v) CaptainConfigPosition.x = v, captainMinX, captainMaxX, 2);
// 		hud.addSlider("Capt Y ", function() return CaptainConfigPosition.y, function(v) CaptainConfigPosition.y = v, captainMinY, captainMaxY, 2);
// 		// -------------------------------
// 		// Cannons position
// 		// -------------------------------
// 		final s = ship.shipTemplate;
// 		for (i in 0...s.cannonsTotal) {
// 			hud.addSlider("Left cannon " + (i + 1) + " X offset ", function() return s.getCannonPositionOffset(LEFT, i).x,
// 				function(v) s.updateCannonPositionOffset(LEFT, i, v, 0), -200, 200, 2);
// 			hud.addSlider("Left cannon " + (i + 1) + " Y offset ", function() return s.getCannonPositionOffset(LEFT, i).y,
// 				function(v) s.updateCannonPositionOffset(LEFT, i, 0, v), -200, 200, 2);
// 		}
// 		for (i in 0...s.cannonsTotal) {
// 			hud.addSlider("Right cannon " + (i + 1) + " X offset ", function() return s.getCannonPositionOffset(RIGHT, i).x,
// 				function(v) s.updateCannonPositionOffset(RIGHT, i, v, 0), -200, 200, 2);
// 			hud.addSlider("Right cannon " + (i + 1) + " Y offset ", function() return s.getCannonPositionOffset(RIGHT, i).y,
// 				function(v) s.updateCannonPositionOffset(RIGHT, i, 0, v), -200, 200, 2);
// 		}
// 		// -------------------------------
// 		// Collider rect
// 		// -------------------------------
// 		final minBodyOffsetX = ship.getBodyShape().rectOffsetX - 200;
// 		final maxBodyOffsetX = ship.getBodyShape().rectOffsetX + 200;
// 		final minBodyOffsetY = ship.getBodyShape().rectOffsetY - 200;
// 		final maxBodyOffsetY = ship.getBodyShape().rectOffsetY + 200;
// 		final minBodyOffsetAngle = ship.getBodyShape().rotation - Math.PI;
// 		final maxBodyOffsetAngle = ship.getBodyShape().rotation + Math.PI;
// 		hud.addSlider("Body offset X ", function() return ship.getBodyShape().rectOffsetX, function(v) ship.updateBodyShape(v, 0, 0), minBodyOffsetX,
// 			maxBodyOffsetX, 2);
// 		hud.addSlider("Body offset Y ", function() return ship.getBodyShape().rectOffsetY, function(v) ship.updateBodyShape(0, v, 0), minBodyOffsetY,
// 			maxBodyOffsetY, 2);
// 		hud.addSlider("Body offset angle ", function() return ship.getBodyShape().rotation, function(v) ship.updateBodyShape(0, 0, v), minBodyOffsetAngle,
// 			maxBodyOffsetAngle, 2);
// 	}
// 	public override function render(e:Engine) {
// 		super.render(e);
// 		hud.render(e);
// 	}
// 	public function start() {
// 		GameConfig.ShipConfigMode = true;
// 	}
// 	public function update() {
// 		final c = camera;
// 		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
// 			c.scale(1.25, 1.25);
// 		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
// 			c.scale(0.8, 0.8);
// 		final left = K.isPressed(K.LEFT);
// 		if (left) {
// 			ship.shipTemplate.changeDirLeft();
// 		}
// 		final right = K.isPressed(K.RIGHT);
// 		if (right) {
// 			ship.shipTemplate.changeDirRight();
// 		}
// 		final e = K.isPressed(K.E);
// 		if (e) {
// 			ship.shipTemplate.shootRight();
// 		}
// 		final q = K.isPressed(K.Q);
// 		if (q) {
// 			ship.shipTemplate.shootLeft();
// 		}
// 		ship.shipTemplate.update();
// 		ship.shipTemplate.updateVisualComponents();
// 		debugGraphics.clear();
// 		ship.debugDraw(debugGraphics);
// 	}
// }
