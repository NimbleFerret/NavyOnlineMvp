package client.ui.components;

class UiAvatar extends h2d.Object {
	final boardTile = hxd.Res.board.toTile();

	final bodyTile = hxd.Res.captain_avatar.body.toTile();

	final head1Tile = hxd.Res.captain_avatar.heads.head_1.toTile();
	final head2Tile = hxd.Res.captain_avatar.heads.head_2.toTile();
	final head3Tile = hxd.Res.captain_avatar.heads.head_3.toTile();
	final head4Tile = hxd.Res.captain_avatar.heads.head_4.toTile();

	final hat1Tile = hxd.Res.captain_avatar.hats.hat_1.toTile();
	final hat2Tile = hxd.Res.captain_avatar.hats.hat_2.toTile();
	final hat3Tile = hxd.Res.captain_avatar.hats.hat_3.toTile();
	final hat4Tile = hxd.Res.captain_avatar.hats.hat_4.toTile();
	final hat5Tile = hxd.Res.captain_avatar.hats.hat_5.toTile();

	final hair1Tile = hxd.Res.captain_avatar.haircuts.haircut_1.toTile();
	final hair2Tile = hxd.Res.captain_avatar.haircuts.haircut_2.toTile();
	final hair3Tile = hxd.Res.captain_avatar.haircuts.haircut_3.toTile();
	final hair4Tile = hxd.Res.captain_avatar.haircuts.haircut_4.toTile();

	final clothes1Tile = hxd.Res.captain_avatar.clothes.clothes_1.toTile();
	final clothes2Tile = hxd.Res.captain_avatar.clothes.clothes_2.toTile();
	final clothes3Tile = hxd.Res.captain_avatar.clothes.clothes_3.toTile();
	final clothes4Tile = hxd.Res.captain_avatar.clothes.clothes_4.toTile();
	final clothes5Tile = hxd.Res.captain_avatar.clothes.clothes_5.toTile();
	final clothes6Tile = hxd.Res.captain_avatar.clothes.clothes_6.toTile();

	final bg1Tile = hxd.Res.captain_avatar.bgs.bg_1.toTile();
	final bg2Tile = hxd.Res.captain_avatar.bgs.bg_2.toTile();
	final bg3Tile = hxd.Res.captain_avatar.bgs.bg_3.toTile();
	final bg4Tile = hxd.Res.captain_avatar.bgs.bg_4.toTile();
	final bg5Tile = hxd.Res.captain_avatar.bgs.bg_5.toTile();
	final bg6Tile = hxd.Res.captain_avatar.bgs.bg_6.toTile();
	final bg7Tile = hxd.Res.captain_avatar.bgs.bg_7.toTile();
	final bg8Tile = hxd.Res.captain_avatar.bgs.bg_8.toTile();
	final bg9Tile = hxd.Res.captain_avatar.bgs.bg_9.toTile();
	final bg10Tile = hxd.Res.captain_avatar.bgs.bg_10.toTile();
	final bg11Tile = hxd.Res.captain_avatar.bgs.bg_11.toTile();
	final bg12Tile = hxd.Res.captain_avatar.bgs.bg_12.toTile();

	final acc1Tile = hxd.Res.captain_avatar.accessories.acc_1.toTile();
	final acc2Tile = hxd.Res.captain_avatar.accessories.acc_2.toTile();
	final acc3Tile = hxd.Res.captain_avatar.accessories.acc_3.toTile();
	final acc4Tile = hxd.Res.captain_avatar.accessories.acc_4.toTile();
	final acc5Tile = hxd.Res.captain_avatar.accessories.acc_5.toTile();

	private var boardBmp:h2d.Bitmap;
	private var bodyBmp:h2d.Bitmap;
	private var headBmp:h2d.Bitmap;
	private var haircutOrHatBmp:h2d.Bitmap;
	private var clothesBmp:h2d.Bitmap;
	private var bgBmp:h2d.Bitmap;
	private var accBmp:h2d.Bitmap;

	public function new() {
		super();

		boardBmp = new h2d.Bitmap(boardTile);
		bodyBmp = new h2d.Bitmap(bodyTile);
		headBmp = new h2d.Bitmap();
		haircutOrHatBmp = new h2d.Bitmap();
		clothesBmp = new h2d.Bitmap();
		bgBmp = new h2d.Bitmap();
		accBmp = new h2d.Bitmap();

		setVisuals(3, 0, 3, 3, 1);

		bodyBmp.setPosition(9, 9);
		headBmp.setPosition(9, 9);
		haircutOrHatBmp.setPosition(9, 9);
		clothesBmp.setPosition(9, 9);
		bgBmp.setPosition(9, 9);
		accBmp.setPosition(9, 9);

		addChild(boardBmp);
		setScale(1.5);
		setPosition(16, 16);

		addChild(bgBmp);
		addChild(bodyBmp);
		addChild(headBmp);
		addChild(accBmp);
		addChild(haircutOrHatBmp);
		addChild(clothesBmp);
	}

	public function setVisuals(head:Int, haircutOrHat:Int, clothes:Int, bg:Int, acc:Int) {
		switch (head) {
			case 1:
				headBmp.tile = head1Tile;
			case 2:
				headBmp.tile = head2Tile;
			case 3:
				headBmp.tile = head3Tile;
			case 4:
				headBmp.tile = head4Tile;
		}

		switch (haircutOrHat) {
			case 1:
				haircutOrHatBmp.tile = hair1Tile;
			case 2:
				haircutOrHatBmp.tile = hair2Tile;
			case 3:
				haircutOrHatBmp.tile = hair3Tile;
			case 4:
				haircutOrHatBmp.tile = hair4Tile;
			case 5:
				haircutOrHatBmp.tile = hat1Tile;
			case 6:
				haircutOrHatBmp.tile = hat2Tile;
			case 7:
				haircutOrHatBmp.tile = hat3Tile;
			case 8:
				haircutOrHatBmp.tile = hat4Tile;
			case 9:
				haircutOrHatBmp.tile = hat5Tile;
		}

		switch (clothes) {
			case 1:
				clothesBmp.tile = clothes1Tile;
			case 2:
				clothesBmp.tile = clothes2Tile;
			case 3:
				clothesBmp.tile = clothes3Tile;
			case 4:
				clothesBmp.tile = clothes4Tile;
			case 5:
				clothesBmp.tile = clothes5Tile;
			case 6:
				clothesBmp.tile = clothes6Tile;
		}

		switch (bg) {
			case 1:
				bgBmp.tile = bg1Tile;
			case 2:
				bgBmp.tile = bg2Tile;
			case 3:
				bgBmp.tile = bg3Tile;
			case 4:
				bgBmp.tile = bg4Tile;
			case 5:
				bgBmp.tile = bg5Tile;
			case 6:
				bgBmp.tile = bg6Tile;
			case 7:
				bgBmp.tile = bg7Tile;
			case 8:
				bgBmp.tile = bg8Tile;
			case 9:
				bgBmp.tile = bg9Tile;
			case 10:
				bgBmp.tile = bg10Tile;
			case 11:
				bgBmp.tile = bg11Tile;
			case 12:
				bgBmp.tile = bg12Tile;
		}

		if (acc != 0) {
			switch (acc) {
				case 1:
					accBmp.tile = acc1Tile;
				case 2:
					accBmp.tile = acc2Tile;
				case 3:
					accBmp.tile = acc3Tile;
				case 4:
					accBmp.tile = acc4Tile;
				case 5:
					accBmp.tile = acc5Tile;
			}
			accBmp.alpha = 1;
		} else {
			accBmp.alpha = 0;
		}
	}
}
