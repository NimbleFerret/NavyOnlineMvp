package utils;

import game.engine.geometry.Rectangle;

class Utils {
	public static function EngineToClientPoint(p:game.engine.geometry.Point) {
		return new h2d.col.Point(p.x, p.y);
	}

	public static function ClientToEnginePoint(p:h2d.col.Point) {
		return new game.engine.geometry.Point(p.x, p.y);
	}

	public static function MaskEthAddress(text:String) {
		return text.substring(0, 4) + '...' + text.substring(text.length - 4, text.length);
	}

	public static function DrawLine(graphics:h2d.Graphics, from:h2d.col.Point, to:h2d.col.Point, color:Int) {
		graphics.lineStyle(1, color);

		graphics.moveTo(from.x, from.y);
		graphics.lineTo(to.x, to.y);

		graphics.endFill();
	}

	public static function DrawRect(graphics:h2d.Graphics, rect:Rectangle, color:Int) {
		graphics.lineStyle(3, color);

		// Top line
		graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
		graphics.lineTo(rect.getTopRightPoint().x, rect.getTopRightPoint().y);

		// Right line
		graphics.lineTo(rect.getBottomRightPoint().x, rect.getBottomRightPoint().y);

		// Bottom line
		graphics.lineTo(rect.getBottomLeftPoint().x, rect.getBottomLeftPoint().y);

		// Left line
		graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
	}
}
