package engine;

import engine.entity.EngineBaseGameEntity.GameEntityDirection;

class MathUtils {
	public static function dirToRad(dir:GameEntityDirection) {
		var result = 0;
		switch (dir) {
			case East:
				result = 0;
			case NorthEast:
				result = -25;
			case North:
				result = -90;
			case NorthWest:
				result = -155;
			case West:
				result = 0;
			case SouthWest:
				result = -25;
			case South:
				result = -90;
			case SouthEast:
				result = 25;
		}
		return degreeToRads(result);
	}

	public static function degreeToRads(degrees:Float) {
		return degrees * Math.PI / 180;
	}

	public static function rotatePointAroundCenter(x:Float, y:Float, cx:Float, cy:Float, r:Float) {
		final cos = Math.cos(r);
		final sin = Math.sin(r);
		return {
			x: (cos * (x - cx)) - (sin * (y - cy)) + cx,
			y: (cos * (y - cy)) + (sin * (x - cx)) + cy
		}
	}

	public static function lineToLineIntersection(x1:Float, y1:Float, x2:Float, y2:Float, x3:Float, y3:Float, x4:Float, y4:Float) {
		final numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		final numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
		final deNom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		if (deNom == 0) {
			return false;
		}
		final uA = numA / deNom;
		final uB = numB / deNom;
		return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
	}
}
