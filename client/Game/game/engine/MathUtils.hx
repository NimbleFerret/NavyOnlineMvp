package game.engine;

import game.engine.entity.TypesAndClasses;
import game.engine.geometry.Line;
import game.engine.geometry.Point;

class MathUtils {
	public static function getHullRadByDir(dir:GameEntityDirection) {
		var degree = 0;
		switch (dir) {
			case North:
				degree = 0;
			case NorthWest:
				degree = -65;
			case West:
				degree = -90;
			case SouthWest:
				degree = -115;
			case South:
				degree = -180;
			case SouthEast:
				degree = -245;
			case East:
				degree = -270;
			case NorthEast:
				degree = -335;
		}
		return degreeToRads(degree);
	}

	public static function getGunRadByDir(dir:GameEntityDirection) {
		var degree = 0;
		switch (dir) {
			case North:
				degree = 0;
			case NorthWest:
				degree = -45;
			case West:
				degree = -90;
			case SouthWest:
				degree = -135;
			case South:
				degree = -180;
			case SouthEast:
				degree = -225;
			case East:
				degree = -270;
			case NorthEast:
				degree = -315;
		}
		return degreeToRads(degree);
	}

	public static function dirToRad(dir:GameEntityDirection) {
		if (dir == null) {
			return 0.0;
		}
		var degree = 0;
		switch (dir) {
			case East:
				degree = 0;
			case NorthEast:
				degree = -25;
			case North:
				degree = -90;
			case NorthWest:
				degree = -155;
			case West:
				degree = 0;
			case SouthWest:
				degree = -25;
			case South:
				degree = -90;
			case SouthEast:
				degree = 25;
		}
		return degreeToRads(degree);
	}

	public static function angleBetweenPoints(point1:Point, point2:Point) {
		return Math.atan2(point2.y - point1.y, point2.x - point1.x);
	}

	// TODO replace by hxd.Math
	public static function degreeToRads(degrees:Float) {
		return (Math.PI / 180) * degrees;
	}

	public static function radsToDegree(rads:Float) {
		return rads * (180 / Math.PI);
	}

	public static function rotatePointAroundCenter(x:Float, y:Float, cx:Float, cy:Float, r:Float) {
		final cos = Math.cos(r);
		final sin = Math.sin(r);
		return new Point((cos * (x - cx)) - (sin * (y - cy)) + cx, (cos * (y - cy)) + (sin * (x - cx)) + cy);
	}

	public static function lineToLineIntersection(lineA:Line, lineB:Line) {
		final numA = (lineB.x2 - lineB.x1) * (lineA.y1 - lineB.y1) - (lineB.y2 - lineB.y1) * (lineA.x1 - lineB.x1);
		final numB = (lineA.x2 - lineA.x1) * (lineA.y1 - lineB.y1) - (lineA.y2 - lineA.y1) * (lineA.x1 - lineB.x1);
		final deNom = (lineB.y2 - lineB.y1) * (lineA.x2 - lineA.x1) - (lineB.x2 - lineB.x1) * (lineA.y2 - lineA.y1);
		if (deNom == 0) {
			return false;
		}
		final uA = numA / deNom;
		final uB = numB / deNom;
		return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
	}
}
