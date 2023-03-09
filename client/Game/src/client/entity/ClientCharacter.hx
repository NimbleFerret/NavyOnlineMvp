// package client.entity;
// import game.engine.entity.EngineCharacterEntity;
// class ClientCharacter extends ClientBaseGameEntity {
// 	var idleTile:h2d.Tile;
// 	var runDownTile:h2d.Tile;
// 	var runRightTile:h2d.Tile;
// 	var runUpTile:h2d.Tile;
// 	var idleAnim:h2d.Anim;
// 	var upAnim:h2d.Anim;
// 	var downAnim:h2d.Anim;
// 	var leftAnim:h2d.Anim;
// 	var rightAnim:h2d.Anim;
// 	public function new(name:String, engineCharacterEntity:EngineCharacterEntity) {
// 		super();
// 		initiateEngineEntity(engineCharacterEntity);
// 		final idle1Tile = hxd.Res.char_anims.idle._1.toTile();
// 		final idle2Tile = hxd.Res.char_anims.idle._2.toTile();
// 		final idle3Tile = hxd.Res.char_anims.idle._3.toTile();
// 		final idle4Tile = hxd.Res.char_anims.idle._4.toTile();
// 		idleAnim = new h2d.Anim([idle1Tile, idle2Tile, idle3Tile, idle4Tile], this);
// 		final up1Tile = hxd.Res.char_anims.up._1.toTile();
// 		final up2Tile = hxd.Res.char_anims.up._2.toTile();
// 		final up3Tile = hxd.Res.char_anims.up._3.toTile();
// 		final up4Tile = hxd.Res.char_anims.up._4.toTile();
// 		final up5Tile = hxd.Res.char_anims.up._5.toTile();
// 		final up6Tile = hxd.Res.char_anims.up._6.toTile();
// 		final up7Tile = hxd.Res.char_anims.up._7.toTile();
// 		final up8Tile = hxd.Res.char_anims.up._8.toTile();
// 		upAnim = new h2d.Anim([up1Tile, up2Tile, up3Tile, up4Tile, up5Tile, up6Tile, up7Tile, up8Tile], this);
// 		final down1Tile = hxd.Res.char_anims.down._1.toTile();
// 		final down2Tile = hxd.Res.char_anims.down._2.toTile();
// 		final down3Tile = hxd.Res.char_anims.down._3.toTile();
// 		final down4Tile = hxd.Res.char_anims.down._4.toTile();
// 		final down5Tile = hxd.Res.char_anims.down._5.toTile();
// 		final down6Tile = hxd.Res.char_anims.down._6.toTile();
// 		final down7Tile = hxd.Res.char_anims.down._7.toTile();
// 		final down8Tile = hxd.Res.char_anims.down._8.toTile();
// 		downAnim = new h2d.Anim([
// 			down1Tile,
// 			down2Tile,
// 			down3Tile,
// 			down4Tile,
// 			down5Tile,
// 			down6Tile,
// 			down7Tile,
// 			down8Tile
// 		], this);
// 		final left1Tile = hxd.Res.char_anims.left._1.toTile();
// 		final left2Tile = hxd.Res.char_anims.left._2.toTile();
// 		final left3Tile = hxd.Res.char_anims.left._3.toTile();
// 		final left4Tile = hxd.Res.char_anims.left._4.toTile();
// 		final left5Tile = hxd.Res.char_anims.left._5.toTile();
// 		final left6Tile = hxd.Res.char_anims.left._6.toTile();
// 		final left7Tile = hxd.Res.char_anims.left._7.toTile();
// 		final left8Tile = hxd.Res.char_anims.left._8.toTile();
// 		leftAnim = new h2d.Anim([
// 			left1Tile,
// 			left2Tile,
// 			left3Tile,
// 			left4Tile,
// 			left5Tile,
// 			left6Tile,
// 			left7Tile,
// 			left8Tile
// 		], this);
// 		final right1Tile = hxd.Res.char_anims.right._1.toTile();
// 		final right2Tile = hxd.Res.char_anims.right._2.toTile();
// 		final right3Tile = hxd.Res.char_anims.right._3.toTile();
// 		final right4Tile = hxd.Res.char_anims.right._4.toTile();
// 		final right5Tile = hxd.Res.char_anims.right._5.toTile();
// 		final right6Tile = hxd.Res.char_anims.right._6.toTile();
// 		final right7Tile = hxd.Res.char_anims.right._7.toTile();
// 		final right8Tile = hxd.Res.char_anims.right._8.toTile();
// 		rightAnim = new h2d.Anim([
// 			right1Tile,
// 			right2Tile,
// 			right3Tile,
// 			right4Tile,
// 			right5Tile,
// 			right6Tile,
// 			right7Tile,
// 			right8Tile
// 		], this);
// 		upAnim.alpha = 0;
// 		downAnim.alpha = 0;
// 		leftAnim.alpha = 0;
// 		rightAnim.alpha = 0;
// 		final nickname = new h2d.Text(hxd.res.DefaultFont.get(), this);
// 		nickname.text = name;
// 		nickname.setPosition(20, 0);
// 		// s2d.addChild(this);
// 		setScale(1.5);
// 	}
// 	public function update(dt:Float) {
// 		final lerpX = hxd.Math.lerp(x, engineEntity.getX(), 0.1);
// 		final lerpY = hxd.Math.lerp(y, engineEntity.getY(), 0.1);
// 		final intEngineX = Std.int(engineEntity.getX());
// 		final intClientX = Std.int(x);
// 		final intEngineY = Std.int(engineEntity.getY());
// 		final intClientY = Std.int(y);
// 		idleAnim.alpha = 0;
// 		upAnim.alpha = 0;
// 		downAnim.alpha = 0;
// 		leftAnim.alpha = 0;
// 		rightAnim.alpha = 0;
// 		if (Math.abs(intEngineX - intClientX) > 1) {
// 			if (intEngineX > intClientX) {
// 				leftAnim.alpha = 0;
// 				rightAnim.alpha = 1;
// 			} else if (intEngineX < intClientX) {
// 				leftAnim.alpha = 1;
// 				rightAnim.alpha = 0;
// 			}
// 			x = lerpX;
// 		} else if (Math.abs(intEngineY - intClientY) > 1) {
// 			if (intEngineY > intClientY) {
// 				upAnim.alpha = 0;
// 				downAnim.alpha = 1;
// 			} else if (intEngineY < intClientY) {
// 				upAnim.alpha = 1;
// 				downAnim.alpha = 0;
// 			}
// 			y = lerpY;
// 		} else {
// 			idleAnim.alpha = 1;
// 		}
// 	}
// 	public function debugDraw(graphics:h2d.Graphics) {}
// 	public function moveUp() {
// 		// if (getCharacterEngineEntity().moveUp()) {
// 		// 	idleAnim.alpha = 0;
// 		// 	upAnim.alpha = 1;
// 		// 	downAnim.alpha = 0;
// 		// 	leftAnim.alpha = 0;
// 		// 	rightAnim.alpha = 0;
// 		// }
// 	}
// 	public function moveDown() {
// 		// if (getCharacterEngineEntity().moveDown()) {
// 		// 	idleAnim.alpha = 0;
// 		// 	upAnim.alpha = 0;
// 		// 	downAnim.alpha = 1;
// 		// 	leftAnim.alpha = 0;
// 		// 	rightAnim.alpha = 0;
// 		// }
// 	}
// 	public function moveLeft() {
// 		// if (getCharacterEngineEntity().moveLeft()) {
// 		// 	idleAnim.alpha = 0;
// 		// 	upAnim.alpha = 0;
// 		// 	downAnim.alpha = 0;
// 		// 	leftAnim.alpha = 1;
// 		// 	rightAnim.alpha = 0;
// 		// }
// 	}
// 	public function moveRight() {
// 		// if (getCharacterEngineEntity().moveRight()) {
// 		// 	idleAnim.alpha = 0;
// 		// 	upAnim.alpha = 0;
// 		// 	downAnim.alpha = 0;
// 		// 	leftAnim.alpha = 0;
// 		// 	rightAnim.alpha = 1;
// 		// }
// 	}
// 	private function getCharacterEngineEntity() {
// 		return cast(engineEntity, EngineCharacterEntity);
// 	}
// }
