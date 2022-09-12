package client.scene;

import client.ui.UiToken;
import client.ui.UiAvatar;
import client.entity.ship.ShipTemplate;
import h3d.Engine;
import h2d.Scene;

class SceneMain extends Scene {
	public final hud:SceneMainHud;

	private var currentCaptain:UiAvatar;

	private var nvyTokens:UiToken;
	private var aksTokens:UiToken;

	private var currentShip:ShipTemplate;

	private final baseShipX:Float;
	private final baseShipY:Float;

	public function new(startCallback:Void->Void) {
		super();

		// Init moralis
		hud = new SceneMainHud(function metamaskLoginCallback(address:String) {
			Player.instance.ethAddress = address;
			hud.setUserNameWeb3(address);
		}, function startGameCallback() {
			if (startCallback != null) {
				startCallback();
			}
		});

		// Basic ship position
		baseShipX = Main.ScreenWidth / 2 - 230;
		baseShipY = Main.ScreenHeight / 2 + 30;

		// Current captain
		currentCaptain = new UiAvatar();
		currentCaptain.setPosition(600, 330);
		addChild(currentCaptain);

		final arrowCaptainLeft = hud.buttonArrowLeft(function callback() {
			changeCaptain(-1);
		}, true);
		final arrowCaptainRight = hud.buttonArrowRight(function callback() {
			changeCaptain(1);
		}, true);

		arrowCaptainLeft.setPosition(450, 350);
		arrowCaptainRight.setPosition(800, 350);

		addChild(arrowCaptainLeft);
		addChild(arrowCaptainRight);

		// Current token balances
		nvyTokens = new UiToken(hud.widePlate(3));
		aksTokens = new UiToken(hud.widePlate(3));

		nvyTokens.setPosition(Main.ScreenWidth - nvyTokens.getBounds().width, 16);
		aksTokens.setPosition(Main.ScreenWidth - aksTokens.getBounds().width, 134);

		addChild(nvyTokens);
		addChild(aksTokens);

		// Current ship
		changeShip(0);

		final arrowLeftShip = hud.buttonArrowLeft(function callback() {
			changeShip(-1);
		}, true);
		final arrowRightShip = hud.buttonArrowRight(function callback() {
			changeShip(1);
		}, true);

		arrowLeftShip.setPosition(baseShipX - 680, 350);
		arrowRightShip.setPosition(baseShipX + 450, 350);

		addChild(arrowLeftShip);
		addChild(arrowRightShip);
	}

	private var currentShipIndex = 0;

	private function changeCaptain(dir:Int) {}

	private function changeShip(dir:Int) {
		if (currentShip != null) {
			removeChild(currentShip);
		}
		if (dir == 0) {
			currentShip = new ShipTemplate(this, SMALL, NONE, THREE);
		} else {
			currentShip = new ShipTemplate(this, MEDIUM, NONE, FOUR);
		}

		if (currentShip.shipSize == SMALL) {
			currentShip.setPosition(baseShipX - 90, 500);
		} else {
			currentShip.setPosition(baseShipX, 500);
		}
		currentShip.setScale(3);
		addChild(currentShip);
	}

	public override function render(e:Engine) {
		hud.render(e);
		super.render(e);
	}

	public function getHud() {
		return hud;
	}

	public function start() {}
}
