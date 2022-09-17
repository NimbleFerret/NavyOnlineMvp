class Utils {
	public static function MaskEthAddress(text:String) {
		return text.substring(0, 4) + '...' + text.substring(text.length - 4, text.length);
	}
}
