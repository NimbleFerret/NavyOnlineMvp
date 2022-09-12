package client.ui;

class UiToken extends h2d.Object {
	private final text:h2d.Text;

	public function new(plate:h2d.Object) {
		super();

		addChild(plate);

		var coinTile = hxd.Res.coin.toTile();
		coinTile = coinTile.center();
		final coinBmp = new h2d.Bitmap(coinTile);
		coinBmp.setPosition(54, 45);
		coinBmp.setScale(4);
		addChild(coinBmp);

		text = new h2d.Text(hxd.res.DefaultFont.get(), this);
		text.text = '0';
		text.setScale(6);
		text.textColor = 0x82590E;
		text.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};
		text.setPosition(288 - (text.textWidth * 6) - 32, -4);
	}
}
