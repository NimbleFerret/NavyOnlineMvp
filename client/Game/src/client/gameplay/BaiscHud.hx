package client.gameplay;

import client.ui.UiToken;
import h2d.Object;

class BasicHud extends h2d.Scene {
	var fui:h2d.Flow;

	private final arrowLeftTile:h2d.Tile;
	private final arrowRightTile:h2d.Tile;
	private final singleButtonTile:h2d.Tile;

	// Dialog tiles
	private final paperUiTileImage:h2d.Tile;

	private final dialogSingleLeftTile:h2d.Tile;
	private final dialogSingleMiddleTile:h2d.Tile;
	private final dialogSingleRightTile:h2d.Tile;

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

		scaleMode = LetterBox(1920, 1080, false, Left, Center);

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.x = 10;
		fui.y = 10;

		// Ui stuff

		// get tile image (tiles.png) from resources
		paperUiTileImage = hxd.Res.gui_paper.toTile();

		arrowLeftTile = paperUiTileImage.sub(0, 0, 32, 32);
		arrowRightTile = paperUiTileImage.sub(0, 32, 32, 32);

		singleButtonTile = paperUiTileImage.sub(384, 192, 32, 32);

		dialogSingleLeftTile = paperUiTileImage.sub(32 * 1, 160, 32, 32);
		dialogSingleMiddleTile = paperUiTileImage.sub(32 * 2, 160, 32, 32);
		dialogSingleRightTile = paperUiTileImage.sub(32 * 3, 160, 32, 32);

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
	}

	function addGuiButton(parent:h2d.Object, text:String, isWeb3Related:Bool, callback:Void->Void, scaleX:Int, scaleY:Int, textOffsetX = 16,
			textOffsetY = 12) {
		final button = new h2d.Object(parent);

		final buttonBmp = new h2d.Bitmap(longButtonTile);
		buttonBmp.scaleX = scaleX;
		buttonBmp.scaleY = scaleY;
		button.addChild(buttonBmp);

		var tf = new h2d.Text(getFont(), button);
		tf.text = text;
		tf.setPosition(textOffsetX, textOffsetY);
		tf.setScale(2);
		tf.textColor = 0x82590E;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};

		if (isWeb3Related && Main.IsWeb3Available != null || !isWeb3Related) {
			final interaction = new h2d.Interactive(32 * scaleX * 3, 32 * scaleX, button);
			interaction.onClick = function(event:hxd.Event) {
				if (callback != null) {
					callback();
				}
			};
			interaction.onMove = function(event:hxd.Event) {
				button.alpha = 0.8;
			};
			interaction.onOut = function(event:hxd.Event) {
				button.alpha = 1;
			};
			interaction.onPush = function(event:hxd.Event) {
				button.setScale(0.9);
			};
			interaction.onRelease = function(event:hxd.Event) {
				button.setScale(1);
			};
		} else {
			button.alpha = 0.8;
		}

		return button;
	}

	function leftArrowButton(callback:Void->Void, isWeb3Related:Bool) {
		final button = new h2d.Object(this);
		button.setScale(3);

		final buttonBmp = new h2d.Bitmap(singleButtonTile);
		final arrowBmp = new h2d.Bitmap(arrowLeftTile);
		arrowBmp.setPosition(1, 1);

		button.addChild(buttonBmp);
		button.addChild(arrowBmp);

		if (isWeb3Related && Main.IsWeb3Available || !isWeb3Related) {
			final interaction = new h2d.Interactive(30, 30, button);
			interaction.onClick = function(event:hxd.Event) {
				if (callback != null) {
					callback();
				}
			};
			interaction.onMove = function(event:hxd.Event) {
				button.alpha = 0.80;
			};
			interaction.onOut = function(event:hxd.Event) {
				button.alpha = 1;
			};
			interaction.onPush = function(event:hxd.Event) {
				button.setScale(2.5);
			};
			interaction.onRelease = function(event:hxd.Event) {
				button.setScale(3);
			};
		} else {
			button.alpha = 0.8;
		}

		return button;
	}

	function rightArrowButton(callback:Void->Void, isWeb3Related:Bool) {
		final button = new h2d.Object(this);
		button.setScale(3);

		final buttonBmp = new h2d.Bitmap(singleButtonTile);
		final arrowBmp = new h2d.Bitmap(arrowRightTile);
		arrowBmp.setPosition(2, 1);

		button.addChild(buttonBmp);
		button.addChild(arrowBmp);

		if (isWeb3Related && Main.IsWeb3Available || !isWeb3Related) {
			final interaction = new h2d.Interactive(30, 30, button);
			interaction.onClick = function(event:hxd.Event) {
				if (callback != null) {
					callback();
				}
			};
			interaction.onMove = function(event:hxd.Event) {
				button.alpha = 0.80;
			};
			interaction.onOut = function(event:hxd.Event) {
				button.alpha = 1;
			};
			interaction.onPush = function(event:hxd.Event) {
				button.setScale(2.5);
			};
			interaction.onRelease = function(event:hxd.Event) {
				button.setScale(3);
			};
		} else {
			button.alpha = 0.8;
		}

		return button;
	}

	function newWidePlate(width:Int) {
		final plate = new h2d.Object(this);

		final group = new h2d.TileGroup(paperUiTileImage, plate);
		final tileScale = 3;
		group.setScale(tileScale);
		buildWidePlate(group, width);

		return plate;
	}

	function newCustomPlate(parent:h2d.Object, width:Int, height:Int) {
		final plate = new h2d.Object(parent);

		final group = new h2d.TileGroup(paperUiTileImage, plate);
		final tileScale = 2;
		group.setScale(tileScale);
		buildDialogBackground(group, width, height);

		return plate;
	}

	function alertDialog(title:String, callback:Void->Void) {
		final dialog = new h2d.Object(this);

		final group = new h2d.TileGroup(paperUiTileImage, dialog);
		final tileScale = 3;
		final width = 14;
		final height = 3;

		group.setScale(tileScale);

		buildDialogBackground(group, width, height);

		final tf = new h2d.Text(getFont(), dialog);
		tf.text = title;
		tf.setPosition(64, 32);
		tf.setScale(3);
		tf.textColor = 0x82590E;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};

		dialog.addChild(tf);

		dialog.setPosition((Main.ScreenWidth / 2) - 550, (Main.ScreenHeight / 2) - 185);

		final positiveBmp = new h2d.Bitmap(positiveTile);
		positiveBmp.setScale(4);
		positiveBmp.setPosition(dialog.getBounds().width / 2 - 32 * 2, 128);
		dialog.addChild(positiveBmp);

		final interaction = new h2d.Interactive(30, 30, positiveBmp);
		interaction.onClick = function(event:hxd.Event) {};
		interaction.onMove = function(event:hxd.Event) {
			positiveBmp.alpha = 0.80;
		};
		interaction.onOut = function(event:hxd.Event) {
			positiveBmp.alpha = 1;
		};
		interaction.onPush = function(event:hxd.Event) {
			positiveBmp.setScale(3.5);
		};
		interaction.onRelease = function(event:hxd.Event) {
			positiveBmp.setScale(4);

			interaction.cancelEvents = true;
			interaction.blur();

			// Hack to reset cursor...
			haxe.Timer.delay(function() {
				if (callback != null) {
					callback();
				}
				interaction.remove();
				this.removeChild(dialog);
			}, 50);
		};

		this.addChild(dialog);
	}

	function tokensRewardAlert(nvy:Int, aks:Int) {
		final plate = newCustomPlate(this, 7, 4);

		plate.setPosition(Main.ScreenWidth / 2 - plate.getBounds().width / 2, 100);

		final titleText = addText2(plate, "You've been rewarded!");

		final nvyToken = new UiToken(TokenType.NVY, null);
		nvyToken.setText(Std.string(nvy));
		nvyToken.setPosition(titleText.x, titleText.y + 80);

		final aksToken = new UiToken(TokenType.AKS, null);
		aksToken.setText(Std.string(aks));
		aksToken.setPosition(nvyToken.x, nvyToken.y + 100);

		plate.addChild(nvyToken);
		plate.addChild(aksToken);

		return plate;
	}

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

	private function buildWidePlate(group:h2d.TileGroup, dialogTilesWidth:Int) {
		for (x in 0...dialogTilesWidth) {
			var tile:h2d.Tile;
			if (x == 0) {
				tile = dialogSingleLeftTile;
			} else if (x == dialogTilesWidth - 1) {
				tile = dialogSingleRightTile;
			} else {
				tile = dialogSingleMiddleTile;
			}
			if (tile != null) {
				group.add(x * 32, y * 32, tile);
			}
		}
	}

	private function buildDialogBackground(group:h2d.TileGroup, dialogTilesWidth:Int, dialogTilesHeight:Int) {
		for (x in 0...dialogTilesWidth) {
			for (y in 0...dialogTilesHeight) {
				var tile:h2d.Tile;
				if (y == 0) {
					// Top
					if (dialogTilesHeight == 1) {
						if (x == 0) {
							tile = dialogSingleLeftTile;
						} else if (x == dialogTilesWidth - 1) {
							tile = dialogSingleRightTile;
						} else {
							tile = dialogSingleMiddleTile;
						}
					} else {
						if (x == 0) {
							tile = dialogTopLeftTile;
						} else if (x == dialogTilesWidth - 1) {
							tile = dialogTopRightTile;
						} else {
							tile = dialogTopMiddleTile;
						}
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
		addText3(f, label);
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
		final tf = new h2d.Text(getFont(), fui);
		tf.text = text;
		tf.textColor = 0xFBF0DD;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.9
		};
		return tf;
	}

	public function addText2(parent:h2d.Object, text = "") {
		final tf = new h2d.Text(getFont(), parent);
		tf.text = text;
		tf.setPosition(32, 24);
		tf.setScale(2);
		tf.textColor = 0x82590E;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.5
		};
		return tf;
	}

	public function addText3(parent:h2d.Object, text = "", scale = 2) {
		final tf = new h2d.Text(getFont(), parent);
		tf.text = text;
		tf.setPosition(16, 16);
		tf.setScale(scale);
		tf.textColor = 0xFBF0DD;
		tf.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.9
		};
		return tf;
	}
}
