package client.scene;

import uuid.Uuid;
import client.gameplay.BaiscHud.BasicHud;

class SceneMainHud extends BasicHud {
	private final userNameText:h2d.Text;

	private final startGameCallback:Void->Void;

	public function new(metamaskLoginCallback:String->Void, startGameCallback:Void->Void) {
		super();

		this.startGameCallback = startGameCallback;

		Main.IsWeb3Available = Moralis.isEthereumBrowser();

		// Login UI

		final loginFui = new h2d.Flow(this);
		loginFui.layout = Vertical;
		loginFui.verticalSpacing = 5;
		loginFui.padding = 10;

		final loginPlate = newCustomPlate(loginFui, 5, 3);
		loginPlate.setPosition(5, 5);

		userNameText = addText2(loginPlate, "Guest");
		final loginBtn = addGuiButton(loginPlate, "Login", true, function callback() {
			Moralis.initMoralis(metamaskLoginCallback);
		});
		loginBtn.setPosition(userNameText.x - 10, 100);

		// Buy founders NFT UI

		final buyButtonsFui = new h2d.Flow(this);
		buyButtonsFui.layout = Vertical;
		buyButtonsFui.verticalSpacing = 5;
		buyButtonsFui.padding = 10;
		buyButtonsFui.y = Main.ScreenHeight - (32 * 4 * 6);

		// TODO add plate about how many tokens left
		final salePlate = newCustomPlate(buyButtonsFui, 5, 3);
		salePlate.setPosition(5, 5);

		final cptLeftText = addText2(salePlate, "Captains left: 100");
		final shpLeftText = addText2(salePlate, "Ships left: 100");
		shpLeftText.setPosition(cptLeftText.x, 106);
		final islLeftText = addText2(salePlate, "Islands left: 100");
		islLeftText.setPosition(cptLeftText.x, 186);

		addGuiButton(buyButtonsFui, "Buy captain", true, null);
		addGuiButton(buyButtonsFui, "Buy ship", true, null);
		addGuiButton(buyButtonsFui, "Buy island", true, null);

		// Captain description
		final captainDescFui = new h2d.Flow(this);
		captainDescFui.layout = Vertical;
		captainDescFui.verticalSpacing = 5;
		captainDescFui.padding = 10;
		captainDescFui.x = 490;
		captainDescFui.y = 550;

		final captainDescPlate = newCustomPlate(captainDescFui, 4, 3);
		captainDescPlate.setPosition(5, 5);

		final captainDescTextType = addText2(captainDescPlate, "Free");
		final captainDescTextLevel = addText2(captainDescPlate, "Level: 0/0");
		captainDescTextLevel.setPosition(captainDescTextType.x, 106);

		// Ship description
		final shipDescFui = new h2d.Flow(this);
		shipDescFui.layout = Vertical;
		shipDescFui.verticalSpacing = 5;
		shipDescFui.padding = 10;
		shipDescFui.x = 1350;
		shipDescFui.y = 790;

		final shipDescPlate = newCustomPlate(shipDescFui, 5, 4);
		shipDescPlate.setPosition(5, 5);

		final shipDescTextType = addText2(shipDescPlate, "Free");
		final shipDescTextLevel = addText2(shipDescPlate, "Level: 0/0");
		shipDescTextLevel.setPosition(shipDescTextType.x, 106);

		if (!Main.IsWeb3Available) {
			Player.instance.ethAddress = Uuid.short();
			showMetamaskError(function callback() {
				addPlayButton();
			});
		} else {
			addPlayButton();
		}
	}

	private function addPlayButton() {
		final startGameButton = addGuiButton(this, "Start game", false, startGameCallback);
		startGameButton.setPosition(Main.ScreenWidth / 2 - 500, Main.ScreenHeight - 600);
	}

	public function setUserNameWeb3(userName:String) {
		userNameText.text = userName.substring(0, 4) + '...' + userName.substring(userName.length - 4, userName.length);
	}

	public function widePlate(width:Int) {
		return newWidePlate(width);
	}

	public function buttonArrowLeft(callback:Void->Void, isWeb3Related:Bool) {
		return leftArrowButton(callback, isWeb3Related);
	}

	public function buttonArrowRight(callback:Void->Void, isWeb3Related:Bool) {
		return rightArrowButton(callback, isWeb3Related);
	}

	public function showMetamaskError(callback:Void->Void) {
		alertDialog('Please install Web3 plugin (Crypto.com or MetaMask)\nAll kind of rewards and tokens are not available!', callback);
	}
}
