package client.scene;

import client.gameplay.BaiscHud.BasicHud;

class SceneGlobalModeUi extends BasicHud {
	public function new(mainMenuCallback:Void->Void) {
		super();

		// Map background

		final mapPlate = newCustomPlate(this, 16, 16);
		mapPlate.setPosition(45, 45);

		// Menu

		final mainMenuBtn = addGuiButton(this, "Main menu", false, mainMenuCallback);
		mainMenuBtn.x = 1600;
		mainMenuBtn.y = 32;

		final menuPlate = newCustomPlate(this, 5, 6);
		menuPlate.setPosition(1615, 185);

		final sanctuaryIcon = new h2d.Bitmap(SceneGlobalMode.AcnhorTile);
		sanctuaryIcon.setPosition(menuPlate.x + 10, menuPlate.y + 20);
		this.addChild(sanctuaryIcon);

		final sanctuaryText = addText2(this, "Sanctuary");
		sanctuaryText.setPosition(menuPlate.x + 120, menuPlate.y + 40);

		final islandIcon = new h2d.Bitmap(SceneGlobalMode.IslandTile);
		islandIcon.setPosition(menuPlate.x + 10, menuPlate.y + 120);
		this.addChild(islandIcon);

		final islandText = addText2(this, "Island");
		islandText.setPosition(menuPlate.x + 120, menuPlate.y + 130);

		final pinkSkullIcon = new h2d.Bitmap(SceneGlobalMode.PinkSkullTile);
		pinkSkullIcon.setPosition(menuPlate.x + 10, menuPlate.y + 210);

		final pvpText = addText2(this, "PVP");
		pvpText.setPosition(menuPlate.x + 120, menuPlate.y + 220);

		final blueSkullIcon = new h2d.Bitmap(SceneGlobalMode.BlueSkullTile);
		blueSkullIcon.setPosition(menuPlate.x + 10, menuPlate.y + 300);

		final bossText = addText2(this, "BOSS");
		bossText.setPosition(menuPlate.x + 120, menuPlate.y + 310);

		final commonSkullIcon = new h2d.Bitmap(SceneGlobalMode.CommonSkullTile);
		commonSkullIcon.setPosition(menuPlate.x + 10, menuPlate.y + 390);

		final piratesText = addText2(this, "Pirates");
		piratesText.setPosition(menuPlate.x + 120, menuPlate.y + 400);

		pinkSkullIcon.setScale(2);
		pinkSkullIcon.setPosition(pinkSkullIcon.x + 24, pinkSkullIcon.y + 24);
		blueSkullIcon.setScale(2);
		blueSkullIcon.setPosition(blueSkullIcon.x + 24, blueSkullIcon.y + 24);
		commonSkullIcon.setScale(2);
		commonSkullIcon.setPosition(commonSkullIcon.x + 24, commonSkullIcon.y + 24);

		this.addChild(pinkSkullIcon);
		this.addChild(blueSkullIcon);
		this.addChild(commonSkullIcon);
	}
}
