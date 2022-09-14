package client.scene;

import client.network.Rest;
import client.network.RestProtocol.FounderCollections;
import h2d.Object;
import client.scene.SceneMain.IslandInfo;
import client.scene.SceneMain.ShipInfo;
import client.scene.SceneMain.CaptainInfo;
import client.gameplay.BaiscHud.BasicHud;
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
	private var shipTrait1Text:h2d.Text;
	private var shipTrait2Text:h2d.Text;
	private var shipTrait3Text:h2d.Text;
	private var shipTrait4Text:h2d.Text;
	private var shipTrait5Text:h2d.Text;
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

	private final startGameCallback:Void->Void;
	private final refreshNFTsCallback:Void->Void;

	public function new(metamaskLoginCallback:String->Void, unloggedInitCallback:Void->Void, startGameCallback:Void->Void, refreshNFTsCallback:Void->Void) {
		super();

		this.startGameCallback = startGameCallback;
		this.refreshNFTsCallback = refreshNFTsCallback;

		Main.IsWeb3Available = Moralis.isEthereumBrowser();

		if (!Main.IsWeb3Available) {
			Player.instance.ethAddress = Uuid.short();
			showMetamaskError(function callback() {
				init(null);
				if (unloggedInitCallback != null) {
					unloggedInitCallback();
				}
			});
		} else {
			Player.instance.ethAddress = Uuid.short();
			showMetamaskLogin(function callback() {
				init(metamaskLoginCallback);
				if (unloggedInitCallback != null) {
					unloggedInitCallback();
				}
			});
		}
	}

	public function initiateWeb3(userName:String) {
		userNameText.text = userName.substring(0, 4) + '...' + userName.substring(userName.length - 4, userName.length);

		loginPlate.removeChild(loginBtn);
		addBuyNFTsStuff();

		Rest.instance.getFounderCollections(function callback(founderCollections:FounderCollections) {
			updateFounderCollections(founderCollections);
		});
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

	public function updateCaptainUi(captainInfo:CaptainInfo) {
		if (captainInfo.free) {
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
			captainLevelText.text = captainInfo.currentLevel + '/' + captainInfo.maxLevel;
			captainRarityText.text = 'Rarity: ' + captainInfo.rarity;
			captainTrait1Text.text = 'Trait 1: ' + captainInfo.trait1;
			captainTrait2Text.text = 'Trait 2: ' + captainInfo.trait2;
			captainTrait3Text.text = 'Trait 3: ' + captainInfo.trait3;
			captainTrait4Text.text = 'Trait 4: ' + captainInfo.trait4;
			captainTrait5Text.text = 'Trait 5: ' + captainInfo.trait5;
			stakingIncomeText.text = 'Staking: ' + captainInfo.stakingIncome + ' NVY/day';
			miningIncomeText.text = 'Mining: ' + captainInfo.miningIncome + ' NVY/day';

			captainTrait1Text.alpha = 1;
			captainTrait2Text.alpha = 1;
			captainTrait3Text.alpha = 1;
			captainTrait4Text.alpha = 1;
			captainTrait5Text.alpha = 1;
			stakingIncomeText.alpha = 1;
			miningIncomeText.alpha = 1;
		}
	}

	public function updateShipUi(shipInfo:ShipInfo) {
		if (shipInfo.free) {
			shipDescFreePlate.alpha = 1;
			shipDescCollectiblePlate.alpha = 0;

			shipTypeText.text = 'Free';
			shipLevelText.text = '0/0';
			shipRarityText.text = 'Rarity: Common';
			shipSizeText.text = 'Size: Small';
			shipCannonsText.text = 'Cannons: 2';

			shipTrait1Text.alpha = 0;
			shipTrait2Text.alpha = 0;
			shipTrait3Text.alpha = 0;
			shipTrait4Text.alpha = 0;
			shipTrait5Text.alpha = 0;
			shipIntegrityText.alpha = 0;
		} else {
			shipDescFreePlate.alpha = 0;
			shipDescCollectiblePlate.alpha = 1;

			shipTypeText.text = 'Collectible';
			shipLevelText.text = shipInfo.currentLevel + '/' + shipInfo.maxLevel;
			shipRarityText.text = 'Rarity: ' + shipInfo.rarity;
			shipSizeText.text = 'Size: ' + shipInfo.size;
			shipCannonsText.text = 'Cannons: ' + shipInfo.cannons;
			shipTrait1Text.text = 'Trait 1: ' + shipInfo.trait1;
			shipTrait2Text.text = 'Trait 2: ' + shipInfo.trait2;
			shipTrait3Text.text = 'Trait 3: ' + shipInfo.trait3;
			shipTrait4Text.text = 'Trait 4: ' + shipInfo.trait4;
			shipTrait5Text.text = 'Trait 5: ' + shipInfo.trait5;

			shipTrait1Text.alpha = 1;
			shipTrait2Text.alpha = 1;
			shipTrait3Text.alpha = 1;
			shipTrait4Text.alpha = 1;
			shipTrait5Text.alpha = 1;
			shipIntegrityText.alpha = 1;
		}
	}

	public function updateIslandUi(islandInfo:IslandInfo) {
		islandLevelText.text = 'Level: ' + islandInfo.currentLevel + '/' + islandInfo.maxLevel;
		islandRarityText.text = 'Rarity: ' + islandInfo.rarity;
		islandSizeText.text = 'Size: ' + islandInfo.size;
		islandTerrainText.text = 'Terrain: ' + islandInfo.terrain;
		islandIncomeText.text = 'Income: ' + islandInfo.income + ' NVY/day';

		if (islandInfo.mining) {
			islandCollectRewardButton.alpha = 1;
			islandStartMiningButton.alpha = 0;
		} else {
			islandCollectRewardButton.alpha = 0;
			islandStartMiningButton.alpha = 1;
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
		captainDescFui.x = 435;
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
		shipDescFui.x = 1350;
		shipDescFui.y = 790;

		final shipPlatesContainer = new h2d.Object(shipDescFui);

		shipDescFreePlate = newCustomPlate(shipPlatesContainer, 5, 4);
		shipDescFreePlate.setPosition(5, 5);

		shipDescCollectiblePlate = newCustomPlate(shipPlatesContainer, 5, 9);
		shipDescCollectiblePlate.setPosition(5, 5);
		shipDescCollectiblePlate.alpha = 0;

		shipTypeText = addText2(shipPlatesContainer, "Free");
		shipLevelText = addText2(shipPlatesContainer, "Level: 0/0");
		shipLevelText.setPosition(shipTypeText.x, shipTypeText.y + 70);

		shipRarityText = addText2(shipPlatesContainer, "Rarity: Common");
		shipRarityText.setPosition(shipLevelText.x, shipLevelText.y + 70);

		shipSizeText = addText2(shipPlatesContainer, "Size: Small");
		shipSizeText.setPosition(shipRarityText.x, shipRarityText.y + 70);

		shipCannonsText = addText2(shipPlatesContainer, "Cannons: 2");
		shipCannonsText.setPosition(shipSizeText.x, shipSizeText.y + 70);

		shipTrait1Text = addText2(shipPlatesContainer, "Trait 1: -");
		shipTrait1Text.setPosition(shipCannonsText.x, shipCannonsText.y + 70);
		shipTrait1Text.alpha = 0;

		shipTrait2Text = addText2(shipPlatesContainer, "Trait 2: -");
		shipTrait2Text.setPosition(shipTrait1Text.x, shipTrait1Text.y + 70);
		shipTrait2Text.alpha = 0;

		shipTrait3Text = addText2(shipPlatesContainer, "Trait 3: -");
		shipTrait3Text.setPosition(shipTrait2Text.x, shipTrait2Text.y + 70);
		shipTrait3Text.alpha = 0;

		shipTrait4Text = addText2(shipPlatesContainer, "Trait 4: -");
		shipTrait4Text.setPosition(shipTrait3Text.x, shipTrait3Text.y + 70);
		shipTrait4Text.alpha = 0;

		shipTrait5Text = addText2(shipPlatesContainer, "Trait 5: -");
		shipTrait5Text.setPosition(shipTrait4Text.x, shipTrait4Text.y + 70);
		shipTrait5Text.alpha = 0;

		shipIntegrityText = addText2(shipPlatesContainer, "Integrity: 10/10");
		shipIntegrityText.setPosition(shipTrait5Text.x, shipTrait5Text.y + 70);
		shipIntegrityText.alpha = 0;

		// ---------------------------------
		// Island UI stuff
		// ---------------------------------

		islandDescFui = new h2d.Flow(this);
		islandDescFui.layout = Vertical;
		islandDescFui.verticalSpacing = 5;
		islandDescFui.padding = 10;
		islandDescFui.x = 2510;
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

		islandCollectRewardButton = addGuiButton(islandButtonsContainer, "Collect reward", false, null, 5, 4);
		islandCollectRewardButton.setPosition(islandIncomeText.x - 15, islandIncomeText.y + 90);
		islandCollectRewardButton.alpha = 0;

		islandStartMiningButton = addGuiButton(islandButtonsContainer, "Start mining", false, null, 5, 4);
		islandStartMiningButton.setPosition(islandIncomeText.x - 15, islandIncomeText.y + 90);

		// Play button
		final startGameButton = addGuiButton(this, "Start game", false, startGameCallback);
		startGameButton.setPosition(Main.ScreenWidth / 2 - 500, Main.ScreenHeight - 200);
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
			Moralis.buyFounderCaptain();
		});
		addGuiButton(buyButtonsFui, "Buy ship", true, function callback() {
			Moralis.buyFounderShip();
		});
		addGuiButton(buyButtonsFui, "Buy island", true, function callback() {
			Moralis.buyFounderIsland();
		});
	}
}
