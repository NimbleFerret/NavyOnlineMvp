package client.scene;

import haxe.Timer;
import client.network.RestProtocol.IslandEntity;
import client.network.RestProtocol.ShipEntity;
import client.network.RestProtocol.CaptainEntity;
import client.network.Rest;
import client.network.RestProtocol.FounderCollections;
import client.gameplay.BaiscHud.BasicHud;
import h2d.Object;
import uuid.Uuid;

class SceneMainHud extends BasicHud {
	private var userNameText:h2d.Text;
	private var loginPlate:h2d.Object;
	private var loginBtn:h2d.Object;

	// Founder collection
	private var cptLeftText:h2d.Text;
	private var shpLeftText:h2d.Text;
	private var islLeftText:h2d.Text;

	// Captain UI
	private var captainDescFui:h2d.Flow;
	private var captainDescFreePlate:h2d.Object;
	private var captainDescCollectiblePlate:h2d.Object;
	private var captainTypeText:h2d.Text;
	private var captainLevelText:h2d.Text;
	private var captainRarityText:h2d.Text;
	private var captainTrait1Text:h2d.Text;
	private var captainTrait2Text:h2d.Text;
	private var captainTrait3Text:h2d.Text;
	private var captainTrait4Text:h2d.Text;
	private var captainTrait5Text:h2d.Text;
	private var stakingIncomeText:h2d.Text;
	private var miningIncomeText:h2d.Text;

	// Ship UI
	private var shipDescFui:h2d.Flow;
	private var shipDescFreePlate:h2d.Object;
	private var shipDescCollectiblePlate:h2d.Object;
	private var shipTypeText:h2d.Text;
	private var shipLevelText:h2d.Text;
	private var shipRarityText:h2d.Text;
	private var shipSizeText:h2d.Text;
	private var shipCannonsText:h2d.Text;
	private var shipCannonsDamageText:h2d.Text;

	private var shipArmorText:h2d.Text;
	private var shipHullText:h2d.Text;
	private var shipMaxSpeedText:h2d.Text;
	private var shipAccText:h2d.Text;
	private var shipAccDelayText:h2d.Text;
	private var shipTurnDelayText:h2d.Text;

	private var shipIntegrityText:h2d.Text;

	// Island UI
	private var islandDescFui:h2d.Flow;
	private var islandTypeText:h2d.Text;
	private var islandLevelText:h2d.Text;
	private var islandRarityText:h2d.Text;
	private var islandSizeText:h2d.Text;
	private var islandTerrainText:h2d.Text;
	private var islandIncomeText:h2d.Text;
	private var islandStartMiningButton:h2d.Object;
	private var islandCollectRewardButton:h2d.Object;

	private var refreshMyNFTsButton:h2d.Object;

	// Daily tasks
	private var dailyTasksFui:h2d.Flow;
	private var playersToKillText:h2d.Text;
	private var botsToKillText:h2d.Text;
	private var bossesToKillText:h2d.Text;

	private final metamaskLoginCallback:String->Void;
	private final startGameCallback:Void->Void;
	private final refreshNFTsCallback:Void->Void;
	private final collectRewardCallback:Void->Void;
	private final startMiningCallback:Void->Void;

	private var uiInitiated = false;

	public function new(metamaskLoginCallback:String->Void, unloggedInitCallback:Void->Void, startGameCallback:Void->Void, refreshNFTsCallback:Void->Void,
			collectRewardCallback:Void->Void, startMiningCallback:Void->Void) {
		super();

		this.metamaskLoginCallback = metamaskLoginCallback;
		this.startGameCallback = startGameCallback;
		this.refreshNFTsCallback = refreshNFTsCallback;
		this.collectRewardCallback = collectRewardCallback;
		this.startMiningCallback = startMiningCallback;

		Main.IsWeb3Available = Moralis.isEthereumBrowser();

		if (!Main.IsWeb3Available) {
			Player.instance.ethAddress = '0x87400A03678dd03c8BF536404B5B14C609a23b79';
			// Player.instance.ethAddress = Uuid.short();

			showMetamaskError(function callback() {
				if (unloggedInitCallback != null) {
					unloggedInitCallback();
				}
			});
		} else {
			Player.instance.ethAddress = Uuid.short();
			showMetamaskLogin(function callback() {
				if (unloggedInitCallback != null) {
					unloggedInitCallback();
				}
			});
		}
	}

	public function initiateWeb3(userName:String) {
		userNameText.text = Utils.MaskEthAddress(userName);

		loginPlate.removeChild(loginBtn);
		addBuyNFTsStuff();

		Rest.instance.getFounderCollections(function callback(founderCollections:FounderCollections) {
			updateFounderCollections(founderCollections);
		});
	}

	public function initiate() {
		init(metamaskLoginCallback);
	}

	// ----------------------------------
	// Widgets
	// ----------------------------------

	public function widePlate(width:Int) {
		return newWidePlate(width);
	}

	public function buttonArrowLeft(callback:Void->Void, isWeb3Related:Bool) {
		return leftArrowButton(callback, isWeb3Related);
	}

	public function buttonArrowRight(callback:Void->Void, isWeb3Related:Bool) {
		return rightArrowButton(callback, isWeb3Related);
	}

	// ----------------------------------
	// Update ui
	// ----------------------------------

	public function updateFounderCollections(founderCollections:FounderCollections) {
		cptLeftText.text = 'Captains left: ' + founderCollections.captainsOnSale;
		shpLeftText.text = 'Ships left: ' + founderCollections.shipsOnSale;
		islLeftText.text = 'Islands left: ' + founderCollections.islandsOnSale;
	}

	public function updateCaptainUi(captainEntity:CaptainEntity) {
		if (captainEntity.type == 1 ? true : false) {
			captainDescFreePlate.alpha = 1;
			captainDescCollectiblePlate.alpha = 0;

			captainTypeText.text = 'Free';
			captainLevelText.text = '0/0';
			captainRarityText.text = 'Rarity: Common';
			captainTrait1Text.alpha = 0;
			captainTrait2Text.alpha = 0;
			captainTrait3Text.alpha = 0;
			captainTrait4Text.alpha = 0;
			captainTrait5Text.alpha = 0;
			stakingIncomeText.alpha = 0;
			miningIncomeText.alpha = 0;
		} else {
			captainDescFreePlate.alpha = 0;
			captainDescCollectiblePlate.alpha = 1;

			captainTypeText.text = 'Collectible';
			captainLevelText.text = captainEntity.level + '/' + 10;
			captainRarityText.text = 'Rarity: ' + captainEntity.rarity;
			captainTrait1Text.text = 'Trait 1: -';
			captainTrait2Text.text = 'Trait 2: -';
			captainTrait3Text.text = 'Trait 3: -';
			captainTrait4Text.text = 'Trait 4: -';
			captainTrait5Text.text = 'Trait 5: -';
			stakingIncomeText.text = 'Staking: ' + captainEntity.stakingRewardNVY + ' NVY/day';
			miningIncomeText.text = 'Mining: ' + captainEntity.miningRewardNVY + ' NVY/day';

			captainTrait1Text.alpha = 1;
			captainTrait2Text.alpha = 1;
			captainTrait3Text.alpha = 1;
			captainTrait4Text.alpha = 1;
			captainTrait5Text.alpha = 1;
			stakingIncomeText.alpha = 1;
			miningIncomeText.alpha = 1;
		}
	}

	public function updateShipUi(shipEntity:ShipEntity) {
		if (shipEntity.type == 1 ? true : false) {
			shipDescFreePlate.alpha = 1;
			shipDescCollectiblePlate.alpha = 0;

			shipTypeText.text = 'Free';
			shipLevelText.text = 'Level: 0/0';
			shipRarityText.text = 'Rarity: Common';
			shipSizeText.text = 'Size: Small';
			shipCannonsText.text = 'Cannons: 2';

			shipArmorText.text = 'Armor: 1000';
			shipHullText.text = 'Hull: 1000';
			shipMaxSpeedText.text = 'Max speed: 100';
			shipAccText.text = 'Acceleration: 50';
			shipAccDelayText.text = 'Acc. delay: 100';
			shipTurnDelayText.text = 'Turn delay: 200';

			shipIntegrityText.alpha = 0;
		} else {
			shipDescFreePlate.alpha = 0;
			shipDescCollectiblePlate.alpha = 1;

			shipTypeText.text = 'Collectible ' + shipEntity.id + '/500';
			shipLevelText.text = 'Level: ' + shipEntity.level + '/' + 10;
			shipRarityText.text = 'Rarity: ' + shipEntity.rarity;
			shipSizeText.text = 'Size: ' + (shipEntity.size == 1 ? 'Small' : 'Middle');
			shipCannonsText.text = 'Cannons: ' + shipEntity.cannons;
			shipArmorText.text = 'Armor: 1000';
			shipHullText.text = 'Hull: 1000';
			shipMaxSpeedText.text = 'Max speed: 100';
			shipAccText.text = 'Acceleration: 50';
			shipAccDelayText.text = 'Acc. delay: 100';
			shipTurnDelayText.text = 'Turn delay: 200';

			shipIntegrityText.alpha = 1;
		}
	}

	public function updateIslandUi(islandEntity:IslandEntity) {
		islandDescFui.alpha = 1;

		islandLevelText.text = 'Level: ' + islandEntity.level + '/' + 3;
		islandRarityText.text = 'Rarity: ' + islandEntity.rarity;
		islandSizeText.text = 'Size: ' + islandEntity.size;
		islandTerrainText.text = 'Terrain: ' + islandEntity.terrain;
		islandIncomeText.text = 'Income: ' + islandEntity.miningRewardNVY + ' NVY/day';

		if (islandEntity.mining) {
			islandCollectRewardButton.alpha = 1;
			islandStartMiningButton.alpha = 0;
		} else {
			islandCollectRewardButton.alpha = 0;
			islandStartMiningButton.alpha = 1;
		}
	}

	public function addOrUpdateDailyTasks() {
		if (dailyTasksFui == null) {
			dailyTasksFui = new h2d.Flow(this);
			dailyTasksFui.layout = Vertical;
			dailyTasksFui.verticalSpacing = 5;
			dailyTasksFui.padding = 10;
			dailyTasksFui.y = 555;
			dailyTasksFui.alpha = 0;

			final dailyTasksPlate = newCustomPlate(dailyTasksFui, 6, 4);
			dailyTasksPlate.setPosition(5, 5);

			final dailyTasksDescription = addText2(dailyTasksPlate, 'Daily tasks:');

			playersToKillText = addText2(dailyTasksPlate, 'Players killed: 0/10');
			playersToKillText.setPosition(dailyTasksDescription.x, 106);
			botsToKillText = addText2(dailyTasksPlate, 'Bots killed: 0/10');
			botsToKillText.setPosition(playersToKillText.x, 186);
			bossesToKillText = addText2(dailyTasksPlate, 'Bosses killed: 0/10');
			bossesToKillText.setPosition(botsToKillText.x, 266);
		}

		if (Player.instance.playerData != null) {
			final playersCurrent = Player.instance.playerData.dailyPlayersKilledCurrent;
			final playersMax = Player.instance.playerData.dailyPlayersKilledMax;
			final botsCurrent = Player.instance.playerData.dailyBotsKilledCurrent;
			final botsMax = Player.instance.playerData.dailyBotsKilledMax;
			final bossesCurrent = Player.instance.playerData.dailyBossesKilledCurrent;
			final bossesMax = Player.instance.playerData.dailyBossesKilledMax;

			playersToKillText.text = 'Players killed: ' + playersCurrent + '/' + playersMax;
			botsToKillText.text = 'Pirates killed: ' + botsCurrent + '/' + botsMax;
			bossesToKillText.text = 'Bosses killed: ' + bossesCurrent + '/' + bossesMax;

			dailyTasksFui.alpha = 1;
		}
	}

	// ----------------------------------
	// Dialogs
	// ----------------------------------

	public function showMetamaskError(callback:Void->Void) {
		alertDialog('Please install Web3 plugin (Crypto.com or MetaMask)\nAll kind of rewards and tokens are not available!', callback);
	}

	public function showMetamaskLogin(callback:Void->Void) {
		alertDialog('You have Web3 plugin installed !\nPlease login and enjoy all game features !', callback);
	}

	// ----------------------------------
	// UI initialization
	// ----------------------------------

	private function init(metamaskLoginCallback:String->Void) {
		if (!uiInitiated) {
			uiInitiated = true;

			final loginFui = new h2d.Flow(this);
			loginFui.layout = Vertical;
			loginFui.verticalSpacing = 5;
			loginFui.padding = 10;

			loginPlate = newCustomPlate(loginFui, Main.IsWeb3Available ? 6 : 5, Main.IsWeb3Available ? 3 : 2);
			loginPlate.setPosition(5, 5);

			userNameText = addText2(loginPlate, "Guest");
			if (Main.IsWeb3Available) {
				loginBtn = addGuiButton(loginPlate, "Login", true, function callback() {
					if (metamaskLoginCallback != null) {
						Moralis.initMoralis(metamaskLoginCallback);
					}
				});
				loginBtn.setPosition(userNameText.x - 10, 100);
			}

			// ---------------------------------
			// Captain UI stuff
			// ---------------------------------

			captainDescFui = new h2d.Flow(this);
			captainDescFui.layout = Vertical;
			captainDescFui.verticalSpacing = 5;
			captainDescFui.padding = 10;
			captainDescFui.x = 635;
			captainDescFui.y = 550;

			final captainPlatesContainer = new h2d.Object(captainDescFui);

			captainDescFreePlate = newCustomPlate(captainPlatesContainer, 5, 3);
			captainDescFreePlate.setPosition(5, 5);

			captainDescCollectiblePlate = newCustomPlate(captainPlatesContainer, 5, 8);
			captainDescCollectiblePlate.setPosition(5, 5);
			captainDescCollectiblePlate.alpha = 0;

			captainTypeText = addText2(captainPlatesContainer, "Free");
			captainLevelText = addText2(captainPlatesContainer, "Level: 0/0");
			captainLevelText.setPosition(captainTypeText.x, 90);

			captainRarityText = addText2(captainPlatesContainer, "Rarity: Common");
			captainRarityText.setPosition(captainLevelText.x, captainLevelText.y + 70);

			captainTrait1Text = addText2(captainPlatesContainer, "Trait 1: -");
			captainTrait1Text.setPosition(captainRarityText.x, captainRarityText.y + 70);
			captainTrait1Text.alpha = 0;

			captainTrait2Text = addText2(captainPlatesContainer, "Trait 2: -");
			captainTrait2Text.setPosition(captainTrait1Text.x, captainTrait1Text.y + 70);
			captainTrait2Text.alpha = 0;

			captainTrait3Text = addText2(captainPlatesContainer, "Trait 3: -");
			captainTrait3Text.setPosition(captainTrait2Text.x, captainTrait2Text.y + 70);
			captainTrait3Text.alpha = 0;

			captainTrait4Text = addText2(captainPlatesContainer, "Trait 4: -");
			captainTrait4Text.setPosition(captainTrait3Text.x, captainTrait3Text.y + 70);
			captainTrait4Text.alpha = 0;

			captainTrait5Text = addText2(captainPlatesContainer, "Trait 5: -");
			captainTrait5Text.setPosition(captainTrait4Text.x, captainTrait4Text.y + 70);
			captainTrait5Text.alpha = 0;

			stakingIncomeText = addText2(captainPlatesContainer, "Staking: 5 NVY/day");
			stakingIncomeText.setPosition(captainTrait5Text.x, captainTrait5Text.y + 70);
			stakingIncomeText.alpha = 0;

			miningIncomeText = addText2(captainPlatesContainer, "Mining: 15 NVY/day");
			miningIncomeText.setPosition(stakingIncomeText.x, stakingIncomeText.y + 70);
			miningIncomeText.alpha = 0;

			// ---------------------------------
			// Ship UI stuff
			// ---------------------------------

			shipDescFui = new h2d.Flow(this);
			shipDescFui.layout = Vertical;
			shipDescFui.verticalSpacing = 5;
			shipDescFui.padding = 10;
			shipDescFui.x = 1550;
			shipDescFui.y = 790;

			final shipPlatesContainer = new h2d.Object(shipDescFui);

			shipDescFreePlate = newCustomPlate(shipPlatesContainer, 5, 9);
			shipDescFreePlate.setPosition(5, 5);

			shipDescCollectiblePlate = newCustomPlate(shipPlatesContainer, 5, 10);
			shipDescCollectiblePlate.setPosition(5, 5);
			shipDescCollectiblePlate.alpha = 0;

			shipTypeText = addText2(shipPlatesContainer, 'Free');
			shipLevelText = addText2(shipPlatesContainer, 'Level: 0/0');
			shipLevelText.setPosition(shipTypeText.x, shipTypeText.y + 70);

			shipRarityText = addText2(shipPlatesContainer, 'Rarity: Common');
			shipRarityText.setPosition(shipLevelText.x, shipLevelText.y + 70);

			shipSizeText = addText2(shipPlatesContainer, 'Size: Small');
			shipSizeText.setPosition(shipRarityText.x, shipRarityText.y + 70);

			shipCannonsText = addText2(shipPlatesContainer, 'Cannons: 2');
			shipCannonsText.setPosition(shipSizeText.x, shipSizeText.y + 70);

			shipCannonsDamageText = addText2(shipPlatesContainer, 'Damage: 50');
			shipCannonsDamageText.setPosition(shipCannonsText.x, shipCannonsText.y + 70);

			shipArmorText = addText2(shipPlatesContainer, 'Armor: 1000');
			shipArmorText.setPosition(shipCannonsDamageText.x, shipCannonsDamageText.y + 70);

			shipHullText = addText2(shipPlatesContainer, 'Hull: 1000');
			shipHullText.setPosition(shipArmorText.x, shipArmorText.y + 70);

			shipMaxSpeedText = addText2(shipPlatesContainer, 'Max speed: 100');
			shipMaxSpeedText.setPosition(shipHullText.x, shipHullText.y + 70);

			shipAccText = addText2(shipPlatesContainer, 'Acceleration: 50');
			shipAccText.setPosition(shipMaxSpeedText.x, shipMaxSpeedText.y + 70);

			shipAccDelayText = addText2(shipPlatesContainer, 'Acc. delay: 100');
			shipAccDelayText.setPosition(shipAccText.x, shipAccText.y + 70);

			shipTurnDelayText = addText2(shipPlatesContainer, 'Turn delay: 200');
			shipTurnDelayText.setPosition(shipAccDelayText.x, shipAccDelayText.y + 70);

			shipIntegrityText = addText2(shipPlatesContainer, 'Integrity: 10/10');
			shipIntegrityText.setPosition(shipTurnDelayText.x, shipTurnDelayText.y + 70);
			shipIntegrityText.alpha = 0;

			// ---------------------------------
			// Island UI stuff
			// ---------------------------------

			islandDescFui = new h2d.Flow(this);
			islandDescFui.layout = Vertical;
			islandDescFui.verticalSpacing = 5;
			islandDescFui.padding = 10;
			islandDescFui.x = 2710;
			islandDescFui.y = 690;
			islandDescFui.alpha = 0;

			final islandDescPlate = newCustomPlate(islandDescFui, 6, 7);

			islandTypeText = addText2(islandDescPlate, "Collectible");
			islandLevelText = addText2(islandDescPlate, "Level: 0/3");
			islandLevelText.setPosition(islandTypeText.x, islandTypeText.y + 70);

			islandRarityText = addText2(islandDescPlate, "Rarity: Legendary");
			islandRarityText.setPosition(islandLevelText.x, islandLevelText.y + 70);

			islandSizeText = addText2(islandDescPlate, "Size: Small");
			islandSizeText.setPosition(islandRarityText.x, islandRarityText.y + 70);

			islandTerrainText = addText2(islandDescPlate, "Terrain: Green");
			islandTerrainText.setPosition(islandSizeText.x, islandSizeText.y + 70);

			islandIncomeText = addText2(islandDescPlate, "Income: 50 NVY/day");
			islandIncomeText.setPosition(islandTerrainText.x, islandTerrainText.y + 70);

			final islandButtonsContainer = new h2d.Object(islandDescPlate);

			islandCollectRewardButton = addGuiButton(islandButtonsContainer, "Collect reward", false, collectRewardCallback, 5, 4);
			islandCollectRewardButton.setPosition(islandIncomeText.x - 15, islandIncomeText.y + 90);
			islandCollectRewardButton.alpha = 0;

			islandStartMiningButton = addGuiButton(islandButtonsContainer, "Start mining", false, startMiningCallback, 5, 4);
			islandStartMiningButton.setPosition(islandIncomeText.x - 15, islandIncomeText.y + 90);

			// Play button
			final startGameButton = addGuiButton(this, "Start game", false, startGameCallback);
			startGameButton.setPosition(Main.ScreenWidth / 2 - 300, Main.ScreenHeight - 100);

			addOrUpdateDailyTasks();
		}
	}

	private function addBuyNFTsStuff() {
		// Refresh my NFTs button
		refreshMyNFTsButton = addGuiButton(this, "Refresh my NFTs", false, refreshNFTsCallback, 5, 4);
		refreshMyNFTsButton.setPosition(userNameText.x - 10, 100);

		final buyButtonsFui = new h2d.Flow(this);
		buyButtonsFui.layout = Vertical;
		buyButtonsFui.verticalSpacing = 5;
		buyButtonsFui.padding = 10;
		buyButtonsFui.y = Main.ScreenHeight - (32 * 4 * 6);

		// TODO add plate about how many tokens left
		final salePlate = newCustomPlate(buyButtonsFui, 5, 3);
		salePlate.setPosition(5, 5);

		cptLeftText = addText2(salePlate, "Captains left: -");
		shpLeftText = addText2(salePlate, "Ships left: -");
		shpLeftText.setPosition(cptLeftText.x, 106);
		islLeftText = addText2(salePlate, "Islands left: -");
		islLeftText.setPosition(cptLeftText.x, 186);

		addGuiButton(buyButtonsFui, "Buy captain", true, function callback() {
			Moralis.buyFounderCaptain(function successCallback() {
				alertDialog('You have bought founder edition captain !\nStay a while and listen...while Cronos processing it.', callback);
			}, function errorCallback() {
				alertDialog('Error occured during captain buying !\nPlease report to us or try again !', callback);
			});
		});
		addGuiButton(buyButtonsFui, "Buy ship", true, function callback() {
			Moralis.buyFounderShip(function successCallback() {
				alertDialog('You have bought founder edition ship !\nStay a while and listen...while Cronos processing it.', callback);
			}, function errorCallback() {
				alertDialog('Error occured during ship buying !\nPlease report to us or try again !', callback);
			});
		});
		addGuiButton(buyButtonsFui, "Buy island", true, function callback() {
			Moralis.buyFounderIsland(function successCallback() {
				alertDialog('You have bought founder edition island !\nStay a while and listen...while Cronos processing it.', callback);
			}, function errorCallback() {
				alertDialog('Error occured during island buying !\nPlease report to us or try again !', callback);
			});
		});
	}
}
