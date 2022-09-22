package client.scene;

import client.gameplay.BaiscHud.BasicHud;

class SceneGlobalModeUi extends BasicHud {
	public function new(mainMenuCallback:Void->Void) {
		super();

		// Map background

		final mapPlate = newCustomPlate(this, 16, 16);
		mapPlate.setPosition(32, 36);

		// Menu

		final mainMenuBtn = addGuiButton(this, "Main menu", false, mainMenuCallback, 2, 2);
		mainMenuBtn.x = 1080;
		mainMenuBtn.y = 32;

		final menuPlate = newCustomPlate(this, 5, 7);
		menuPlate.setPosition(1086, 128);

		final sanctuaryIcon = new h2d.Bitmap(SceneGlobalMode.AcnhorTile);
		sanctuaryIcon.setScale(0.75);
		sanctuaryIcon.setPosition(menuPlate.x + 20, menuPlate.y + 20);
		this.addChild(sanctuaryIcon);

		final sanctuaryText = addText2(this, "Sanctuary");
		sanctuaryText.setPosition(menuPlate.x + 100, menuPlate.y + 40);

		final islandIcon = new h2d.Bitmap(SceneGlobalMode.IslandTile);
		islandIcon.setScale(0.75);
		islandIcon.setPosition(menuPlate.x + 20, menuPlate.y + 90);
		this.addChild(islandIcon);

		final islandText = addText2(this, "Island");
		islandText.setPosition(menuPlate.x + 100, menuPlate.y + 110);

		final pinkSkullIcon = new h2d.Bitmap(SceneGlobalMode.PinkSkullTile);
		pinkSkullIcon.setPosition(menuPlate.x + 10, menuPlate.y + 150);

		final pvpText = addText2(this, "PVP");
		pvpText.setPosition(menuPlate.x + 100, menuPlate.y + 175);

		final blueSkullIcon = new h2d.Bitmap(SceneGlobalMode.BlueSkullTile);
		blueSkullIcon.setPosition(menuPlate.x + 10, menuPlate.y + 210);

		final bossText = addText2(this, "BOSS");
		bossText.setPosition(menuPlate.x + 100, menuPlate.y + 235);

		final commonSkullIcon = new h2d.Bitmap(SceneGlobalMode.CommonSkullTile);
		commonSkullIcon.setPosition(menuPlate.x + 10, menuPlate.y + 270);

		final piratesText = addText2(this, "Pirates");
		piratesText.setPosition(menuPlate.x + 100, menuPlate.y + 295);

		final descText = addText2(this, "Move by 1 sector");
		descText.setPosition(piratesText.x - 50, piratesText.y + 70);

		pinkSkullIcon.setScale(1.5);
		pinkSkullIcon.setPosition(pinkSkullIcon.x + 24, pinkSkullIcon.y + 24);
		blueSkullIcon.setScale(1.5);
		blueSkullIcon.setPosition(blueSkullIcon.x + 24, blueSkullIcon.y + 24);
		commonSkullIcon.setScale(1.5);
		commonSkullIcon.setPosition(commonSkullIcon.x + 24, commonSkullIcon.y + 24);

		this.addChild(pinkSkullIcon);
		this.addChild(blueSkullIcon);
		this.addChild(commonSkullIcon);
	}
}
