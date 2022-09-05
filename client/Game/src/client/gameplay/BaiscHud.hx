package client.gameplay;

class BasicHud extends h2d.Scene {
	var fui:h2d.Flow;

	// Dialog tiles
	private final paperUiTileImage:h2d.Tile;

	private final dialogTopLeftTile:h2d.Tile;
	private final dialogTopMiddleTile:h2d.Tile;
	private final dialogTopRightTile:h2d.Tile;

	private final dialogMiddleLeftTile:h2d.Tile;
	private final dialogMiddleMiddleTile:h2d.Tile;
	private final dialogMiddleRightTile:h2d.Tile;

	private final dialogBottomLeftTile:h2d.Tile;
	private final dialogBottomMiddleTile:h2d.Tile;
	private final dialogBottomRightTile:h2d.Tile;

	private final positiveTile:h2d.Tile;
	private final negativeTile:h2d.Tile;

	private final longButtonTile:h2d.Tile;
	private final midButtonTile:h2d.Tile;

	public function new() {
		super();

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.y = 10;

		// Ui stuff

		// get tile image (tiles.png) from resources
		paperUiTileImage = hxd.Res.gui_paper.toTile();

		dialogTopLeftTile = paperUiTileImage.sub(32 * 1, 32, 32, 32);
		dialogTopMiddleTile = paperUiTileImage.sub(32 * 2, 32, 32, 32);
		dialogTopRightTile = paperUiTileImage.sub(32 * 3, 32, 32, 32);

		dialogMiddleLeftTile = paperUiTileImage.sub(32 * 1, 64, 32, 32);
		dialogMiddleMiddleTile = paperUiTileImage.sub(32 * 2, 64, 32, 32);
		dialogMiddleRightTile = paperUiTileImage.sub(32 * 3, 64, 32, 32);

		dialogBottomLeftTile = paperUiTileImage.sub(32 * 1, 96, 32, 32);
		dialogBottomMiddleTile = paperUiTileImage.sub(32 * 2, 96, 32, 32);
		dialogBottomRightTile = paperUiTileImage.sub(32 * 3, 96, 32, 32);

		positiveTile = paperUiTileImage.sub(384, 160, 32, 32);
		negativeTile = paperUiTileImage.sub(416, 160, 32, 32);

		longButtonTile = paperUiTileImage.sub(384, 224, 96, 32);
		midButtonTile = paperUiTileImage.sub(416, 224, 64, 32);

		// yesNoDialog("Leave sector ?");
	}

	// TODO
	function addGuiButton(text:String) {
		final button = new h2d.Object(fui);

		final buttonBmp = new h2d.Bitmap(longButtonTile);
		buttonBmp.setScale(4);
		button.addChild(buttonBmp);

		var tf = new h2d.Text(getFont(), button);
		tf.text = text;
		tf.setPosition(32, 24);
		tf.setScale(4);
		tf.textColor = 0x82590E;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};

		final interaction = new h2d.Interactive(32 * 4 * 3, 32 * 4, button);
		interaction.onClick = function(event:hxd.Event) {};
		interaction.onMove = function(event:hxd.Event) {
			button.setScale(0.9);
			button.alpha = 0.9;
		};
		interaction.onOut = function(event:hxd.Event) {
			button.setScale(1);
			button.alpha = 1;
		};

		fui.addChild(button);
	}

	// Yes / no dialog
	function yesNoDialog(title:String) {
		final dialog = new h2d.Object(this);

		var group = new h2d.TileGroup(paperUiTileImage, dialog);
		group.setScale(3);

		final dialogTilesWidth = 5;
		final dialogTilesHeight = 3;

		for (x in 0...dialogTilesWidth) {
			for (y in 0...dialogTilesHeight) {
				var tile:h2d.Tile;
				if (y == 0) {
					// Top
					if (x == 0) {
						tile = dialogTopLeftTile;
					} else if (x == dialogTilesWidth - 1) {
						tile = dialogTopRightTile;
					} else {
						tile = dialogTopMiddleTile;
					}
				} else if (y == dialogTilesHeight - 1) {
					// Bottom
					if (x == 0) {
						tile = dialogBottomLeftTile;
					} else if (x == dialogTilesWidth - 1) {
						tile = dialogBottomRightTile;
					} else {
						tile = dialogBottomMiddleTile;
					}
				} else {
					// Middle
					if (x == 0) {
						tile = dialogMiddleLeftTile;
					} else if (x == dialogTilesWidth - 1) {
						tile = dialogMiddleRightTile;
					} else {
						tile = dialogMiddleMiddleTile;
					}
				}

				if (tile != null) {
					group.add(x * 32, y * 32, tile);
				}
			}
		}

		final positiveBmp = new h2d.Bitmap(positiveTile);
		positiveBmp.setScale(4);
		positiveBmp.setPosition(32, 128);
		dialog.addChild(positiveBmp);

		final interactionPositive = new h2d.Interactive(30, 30, positiveBmp);
		interactionPositive.onClick = function(event:hxd.Event) {};
		interactionPositive.onMove = function(event:hxd.Event) {
			positiveBmp.setScale(3.5);
		};
		interactionPositive.onOut = function(event:hxd.Event) {
			positiveBmp.setScale(4);
		};

		final negativeBmp = new h2d.Bitmap(negativeTile);
		negativeBmp.setScale(4);
		negativeBmp.setPosition(320, 128);
		dialog.addChild(negativeBmp);

		final interactionNegative = new h2d.Interactive(30, 30, negativeBmp);
		interactionNegative.onClick = function(event:hxd.Event) {};
		interactionNegative.onMove = function(event:hxd.Event) {
			negativeBmp.setScale(3.5);
		};
		interactionNegative.onOut = function(event:hxd.Event) {
			negativeBmp.setScale(4);
		};

		var tf = new h2d.Text(getFont(), dialog);
		tf.text = title;
		tf.setPosition(64, 32);
		tf.setScale(4);
		tf.textColor = 0x82590E;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};

		dialog.addChild(tf);

		dialog.setPosition((Main.ScreenWidth / 2) - (480 / 2), (Main.ScreenHeight / 2) - (288 / 2));

		this.addChild(dialog);
	}

	// Basic heaps.io elements

	public function getFont() {
		return hxd.res.DefaultFont.get();
	}

	public function addButton(label:String, onClick:Void->Void) {
		var f = new h2d.Flow(fui);
		f.padding = 5;
		f.paddingBottom = 7;
		f.backgroundTile = h2d.Tile.fromColor(0x404040);
		var tf = new h2d.Text(getFont(), f);
		tf.text = label;
		f.enableInteractive = true;
		f.interactive.cursor = Button;
		f.interactive.onClick = function(_) onClick();
		f.interactive.onOver = function(_) f.backgroundTile = h2d.Tile.fromColor(0x606060);
		f.interactive.onOut = function(_) f.backgroundTile = h2d.Tile.fromColor(0x404040);
		return f;
	}

	public function addSlider(label:String, get:Void->Float, set:Float->Void, min:Float = 0., max:Float = 1.) {
		var f = new h2d.Flow(fui);
		f.horizontalSpacing = 5;
		var tf = new h2d.Text(getFont(), f);
		tf.text = label;
		tf.maxWidth = 70;
		tf.textAlign = Right;
		var sli = new h2d.Slider(100, 10, f);
		sli.minValue = min;
		sli.maxValue = max;
		sli.value = get();
		var tf = new h2d.TextInput(getFont(), f);
		tf.text = "" + hxd.Math.fmt(sli.value);
		sli.onChange = function() {
			set(sli.value);
			tf.text = "" + hxd.Math.fmt(sli.value);
			f.needReflow = true;
		};
		tf.onChange = function() {
			var v = Std.parseFloat(tf.text);
			if (Math.isNaN(v))
				return;
			sli.value = v;
			set(v);
		};
		return sli;
	}

	public function addCheck(label:String, get:Void->Bool, set:Bool->Void) {
		var f = new h2d.Flow(fui);
		f.horizontalSpacing = 5;
		var tf = new h2d.Text(getFont(), f);
		tf.text = label;
		tf.maxWidth = 70;
		tf.textAlign = Right;
		var size = 10;
		var b = new h2d.Graphics(f);
		function redraw() {
			b.clear();
			b.beginFill(0x808080);
			b.drawRect(0, 0, size, size);
			b.beginFill(0);
			b.drawRect(1, 1, size - 2, size - 2);
			if (get()) {
				b.beginFill(0xC0C0C0);
				b.drawRect(2, 2, size - 4, size - 4);
			}
		}
		var i = new h2d.Interactive(size, size, b);
		i.onClick = function(_) {
			set(!get());
			redraw();
		};
		redraw();
		return i;
	}

	public function addChoice(text, choices, callb:Int->Void, value = 0) {
		var font = getFont();
		var i = new h2d.Interactive(110, font.lineHeight, fui);
		i.backgroundColor = 0xFF808080;
		fui.getProperties(i).paddingLeft = 20;
		var t = new h2d.Text(font, i);
		t.maxWidth = i.width;
		t.text = text + ":" + choices[value];
		t.textAlign = Center;
		i.onClick = function(_) {
			value++;
			value %= choices.length;
			callb(value);
			t.text = text + ":" + choices[value];
		};
		i.onOver = function(_) {
			t.textColor = 0xFFFFFF;
		};
		i.onOut = function(_) {
			t.textColor = 0xEEEEEE;
		};
		i.onOut(null);
		return i;
	}

	public function addText(text = "") {
		var tf = new h2d.Text(getFont(), fui);
		tf.text = text;
		return tf;
	}
}
