package game.engine;

import haxe.Int32;

class EngineUtils {
	public static function HashString(str:String) {
		final strLen = str.length;
		if (strLen == 0)
			return 0;
		var hc:Int32 = 0;
		for (i in 0...strLen) {
			hc = ((hc << 5) - hc) + str.charCodeAt(i);
		}
		return hc;
	}
}
