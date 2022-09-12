package client.ui;

class UiAvatar extends h2d.Object {
	public function new() {
		super();

		final boardTile = hxd.Res.board.toTile();
		final boardBmp = new h2d.Bitmap(boardTile);

		final bodyTile = hxd.Res.captain_avatar.body.toTile();
		final bodyBmp = new h2d.Bitmap(bodyTile);
		bodyBmp.setPosition(9, 9);

		final head1Tile = hxd.Res.captain_avatar.heads.head_1.toTile();
		final head2Tile = hxd.Res.captain_avatar.heads.head_2.toTile();
		final head3Tile = hxd.Res.captain_avatar.heads.head_3.toTile();
		final head4Tile = hxd.Res.captain_avatar.heads.head_4.toTile();
		final headBmp = new h2d.Bitmap(head4Tile);
		headBmp.setPosition(9, 9);

		final hat1Tile = hxd.Res.captain_avatar.hats.hat_1.toTile();
		final hat2Tile = hxd.Res.captain_avatar.hats.hat_2.toTile();
		final hat3Tile = hxd.Res.captain_avatar.hats.hat_3.toTile();
		final hat4Tile = hxd.Res.captain_avatar.hats.hat_4.toTile();
		final hat5Tile = hxd.Res.captain_avatar.hats.hat_5.toTile();
		final hatBmp = new h2d.Bitmap(hat5Tile);
		hatBmp.setPosition(9, 9);

		final hair1Tile = hxd.Res.captain_avatar.haircuts.haircut_1.toTile();
		final hair2Tile = hxd.Res.captain_avatar.haircuts.haircut_2.toTile();
		final hair3Tile = hxd.Res.captain_avatar.haircuts.haircut_3.toTile();
		final hair4Tile = hxd.Res.captain_avatar.haircuts.haircut_4.toTile();
		final hairBmp = new h2d.Bitmap(hair4Tile);
		hairBmp.setPosition(9, 9);

		final clothes1Tile = hxd.Res.captain_avatar.clothes.clothes_1.toTile();
		final clothes2Tile = hxd.Res.captain_avatar.clothes.clothes_2.toTile();
		final clothes3Tile = hxd.Res.captain_avatar.clothes.clothes_3.toTile();
		final clothes4Tile = hxd.Res.captain_avatar.clothes.clothes_4.toTile();
		final clothes5Tile = hxd.Res.captain_avatar.clothes.clothes_5.toTile();
		final clothes6Tile = hxd.Res.captain_avatar.clothes.clothes_6.toTile();
		final clothesBmp = new h2d.Bitmap(clothes6Tile);
		clothesBmp.setPosition(9, 9);

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
		final bgBmp = new h2d.Bitmap(bg10Tile);
		bgBmp.setPosition(9, 9);

		final acc1Tile = hxd.Res.captain_avatar.accessories.acc_1.toTile();
		final acc2Tile = hxd.Res.captain_avatar.accessories.acc_2.toTile();
		final acc3Tile = hxd.Res.captain_avatar.accessories.acc_3.toTile();
		final acc4Tile = hxd.Res.captain_avatar.accessories.acc_4.toTile();
		final acc5Tile = hxd.Res.captain_avatar.accessories.acc_5.toTile();
		final accBmp = new h2d.Bitmap(acc5Tile);
		accBmp.setPosition(9, 9);

		addChild(boardBmp);
		setScale(2);
		setPosition(16, 16);

		addChild(bgBmp);
		addChild(bodyBmp);
		addChild(headBmp);
		addChild(accBmp);
		addChild(hairBmp);
		addChild(hatBmp);
		addChild(clothesBmp);
	}
}
