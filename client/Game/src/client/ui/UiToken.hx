package client.ui;

import haxe.CallStack.StackItem;
import h2d.Anim;

enum TokenType {
	NVY;
	AKS;
}

class TokenAnimation extends h2d.Anim {
	public function new(tokenType:TokenType, scale:Int = 3, posX:Int = 0, posY:Int = 0) {
		super([
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._1.toTile().center() : hxd.Res.aks_coin_anims._1.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._2.toTile().center() : hxd.Res.aks_coin_anims._2.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._3.toTile().center() : hxd.Res.aks_coin_anims._3.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._4.toTile().center() : hxd.Res.aks_coin_anims._4.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._5.toTile().center() : hxd.Res.aks_coin_anims._5.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._6.toTile().center() : hxd.Res.aks_coin_anims._6.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._7.toTile().center() : hxd.Res.aks_coin_anims._7.toTile().center(),
			tokenType == TokenType.NVY ? hxd.Res.nvy_coin_anims._8.toTile().center() : hxd.Res.aks_coin_anims._8.toTile().center()
		]);
		setScale(scale);
		setPosition(posX, posY);
	}
}

class UiToken extends h2d.Object {
	private final text:h2d.Text;
	private final tokenType:TokenType;

	public function new(tokenType:TokenType, plate:h2d.Object) {
		super();

		this.tokenType = tokenType;

		if (plate != null) {
			addChild(plate);
		}

		addChild(new TokenAnimation(tokenType, 3, 54, 45));

		text = new h2d.Text(hxd.res.DefaultFont.get(), this);
		text.text = tokenType == TokenType.NVY ? '110' : '0';
		text.setScale(5);
		text.textColor = 0x82590E;
		text.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.8
		};
		text.setPosition(108 - text.textWidth, 4);
	}

	public function setText(text:String) {
		// WAT ?
		// this.text.text = (tokenType == TokenType.NVY ? 'NVY: ' : 'AKS: ') + text;
	}
}
