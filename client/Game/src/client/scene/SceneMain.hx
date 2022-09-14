package client.scene;

import client.ui.UiIsland;
import client.ui.UiToken;
import client.ui.UiAvatar;
import client.entity.ship.ShipTemplate;
import h3d.Engine;
import h2d.Scene;

typedef CaptainInfo = {
	free:Bool,
	currentLevel:Int,
	maxLevel:Int,
	rarity:String,
	trait1:String,
	trait2:String,
	trait3:String,
	trait4:String,
	trait5:String,
	stakingIncome:Int,
	miningIncome:Int,
	secondsTillReward:Int,
	head:Int,
	hat:Int,
	hair:Int,
	clothes:Int,
	bg:Int,
	acc:Int
}

typedef ShipInfo = {
	free:Bool,
	currentLevel:Int,
	maxLevel:Int,
	rarity:String,
	size:String,
	cannons:Int,
	windows:Int,
	maintenance:Bool,
	trait1:String,
	trait2:String,
	trait3:String,
	trait4:String,
	trait5:String
}

typedef IslandInfo = {
	currentLevel:Int,
	maxLevel:Int,
	rarity:String,
	terrain:String,
	size:String,
	income:Int,
	mining:Bool,
	secondsTillReward:Int
}

class SceneMain extends Scene {
	public final hud:SceneMainHud;

	private final baseShipX:Float;
	private final baseShipY:Float;

	private var currentCaptain:UiAvatar;
	private var currentCaptainIndex = 0;

	private var currentShip:ShipTemplate;
	private var currentShipIndex = 0;

	private var currentIsland:UiIsland;
	private var currentIslandIndex = 0;

	private var nvyTokens:UiToken;
	private var aksTokens:UiToken;

	private var miningAnimation:h2d.Anim;

	// Collections info
	private final captains = new Array<CaptainInfo>();
	private final ships = new Array<ShipInfo>();
	private final islands = new Array<IslandInfo>();

	public function new(startCallback:Void->Void) {
		super();

		captains.push({
			free: true,
			currentLevel: 0,
			maxLevel: 0,
			rarity: 'Common',
			trait1: '-',
			trait2: '-',
			trait3: '-',
			trait4: '-',
			trait5: '-',
			stakingIncome: 0,
			miningIncome: 0,
			secondsTillReward: 0,
			head: 3,
			hat: 0,
			hair: 3,
			clothes: 3,
			bg: 1,
			acc: 0
		});

		captains.push({
			free: false,
			currentLevel: 0,
			maxLevel: 10,
			rarity: 'Legendary',
			trait1: '-',
			trait2: '-',
			trait3: '-',
			trait4: '-',
			trait5: '-',
			stakingIncome: 5,
			miningIncome: 20,
			secondsTillReward: 0,
			head: 3,
			hat: 5,
			hair: 0,
			clothes: 1,
			bg: 9,
			acc: 4
		});

		ships.push({
			free: true,
			currentLevel: 0,
			maxLevel: 0,
			rarity: 'Common',
			size: 'Small',
			cannons: 2,
			windows: 0,
			maintenance: false,
			trait1: '-',
			trait2: '-',
			trait3: '-',
			trait4: '-',
			trait5: '-'
		});

		ships.push({
			free: false,
			currentLevel: 0,
			maxLevel: 10,
			rarity: 'Legendary',
			size: 'Middle',
			cannons: 4,
			windows: 2,
			maintenance: false,
			trait1: '-',
			trait2: '-',
			trait3: '-',
			trait4: '-',
			trait5: '-'
		});

		islands.push({
			currentLevel: 0,
			maxLevel: 3,
			rarity: 'Legendary',
			terrain: 'Green',
			size: 'Small',
			income: 40,
			mining: false,
			secondsTillReward: 0
		});

		islands.push({
			currentLevel: 1,
			maxLevel: 3,
			rarity: 'Legendary',
			terrain: 'Snow',
			size: 'Small',
			income: 40,
			mining: true,
			secondsTillReward: 0
		});

		islands.push({
			currentLevel: 1,
			maxLevel: 3,
			rarity: 'Legendary',
			terrain: 'Dark',
			size: 'Small',
			income: 40,
			mining: true,
			secondsTillReward: 0
		});

		// Init moralis
		hud = new SceneMainHud(function metamaskLoginCallback(address:String) {
			Player.instance.ethAddress = address;
			hud.initiateWeb3(address);
			initiateBalances();
			initiateIslands();
		}, function unloggedInitCallback() {
			initiateCaptains();
			initiateShips();
			initiateIslands();
		}, function startGameCallback() {
			if (startCallback != null) {
				startCallback();
			}
		});

		// Basic ship position
		baseShipX = Main.ScreenWidth / 2 - 230;
		baseShipY = Main.ScreenHeight / 2 + 30;
	}

	private function changeCaptain(dir:Int) {
		if (captains.length > 1) {
			if (dir == 1) {
				currentCaptainIndex += 1;
				if (currentCaptainIndex == captains.length) {
					currentCaptainIndex = 0;
				}
			} else {
				currentCaptainIndex -= 1;
				if (currentCaptainIndex < 0) {
					currentCaptainIndex = captains.length - 1;
				}
			}
			final newCaptainInfo = captains[currentCaptainIndex];
			currentCaptain.setVisuals(newCaptainInfo.head, newCaptainInfo.hat, newCaptainInfo.hair, newCaptainInfo.clothes, newCaptainInfo.bg,
				newCaptainInfo.acc);

			hud.updateCaptainUi(newCaptainInfo);
		}
	}

	private function changeShip(dir:Int) {
		if (ships.length > 1) {
			if (dir == 1) {
				currentShipIndex += 1;
				if (currentShipIndex == ships.length) {
					currentShipIndex = 0;
				}
			} else {
				currentShipIndex -= 1;
				if (currentShipIndex < 0) {
					currentShipIndex = ships.length - 1;
				}
			}

			final newShipInfo = ships[currentShipIndex];
			final shipSize = newShipInfo.size == 'Small' ? SMALL : MEDIUM;

			var shipCannons = ShipGuns.ONE;
			if (newShipInfo.cannons == 2) {
				shipCannons = ShipGuns.TWO;
			} else if (newShipInfo.cannons == 3) {
				shipCannons = ShipGuns.THREE;
			} else if (newShipInfo.cannons == 4) {
				shipCannons = ShipGuns.FOUR;
			}

			var shipWindows = ShipWindows.NONE;
			if (newShipInfo.windows == 1) {
				shipWindows = ShipWindows.ONE;
			} else if (newShipInfo.windows == 2) {
				shipWindows = ShipWindows.TWO;
			}

			if (currentShip != null) {
				removeChild(currentShip);
			}
			currentShip = new ShipTemplate(this, shipSize, shipWindows, shipCannons);
			if (currentShip.shipSize == SMALL) {
				currentShip.setPosition(baseShipX - 90, 500);
			} else {
				currentShip.setPosition(baseShipX, 500);
			}
			currentShip.setScale(3);

			hud.updateShipUi(newShipInfo);
		}
	}

	private function changeIsland(dir:Int) {
		function newIslandByIndex(index:Int) {
			var terrainType = IslandTerrainType.GREEN;
			if (islands[index].terrain == 'Dark') {
				terrainType = IslandTerrainType.DARK;
			} else if (islands[index].terrain == 'Snow') {
				terrainType = IslandTerrainType.SNOW;
			}
			currentIsland = new UiIsland(terrainType);
			miningAnimation.alpha = islands[index].mining ? 1 : 0;
		}

		if (islands.length > 1 || dir == 0) {
			if (currentIsland != null) {
				removeChild(currentIsland);
				removeChild(miningAnimation);
			}
			if (dir == 0) {
				newIslandByIndex(0);
			} else {
				if (dir == 1) {
					currentIslandIndex += 1;
					if (currentIslandIndex == islands.length) {
						currentIslandIndex = 0;
					}
				} else {
					currentIslandIndex -= 1;
					if (currentIslandIndex < 0) {
						currentIslandIndex = islands.length - 1;
					}
				}
				newIslandByIndex(currentIslandIndex);
			}
			currentIsland.setPosition(2600, 200);
			addChild(currentIsland);
			addChild(miningAnimation);
			hud.updateIslandUi(islands[currentIslandIndex]);
		}
	}

	public override function render(e:Engine) {
		hud.render(e);
		super.render(e);
	}

	public function getHud() {
		return hud;
	}

	public function start() {}

	// ---------------------------------
	// UI parts
	// ---------------------------------

	private function initiateBalances() {
		nvyTokens = new UiToken(hud.widePlate(3));
		aksTokens = new UiToken(hud.widePlate(3));

		nvyTokens.setPosition(Main.ScreenWidth - nvyTokens.getBounds().width, 16);
		aksTokens.setPosition(Main.ScreenWidth - aksTokens.getBounds().width, 134);

		addChild(nvyTokens);
		addChild(aksTokens);
	}

	private function initiateCaptains() {
		currentCaptain = new UiAvatar();
		currentCaptain.setPosition(600, 330);
		addChild(currentCaptain);

		final arrowCaptainLeft = hud.buttonArrowLeft(function callback() {
			changeCaptain(-1);
		}, false);
		final arrowCaptainRight = hud.buttonArrowRight(function callback() {
			changeCaptain(1);
		}, false);

		arrowCaptainLeft.setPosition(450, 350);
		arrowCaptainRight.setPosition(800, 350);

		addChild(arrowCaptainLeft);
		addChild(arrowCaptainRight);
	}

	private function initiateShips() {
		currentShip = new ShipTemplate(this, SMALL, NONE, THREE);
		currentShip.setScale(3);
		currentShip.setPosition(baseShipX - 90, 500);

		final arrowLeftShip = hud.buttonArrowLeft(function callback() {
			changeShip(-1);
		}, false);
		final arrowRightShip = hud.buttonArrowRight(function callback() {
			changeShip(1);
		}, false);

		arrowLeftShip.setPosition(baseShipX - 680, 350);
		arrowRightShip.setPosition(baseShipX + 450, 350);

		addChild(arrowLeftShip);
		addChild(arrowRightShip);
	}

	private function initiateIslands() {
		final miningAnimation1 = hxd.Res.mine_anims._1.toTile();
		final miningAnimation2 = hxd.Res.mine_anims._2.toTile();
		final miningAnimation3 = hxd.Res.mine_anims._3.toTile();
		final miningAnimation4 = hxd.Res.mine_anims._4.toTile();
		final miningAnimation5 = hxd.Res.mine_anims._5.toTile();
		final miningAnimation6 = hxd.Res.mine_anims._6.toTile();
		final miningAnimation7 = hxd.Res.mine_anims._7.toTile();
		final miningAnimation8 = hxd.Res.mine_anims._8.toTile();

		miningAnimation = new h2d.Anim([
			miningAnimation1,
			miningAnimation2,
			miningAnimation3,
			miningAnimation4,
			miningAnimation5,
			miningAnimation6,
			miningAnimation7,
			miningAnimation8
		]);
		miningAnimation.setScale(5);
		miningAnimation.setPosition(2716, 400);
		miningAnimation.alpha = 1;

		changeIsland(0);

		final arrowLeftIsland = hud.buttonArrowLeft(function callback() {
			changeIsland(-1);
		}, false);
		final arrowRightIsland = hud.buttonArrowRight(function callback() {
			changeIsland(1);
		}, false);
		arrowLeftIsland.setPosition(2400, 350);
		arrowRightIsland.setPosition(3100, 350);
	}
}
