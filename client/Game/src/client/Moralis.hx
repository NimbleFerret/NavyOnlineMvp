package client;

@:native("window")
extern class Moralis {
	static function isEthereumBrowser():Bool;

	static function initMoralis(callback:String->Void):Void;

	static function getEthAddress():String;

	static function buyFounderShip():Void;

	static function buyFounderIsland():Void;

	static function buyFounderCaptain():Void;
}
