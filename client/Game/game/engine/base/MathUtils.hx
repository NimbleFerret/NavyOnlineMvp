package game.engine.base;

import game.engine.base.BaseTypesAndClasses;
import game.engine.base.geometry.Line;
import game.engine.base.geometry.Point;

class MathUtils {
	public static function getHullRadByDir(dir:GameEntityDirection) {
		var degree = 0;
		switch (dir) {
			case NORTH:
				degree = 0;
			case NORTH_WEST:
				degree = -65;
			case WEST:
				degree = -90;
			case SOUTH_WEST:
				degree = -115;
			case SOUTH:
				degree = -180;
			case SOUTH_EAST:
				degree = -245;
			case EAST:
				degree = -270;
			case NORTH_EAST:
				degree = -335;
		}
		return degreeToRads(degree);
	}

	public static function getGunRadByDir(dir:GameEntityDirection) {
		var degree = 0;
		switch (dir) {
			case NORTH:
				degree = 0;
			case NORTH_WEST:
				degree = -45;
			case WEST:
				degree = -90;
			case SOUTH_WEST:
				degree = -135;
			case SOUTH:
				degree = -180;
			case SOUTH_EAST:
				degree = -225;
			case EAST:
				degree = -270;
			case NORTH_EAST:
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
			case EAST:
				degree = 0;
			case NORTH_EAST:
				degree = -25;
			case NORTH:
				degree = -90;
			case NORTH_WEST:
				degree = -155;
			case WEST:
				degree = 180;
			case SOUTH_WEST:
				degree = 155;
			case SOUTH:
				degree = 90;
			case SOUTH_EAST:
				degree = 25;
		}
		return degreeToRads(degree);
	}

	public static function angleBetweenPoints(point1:Point, point2:Point) {
		return Math.atan2(point2.y - point1.y, point2.x - point1.x);
	}

	public static function degreeToRads(degrees:Float) {
		return (Math.PI / 180) * degrees;
	}

	public static function radsToDegree(rads:Float) {
		return rads * (180 / Math.PI);
	}

	public static function normalizeAngle(rads:Float) {
		rads = rads % (2 * Math.PI);
		if (rads >= 0) {
			return rads;
		} else {
			return rads + 2 * Math.PI;
		}
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

	public static function differ(a:Float, b:Float, error:Float) {
		return Math.abs(a - b) > error;
	}
}
