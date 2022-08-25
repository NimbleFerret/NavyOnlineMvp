(function ($hx_exports, $global) {
	"use strict";
	$hx_exports["engine"] = $hx_exports["engine"] || {};
	var $estr = function () { return js_Boot.__string_rec(this, ''); }, $hxEnums = $hxEnums || {}, $_;
	function $extend(from, fields) {
		var proto = Object.create(from);
		for (var name in fields) proto[name] = fields[name];
		if (fields.toString !== Object.prototype.toString) proto.toString = fields.toString;
		return proto;
	}
	var EReg = function (r, opt) {
		this.r = new RegExp(r, opt.split("u").join(""));
	};
	EReg.__name__ = true;
	EReg.prototype = {
		match: function (s) {
			if (this.r.global) {
				this.r.lastIndex = 0;
			}
			this.r.m = this.r.exec(s);
			this.r.s = s;
			return this.r.m != null;
		}
		, __class__: EReg
	};
	var HxOverrides = function () { };
	HxOverrides.__name__ = true;
	HxOverrides.cca = function (s, index) {
		var x = s.charCodeAt(index);
		if (x != x) {
			return undefined;
		}
		return x;
	};
	HxOverrides.substr = function (s, pos, len) {
		if (len == null) {
			len = s.length;
		} else if (len < 0) {
			if (pos == 0) {
				len = s.length + len;
			} else {
				return "";
			}
		}
		return s.substr(pos, len);
	};
	HxOverrides.now = function () {
		return Date.now();
	};
	Math.__name__ = true;
	var Reflect = function () { };
	Reflect.__name__ = true;
	Reflect.compare = function (a, b) {
		if (a == b) {
			return 0;
		} else if (a > b) {
			return 1;
		} else {
			return -1;
		}
	};
	Reflect.isEnumValue = function (v) {
		if (v != null) {
			return v.__enum__ != null;
		} else {
			return false;
		}
	};
	var Std = function () { };
	Std.__name__ = true;
	Std.string = function (s) {
		return js_Boot.__string_rec(s, "");
	};
	Std.parseInt = function (x) {
		if (x != null) {
			var _g = 0;
			var _g1 = x.length;
			while (_g < _g1) {
				var i = _g++;
				var c = x.charCodeAt(i);
				if (c <= 8 || c >= 14 && c != 32 && c != 45) {
					var nc = x.charCodeAt(i + 1);
					var v = parseInt(x, nc == 120 || nc == 88 ? 16 : 10);
					if (isNaN(v)) {
						return null;
					} else {
						return v;
					}
				}
			}
		}
		return null;
	};
	Std.random = function (x) {
		if (x <= 0) {
			return 0;
		} else {
			return Math.floor(Math.random() * x);
		}
	};
	var StringTools = function () { };
	StringTools.__name__ = true;
	StringTools.replace = function (s, sub, by) {
		return s.split(sub).join(by);
	};
	var Type = function () { };
	Type.__name__ = true;
	Type.enumParameters = function (e) {
		var enm = $hxEnums[e.__enum__];
		var params = enm.__constructs__[e._hx_index].__params__;
		if (params != null) {
			var _g = [];
			var _g1 = 0;
			while (_g1 < params.length) {
				var p = params[_g1];
				++_g1;
				_g.push(e[p]);
			}
			return _g;
		} else {
			return [];
		}
	};
	var engine_EngineMode = $hxEnums["engine.EngineMode"] = {
		__ename__: true, __constructs__: null
		, Client: { _hx_name: "Client", _hx_index: 0, __enum__: "engine.EngineMode", toString: $estr }
		, Server: { _hx_name: "Server", _hx_index: 1, __enum__: "engine.EngineMode", toString: $estr }
	};
	engine_EngineMode.__constructs__ = [engine_EngineMode.Client, engine_EngineMode.Server];
	var engine_GameEngine = $hx_exports["engine"]["GameEngine"] = function (engineMode) {
		if (engineMode == null) {
			engineMode = engine_EngineMode.Server;
		}
		this.framesPassed = 0;
		this.allowShoot = false;
		this.playerShipMap = new haxe_ds_StringMap();
		var _gthis = this;
		this.engineMode = engineMode;
		this.shipManager = new engine_entity_manager_ShipManager();
		this.shellManager = new engine_entity_manager_ShellManager();
		var loop = function (dt, tick) {
			_gthis.framesPassed++;
			if (_gthis.framesPassed == 50) {
				_gthis.allowShoot = true;
			}
			var jsIterator = _gthis.shipManager.entities.values();
			var _g_jsIterator = jsIterator;
			var _g_lastStep = jsIterator.next();
			while (!_g_lastStep.done) {
				var v = _g_lastStep.value;
				_g_lastStep = _g_jsIterator.next();
				var ship = v;
				if (ship.isAlive) {
					ship.collides(false);
					ship.update(dt);
					if (ship.id == "2" && _gthis.allowShoot) {
						_gthis.allowShoot = false;
						_gthis.framesPassed = 0;
						_gthis.shipShootBySide(engine_entity_Side.Right, "2");
					}
					var jsIterator = _gthis.shipManager.entities.values();
					var _g_jsIterator1 = jsIterator;
					var _g_lastStep1 = jsIterator.next();
					while (!_g_lastStep1.done) {
						var v1 = _g_lastStep1.value;
						_g_lastStep1 = _g_jsIterator1.next();
						var ship2 = v1;
						if (ship.id != ship2.id) {
							if (ship.getGameRect().intersectsWithRect(ship2.getGameRect())) {
								ship.collides(true);
								ship2.collides(true);
							}
						}
					}
				}
			}
			var shipsToDelete = [];
			var shellsToDelete = [];
			var jsIterator = _gthis.shellManager.entities.values();
			var _g1_jsIterator = jsIterator;
			var _g1_lastStep = jsIterator.next();
			while (!_g1_lastStep.done) {
				var v = _g1_lastStep.value;
				_g1_lastStep = _g1_jsIterator.next();
				var shell = v;
				shell.update(dt);
				var jsIterator = _gthis.shipManager.entities.values();
				var _g1_jsIterator1 = jsIterator;
				var _g1_lastStep1 = jsIterator.next();
				while (!_g1_lastStep1.done) {
					var v1 = _g1_lastStep1.value;
					_g1_lastStep1 = _g1_jsIterator1.next();
					var ship = v1;
					if (shell.ownerId != ship.id) {
						if (shell.getGameRect().intersectsWithRect(ship.getGameRect()) && ship.isAlive) {
							ship.collides(true);
							shell.collides(true);
							var engineShipEntity = js_Boot.__cast(ship, engine_entity_EngineShipEntity);
							var engineShellEntity = js_Boot.__cast(shell, engine_entity_EngineShellEntity);
							engineShipEntity.inflictDamage(engineShellEntity.baseDamage);
							if (_gthis.shipHitByShellCallback != null) {
								_gthis.shipHitByShellCallback({ ship: engineShipEntity, damage: engineShellEntity.baseDamage });
							}
							if (_gthis.engineMode == engine_EngineMode.Server && !engineShipEntity.isAlive) {
								shipsToDelete.push(engineShipEntity.id);
							}
						}
					}
				}
				if (!shell.isAlive) {
					shellsToDelete.push(shell.id);
				}
			}
			var _g = 0;
			var _g1 = shellsToDelete.length;
			while (_g < _g1) {
				var i = _g++;
				var shell = js_Boot.__cast(_gthis.shellManager.getEntityById(shellsToDelete[i]), engine_entity_EngineShellEntity);
				if (shell != null) {
					if (_gthis.deleteShellCallback != null) {
						_gthis.deleteShellCallback(shell);
					}
					_gthis.shellManager.remove(shell.id);
				}
			}
			var _g = 0;
			var _g1 = shipsToDelete.length;
			while (_g < _g1) {
				var i = _g++;
				var ship = js_Boot.__cast(_gthis.shipManager.getEntityById(shipsToDelete[i]), engine_entity_EngineShipEntity);
				if (ship != null) {
					_gthis.removeShip(ship.id);
				}
			}
			if (_gthis.tickCallback != null) {
				_gthis.tickCallback();
			}
		};
		this.gameLoop = new engine_GameLoop(loop);
	};
	engine_GameEngine.__name__ = true;
	engine_GameEngine.main = function () {
	};
	engine_GameEngine.GenerateId = function () {
		return uuid_Uuid.short();
	};
	engine_GameEngine.prototype = {
		addShip: function (ship) {
			this.shipManager.add(ship);
			this.playerShipMap.h[ship.ownerId] = ship.id;
		}
		, createShip: function (x, y, id, ownerId) {
			var newShip = new engine_entity_EngineShipEntity(x, y, id, ownerId);
			this.shipManager.add(newShip);
			if (this.createShipCallback != null) {
				this.createShipCallback(newShip);
			}
			if (ownerId != null) {
				this.playerShipMap.h[ownerId] = newShip.id;
			}
			return newShip;
		}
		, getShipById: function (id) {
			return this.shipManager.getEntityById(id);
		}
		, getShipIdByOwnerId: function (id) {
			return this.playerShipMap.h[id];
		}
		, getShips: function () {
			return this.shipManager.entities;
		}
		, removeShip: function (shipId) {
			var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId), engine_entity_EngineShipEntity);
			if (ship != null) {
				if (this.deleteShipCallback != null) {
					this.deleteShipCallback(ship);
				}
				var key = ship.ownerId;
				var _this = this.playerShipMap;
				if (Object.prototype.hasOwnProperty.call(_this.h, key)) {
					delete (_this.h[key]);
				}
				this.shipManager.remove(shipId);
			}
		}
		, shipAccelerate: function (shipId) {
			var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId), engine_entity_EngineShipEntity);
			if (ship != null) {
				ship.accelerate();
			}
		}
		, shipDecelerate: function (shipId) {
			var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId), engine_entity_EngineShipEntity);
			if (ship != null) {
				ship.decelerate();
			}
		}
		, shipRotateLeft: function (shipId) {
			var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId), engine_entity_EngineShipEntity);
			if (ship != null) {
				ship.rotateLeft();
			}
		}
		, shipRotateRight: function (shipId) {
			var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId), engine_entity_EngineShipEntity);
			if (ship != null) {
				ship.rotateRight();
			}
		}
		, shipShootBySide: function (side, shipId, serverSide, shellRnd) {
			if (serverSide == null) {
				serverSide = true;
			}
			var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId), engine_entity_EngineShipEntity);
			if (ship != null) {
				var shipSideRadRotation = ship.rotation + engine_MathUtils.degreeToRads(side == engine_entity_Side.Left ? -90 : 90);
				var pos1 = ship.getCanonOffsetBySideAndIndex(side, 0);
				var pos2 = ship.getCanonOffsetBySideAndIndex(side, 1);
				var pos3 = ship.getCanonOffsetBySideAndIndex(side, 2);
				var shell1 = this.addShell(side, 0, pos1.x, pos1.y, shipSideRadRotation, ship.id, shellRnd != null && shellRnd[0] != null ? shellRnd[0] : null);
				var shell2 = this.addShell(side, 1, pos2.x, pos2.y, shipSideRadRotation, ship.id, shellRnd != null && shellRnd[1] != null ? shellRnd[1] : null);
				var shell3 = this.addShell(side, 2, pos3.x, pos3.y, shipSideRadRotation, ship.id, shellRnd != null && shellRnd[2] != null ? shellRnd[2] : null);
				shell1.serverSide = serverSide;
				shell2.serverSide = serverSide;
				shell3.serverSide = serverSide;
				if (this.createShellCallback != null) {
					this.createShellCallback([shell1, shell2, shell3]);
				}
			}
		}
		, addShell: function (side, pos, x, y, rotation, ownerId, shellRnd) {
			var newShell = new engine_entity_EngineShellEntity(side, pos, x, y, rotation, ownerId, shellRnd);
			this.shellManager.add(newShell);
			return newShell;
		}
		, __class__: engine_GameEngine
	};
	var engine_GameLoop = function (update) {
		console.log("engine/GameLoop.hx:12:", "JS !");
		new engine_DummyJsLoop(update);
	};
	engine_GameLoop.__name__ = true;
	engine_GameLoop.prototype = {
		__class__: engine_GameLoop
	};
	var engine_DummyJsLoop = function (update) {
		this.delta = 0.0;
		this.previous = Date.now();
		this.tick = 0;
		this.targetFPSMillis = Math.floor(1000 / engine_GameLoop.TargetFps);
		this.update = update;
		this.loop();
	};
	engine_DummyJsLoop.__name__ = true;
	engine_DummyJsLoop.prototype = {
		loop: function () {
			haxe_Timer.delay($bind(this, this.loop), this.targetFPSMillis);
			var now = Date.now();
			this.delta = (now - this.previous) / 1000;
			this.update(this.delta, this.tick);
			this.previous = now;
			this.tick++;
		}
		, __class__: engine_DummyJsLoop
	};
	var engine_MathUtils = function () { };
	engine_MathUtils.__name__ = true;
	engine_MathUtils.dirToRad = function (dir) {
		var result = 0;
		switch (dir._hx_index) {
			case 0:
				result = 0;
				break;
			case 1:
				result = -90;
				break;
			case 2:
				result = -25;
				break;
			case 3:
				result = -155;
				break;
			case 4:
				result = -90;
				break;
			case 5:
				result = 25;
				break;
			case 6:
				result = -25;
				break;
			case 7:
				result = 0;
				break;
		}
		return engine_MathUtils.degreeToRads(result);
	};
	engine_MathUtils.degreeToRads = function (degrees) {
		return degrees * Math.PI / 180;
	};
	engine_MathUtils.rotatePointAroundCenter = function (x, y, cx, cy, r) {
		var cos = Math.cos(r);
		var sin = Math.sin(r);
		return { x: cos * (x - cx) - sin * (y - cy) + cx, y: cos * (y - cy) + sin * (x - cx) + cy };
	};
	engine_MathUtils.lineToLineIntersection = function (x1, y1, x2, y2, x3, y3, x4, y4) {
		var numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		var numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
		var deNom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		if (deNom == 0) {
			return false;
		}
		var uA = numA / deNom;
		var uB = numB / deNom;
		if (uA >= 0 && uA <= 1 && uB >= 0) {
			return uB <= 1;
		} else {
			return false;
		}
	};
	var engine_entity_GameEntityType = $hxEnums["engine.entity.GameEntityType"] = {
		__ename__: true, __constructs__: null
		, Ship: { _hx_name: "Ship", _hx_index: 0, __enum__: "engine.entity.GameEntityType", toString: $estr }
		, Shell: { _hx_name: "Shell", _hx_index: 1, __enum__: "engine.entity.GameEntityType", toString: $estr }
	};
	engine_entity_GameEntityType.__constructs__ = [engine_entity_GameEntityType.Ship, engine_entity_GameEntityType.Shell];
	var engine_entity_GameEntityDirection = $hxEnums["engine.entity.GameEntityDirection"] = {
		__ename__: true, __constructs__: null
		, East: { _hx_name: "East", _hx_index: 0, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, North: { _hx_name: "North", _hx_index: 1, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, NorthEast: { _hx_name: "NorthEast", _hx_index: 2, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, NorthWest: { _hx_name: "NorthWest", _hx_index: 3, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, South: { _hx_name: "South", _hx_index: 4, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, SouthEast: { _hx_name: "SouthEast", _hx_index: 5, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, SouthWest: { _hx_name: "SouthWest", _hx_index: 6, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
		, West: { _hx_name: "West", _hx_index: 7, __enum__: "engine.entity.GameEntityDirection", toString: $estr }
	};
	engine_entity_GameEntityDirection.__constructs__ = [engine_entity_GameEntityDirection.East, engine_entity_GameEntityDirection.North, engine_entity_GameEntityDirection.NorthEast, engine_entity_GameEntityDirection.NorthWest, engine_entity_GameEntityDirection.South, engine_entity_GameEntityDirection.SouthEast, engine_entity_GameEntityDirection.SouthWest, engine_entity_GameEntityDirection.West];
	var engine_entity_Side = $hxEnums["engine.entity.Side"] = {
		__ename__: true, __constructs__: null
		, Left: { _hx_name: "Left", _hx_index: 0, __enum__: "engine.entity.Side", toString: $estr }
		, Right: { _hx_name: "Right", _hx_index: 1, __enum__: "engine.entity.Side", toString: $estr }
	};
	engine_entity_Side.__constructs__ = [engine_entity_Side.Left, engine_entity_Side.Right];
	var engine_entity_PosOffset = function (r, x, y) {
		this.x = x;
		this.y = y;
		this.r = r;
	};
	engine_entity_PosOffset.__name__ = true;
	engine_entity_PosOffset.prototype = {
		__class__: engine_entity_PosOffset
	};
	var engine_entity_PosOffsetArray = function (one, two, three, four) {
		this.one = one;
		this.two = two;
		this.three = three;
		this.four = four;
	};
	engine_entity_PosOffsetArray.__name__ = true;
	engine_entity_PosOffsetArray.prototype = {
		__class__: engine_entity_PosOffsetArray
	};
	var engine_entity_EngineBaseGameEntity = function (entityType, x, y, rotation, id, ownerId) {
		this.canMove = true;
		this.maxSpeed = 150;
		this.minSpeed = -50;
		this.speedStep = 50;
		this.currentSpeed = 0.0;
		this.dy = 0.0;
		this.dx = 0.0;
		this.y = 0.0;
		this.x = 0.0;
		this.rotation = 0.0;
		this.direction = engine_entity_GameEntityDirection.East;
		this.serverSide = true;
		this.isCollides = true;
		this.isAlive = true;
		this.entityType = entityType;
		switch (entityType._hx_index) {
			case 0:
				this.shapeWidth = 200;
				this.shapeHeight = 80;
				break;
			case 1:
				this.shapeWidth = 10;
				this.shapeHeight = 10;
				break;
		}
		this.shapeWidthHalf = this.shapeWidth / 2;
		this.shapeHeightHalf = this.shapeHeight / 2;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		if (id == null) {
			this.id = uuid_Uuid.short();
		} else {
			this.id = id;
		}
		if (ownerId != null) {
			this.ownerId = ownerId;
		}
	};
	engine_entity_EngineBaseGameEntity.__name__ = true;
	engine_entity_EngineBaseGameEntity.prototype = {
		update: function (dt) {
			this.customUpdate(dt);
			if (this.canMove) {
				this.move(dt);
			}
		}
		, getGameRect: function () {
			return new engine_entity_EngineGameRect(this.x, this.y, this.shapeWidth, this.shapeHeight, engine_MathUtils.dirToRad(this.direction));
		}
		, collides: function (isCollides) {
			this.isCollides = isCollides;
			this.onCollision();
		}
		, move: function (dt) {
			this.dx = this.currentSpeed * Math.cos(this.rotation) * dt;
			this.dy = this.currentSpeed * Math.sin(this.rotation) * dt;
			this.x += this.dx;
			this.y += this.dy;
		}
		, __class__: engine_entity_EngineBaseGameEntity
	};
	var engine_entity_EngineGameRect = function (x, y, w, h, r) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
	};
	engine_entity_EngineGameRect.__name__ = true;
	engine_entity_EngineGameRect.prototype = {
		getCenter: function () {
			return { x: this.x + this.w / 2, y: this.y + this.y / 2 };
		}
		, getLeft: function () {
			return this.x - this.w / 2;
		}
		, getRight: function () {
			return this.x + this.w / 2;
		}
		, getTop: function () {
			return this.y - this.h / 2;
		}
		, getBottom: function () {
			return this.y + this.h / 2;
		}
		, getTopLeftPoint: function () {
			var rotatedCoords = engine_MathUtils.rotatePointAroundCenter(this.getLeft(), this.getTop(), this.x, this.y, this.r);
			return { x: rotatedCoords.x, y: rotatedCoords.y };
		}
		, getBottomLeftPoint: function () {
			var rotatedCoords = engine_MathUtils.rotatePointAroundCenter(this.getLeft(), this.getBottom(), this.x, this.y, this.r);
			return { x: rotatedCoords.x, y: rotatedCoords.y };
		}
		, getTopRightPoint: function () {
			var rotatedCoords = engine_MathUtils.rotatePointAroundCenter(this.getRight(), this.getTop(), this.x, this.y, this.r);
			return { x: rotatedCoords.x, y: rotatedCoords.y };
		}
		, getBottomRightPoint: function () {
			var rotatedCoords = engine_MathUtils.rotatePointAroundCenter(this.getRight(), this.getBottom(), this.x, this.y, this.r);
			return { x: rotatedCoords.x, y: rotatedCoords.y };
		}
		, getLines: function () {
			var topLeftPoint = this.getTopLeftPoint();
			var bottomLeftPoint = this.getBottomLeftPoint();
			var topRightPoint = this.getTopRightPoint();
			var bottomRightPoint = this.getBottomRightPoint();
			return { lineA: { x1: topLeftPoint.x, y1: topLeftPoint.y, x2: topRightPoint.x, y2: topRightPoint.y }, lineB: { x1: topRightPoint.x, y1: topRightPoint.y, x2: bottomRightPoint.x, y2: bottomRightPoint.y }, lineC: { x1: bottomRightPoint.x, y1: bottomRightPoint.y, x2: bottomLeftPoint.x, y2: bottomLeftPoint.y }, lineD: { x1: bottomLeftPoint.x, y1: bottomLeftPoint.y, x2: topLeftPoint.x, y2: topLeftPoint.y } };
		}
		, contains: function (b) {
			var result = true;
			if (this.getLeft() >= b.getRight() || b.getLeft() >= this.getRight()) {
				result = false;
			}
			if (this.getTop() >= b.getBottom() || b.getTop() >= this.getBottom()) {
				result = false;
			}
			return result;
		}
		, intersectsWithLine: function (x1, y1, x2, y2) {
			var rA = this.getLines();
			if (engine_MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2)) {
				return true;
			} else if (engine_MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2)) {
				return true;
			} else if (engine_MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2)) {
				return true;
			} else if (engine_MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2)) {
				return true;
			}
			return false;
		}
		, intersectsWithRect: function (b) {
			if (this.r == 0 && b.r == 0) {
				return this.contains(b);
			} else {
				var rA = this.getLines();
				var rB = b.getLines();
				if (engine_MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2, rB.lineA.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2, rB.lineB.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2, rB.lineC.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2, rB.lineD.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2, rB.lineA.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2, rB.lineB.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2, rB.lineC.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2, rB.lineD.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2, rB.lineA.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2, rB.lineB.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2, rB.lineC.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2, rB.lineD.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2, rB.lineA.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2, rB.lineB.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2, rB.lineC.y2)) {
					return true;
				} else if (engine_MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2, rB.lineD.y2)) {
					return true;
				}
				return false;
			}
		}
		, __class__: engine_entity_EngineGameRect
	};
	var engine_entity_DieEffect = $hxEnums["engine.entity.DieEffect"] = {
		__ename__: true, __constructs__: null
		, Splash: { _hx_name: "Splash", _hx_index: 0, __enum__: "engine.entity.DieEffect", toString: $estr }
		, Explosion: { _hx_name: "Explosion", _hx_index: 1, __enum__: "engine.entity.DieEffect", toString: $estr }
	};
	engine_entity_DieEffect.__constructs__ = [engine_entity_DieEffect.Splash, engine_entity_DieEffect.Explosion];
	var engine_entity_EngineShellEntity = function (side, pos, x, y, rotation, ownerId, shellRnd) {
		this.distanceTraveled = 0.0;
		this.maxTravelDistance = 600;
		this.dieEffect = engine_entity_DieEffect.Splash;
		this.baseDamage = 50;
		engine_entity_EngineBaseGameEntity.call(this, engine_entity_GameEntityType.Shell, x, y, rotation, null, ownerId);
		this.side = side;
		this.pos = pos;
		if (shellRnd != null) {
			this.shellRnd = shellRnd;
		} else {
			this.shellRnd = { speed: Std.random(30), dir: Std.random(2), rotation: Std.random(7) };
		}
		this.currentSpeed = 380;
		this.currentSpeed += this.shellRnd.speed;
		this.rotation += engine_MathUtils.degreeToRads(this.shellRnd.dir == 1 ? this.shellRnd.rotation : -this.shellRnd.rotation);
	};
	engine_entity_EngineShellEntity.__name__ = true;
	engine_entity_EngineShellEntity.__super__ = engine_entity_EngineBaseGameEntity;
	engine_entity_EngineShellEntity.prototype = $extend(engine_entity_EngineBaseGameEntity.prototype, {
		customUpdate: function (dt) {
			this.distanceTraveled += Math.abs(this.dx) + Math.abs(this.dy);
			if (this.distanceTraveled >= this.maxTravelDistance) {
				this.isAlive = false;
			}
		}
		, onCollision: function () {
			this.isAlive = false;
			this.dieEffect = engine_entity_DieEffect.Explosion;
		}
		, __class__: engine_entity_EngineShellEntity
	});
	var engine_entity_EngineShipEntity = function (x, y, id, ownerId) {
		this.currentArmor = 1000;
		this.currentHull = 1000;
		this.baseArmor = 1000;
		this.baseHull = 1000;
		engine_entity_EngineBaseGameEntity.call(this, engine_entity_GameEntityType.Ship, x, y, 0, id, ownerId);
	};
	engine_entity_EngineShipEntity.__name__ = true;
	engine_entity_EngineShipEntity.__super__ = engine_entity_EngineBaseGameEntity;
	engine_entity_EngineShipEntity.prototype = $extend(engine_entity_EngineBaseGameEntity.prototype, {
		accelerate: function () {
			this.currentSpeed += this.speedStep;
			if (this.currentSpeed > this.maxSpeed) {
				this.currentSpeed = this.maxSpeed;
			}
			if (this.speedChangeCallback != null) {
				this.speedChangeCallback(this.currentSpeed);
			}
		}
		, decelerate: function () {
			this.currentSpeed -= this.speedStep;
			if (this.currentSpeed < this.minSpeed) {
				this.currentSpeed = this.minSpeed;
			}
			if (this.speedChangeCallback != null) {
				this.speedChangeCallback(this.currentSpeed);
			}
		}
		, rotateLeft: function () {
			this.rotation -= engine_MathUtils.degreeToRads(45);
			switch (this.direction._hx_index) {
				case 0:
					this.direction = engine_entity_GameEntityDirection.NorthEast;
					break;
				case 1:
					this.direction = engine_entity_GameEntityDirection.NorthWest;
					break;
				case 2:
					this.direction = engine_entity_GameEntityDirection.North;
					break;
				case 3:
					this.direction = engine_entity_GameEntityDirection.West;
					break;
				case 4:
					this.direction = engine_entity_GameEntityDirection.SouthEast;
					break;
				case 5:
					this.direction = engine_entity_GameEntityDirection.East;
					break;
				case 6:
					this.direction = engine_entity_GameEntityDirection.South;
					break;
				case 7:
					this.direction = engine_entity_GameEntityDirection.SouthWest;
					break;
			}
			if (this.directionChangeCallback != null) {
				this.directionChangeCallback(this.direction);
			}
		}
		, rotateRight: function () {
			this.rotation += engine_MathUtils.degreeToRads(45);
			switch (this.direction._hx_index) {
				case 0:
					this.direction = engine_entity_GameEntityDirection.SouthEast;
					break;
				case 1:
					this.direction = engine_entity_GameEntityDirection.NorthEast;
					break;
				case 2:
					this.direction = engine_entity_GameEntityDirection.East;
					break;
				case 3:
					this.direction = engine_entity_GameEntityDirection.North;
					break;
				case 4:
					this.direction = engine_entity_GameEntityDirection.SouthWest;
					break;
				case 5:
					this.direction = engine_entity_GameEntityDirection.South;
					break;
				case 6:
					this.direction = engine_entity_GameEntityDirection.West;
					break;
				case 7:
					this.direction = engine_entity_GameEntityDirection.NorthWest;
					break;
			}
			if (this.directionChangeCallback != null) {
				this.directionChangeCallback(this.direction);
			}
		}
		, inflictDamage: function (damage) {
			if (this.currentArmor > 0) {
				var damageDiff = Math.round(Math.abs(this.currentArmor - damage));
				if (this.currentArmor - damage < 0) {
					this.currentArmor = 0;
					this.currentHull -= damageDiff;
				} else {
					this.currentArmor -= damage;
				}
			} else {
				this.currentHull -= damage;
				if (this.currentHull <= 0) {
					this.isAlive = false;
				}
			}
		}
		, getCanonOffsetBySideAndIndex: function (side, index) {
			var offset = side == engine_entity_Side.Left ? engine_entity_EngineShipEntity.LeftCanonsOffsetByDir.get(this.direction) : engine_entity_EngineShipEntity.RightCanonsOffsetByDir.get(this.direction);
			var offsetX = offset.one.x;
			var offsetY = offset.one.y;
			if (index == 1) {
				offsetX = offset.two.x;
				offsetY = offset.two.y;
			} else if (index == 2) {
				offsetX = offset.three.x;
				offsetY = offset.three.y;
			}
			return { x: this.x + offsetX, y: this.y + offsetY };
		}
		, customUpdate: function (dt) {
		}
		, onCollision: function () {
		}
		, __class__: engine_entity_EngineShipEntity
	});
	var engine_entity_manager_BaseEntityManager = function () {
		this.entities = new Map();
	};
	engine_entity_manager_BaseEntityManager.__name__ = true;
	engine_entity_manager_BaseEntityManager.prototype = {
		add: function (entity) {
			this.entities.set(entity.id, entity);
		}
		, remove: function (id) {
			this.entities.delete(id);
		}
		, getEntityById: function (id) {
			return this.entities.get(id);
		}
		, __class__: engine_entity_manager_BaseEntityManager
	};
	var engine_entity_manager_ShellManager = function () {
		engine_entity_manager_BaseEntityManager.call(this);
	};
	engine_entity_manager_ShellManager.__name__ = true;
	engine_entity_manager_ShellManager.__super__ = engine_entity_manager_BaseEntityManager;
	engine_entity_manager_ShellManager.prototype = $extend(engine_entity_manager_BaseEntityManager.prototype, {
		shootFromLeftShipSide: function (ship) {
			var r = ship.rotation + engine_MathUtils.degreeToRads(-90);
		}
		, __class__: engine_entity_manager_ShellManager
	});
	var engine_entity_manager_ShipManager = function () {
		engine_entity_manager_BaseEntityManager.call(this);
	};
	engine_entity_manager_ShipManager.__name__ = true;
	engine_entity_manager_ShipManager.__super__ = engine_entity_manager_BaseEntityManager;
	engine_entity_manager_ShipManager.prototype = $extend(engine_entity_manager_BaseEntityManager.prototype, {
		__class__: engine_entity_manager_ShipManager
	});
	var haxe_IMap = function () { };
	haxe_IMap.__name__ = true;
	haxe_IMap.__isInterface__ = true;
	var haxe_Exception = function (message, previous, native) {
		Error.call(this, message);
		this.message = message;
		this.__previousException = previous;
		this.__nativeException = native != null ? native : this;
	};
	haxe_Exception.__name__ = true;
	haxe_Exception.thrown = function (value) {
		if (((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if (((value) instanceof Error)) {
			return value;
		} else {
			var e = new haxe_ValueException(value);
			return e;
		}
	};
	haxe_Exception.__super__ = Error;
	haxe_Exception.prototype = $extend(Error.prototype, {
		get_native: function () {
			return this.__nativeException;
		}
		, __class__: haxe_Exception
	});
	var haxe_Int32 = {};
	haxe_Int32.ucompare = function (a, b) {
		if (a < 0) {
			if (b < 0) {
				return ~b - ~a | 0;
			} else {
				return 1;
			}
		}
		if (b < 0) {
			return -1;
		} else {
			return a - b | 0;
		}
	};
	var haxe_Int64 = {};
	haxe_Int64.divMod = function (dividend, divisor) {
		if (divisor.high == 0) {
			switch (divisor.low) {
				case 0:
					throw haxe_Exception.thrown("divide by zero");
				case 1:
					var this1 = new haxe__$Int64__$_$_$Int64(dividend.high, dividend.low);
					var this2 = new haxe__$Int64__$_$_$Int64(0, 0);
					return { quotient: this1, modulus: this2 };
			}
		}
		var divSign = dividend.high < 0 != divisor.high < 0;
		var modulus;
		if (dividend.high < 0) {
			var high = ~dividend.high;
			var low = ~dividend.low + 1 | 0;
			if (low == 0) {
				var ret = high++;
				high = high | 0;
			}
			var this1 = new haxe__$Int64__$_$_$Int64(high, low);
			modulus = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(dividend.high, dividend.low);
			modulus = this1;
		}
		if (divisor.high < 0) {
			var high = ~divisor.high;
			var low = ~divisor.low + 1 | 0;
			if (low == 0) {
				var ret = high++;
				high = high | 0;
			}
			var this1 = new haxe__$Int64__$_$_$Int64(high, low);
			divisor = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(0, 0);
		var quotient = this1;
		var this1 = new haxe__$Int64__$_$_$Int64(0, 1);
		var mask = this1;
		while (!(divisor.high < 0)) {
			var v = haxe_Int32.ucompare(divisor.high, modulus.high);
			var cmp = v != 0 ? v : haxe_Int32.ucompare(divisor.low, modulus.low);
			var b = 1;
			b &= 63;
			if (b == 0) {
				var this1 = new haxe__$Int64__$_$_$Int64(divisor.high, divisor.low);
				divisor = this1;
			} else if (b < 32) {
				var this2 = new haxe__$Int64__$_$_$Int64(divisor.high << b | divisor.low >>> 32 - b, divisor.low << b);
				divisor = this2;
			} else {
				var this3 = new haxe__$Int64__$_$_$Int64(divisor.low << b - 32, 0);
				divisor = this3;
			}
			var b1 = 1;
			b1 &= 63;
			if (b1 == 0) {
				var this4 = new haxe__$Int64__$_$_$Int64(mask.high, mask.low);
				mask = this4;
			} else if (b1 < 32) {
				var this5 = new haxe__$Int64__$_$_$Int64(mask.high << b1 | mask.low >>> 32 - b1, mask.low << b1);
				mask = this5;
			} else {
				var this6 = new haxe__$Int64__$_$_$Int64(mask.low << b1 - 32, 0);
				mask = this6;
			}
			if (cmp >= 0) {
				break;
			}
		}
		while (true) {
			var b_high = 0;
			var b_low = 0;
			if (!(mask.high != b_high || mask.low != b_low)) {
				break;
			}
			var v = haxe_Int32.ucompare(modulus.high, divisor.high);
			if ((v != 0 ? v : haxe_Int32.ucompare(modulus.low, divisor.low)) >= 0) {
				var this1 = new haxe__$Int64__$_$_$Int64(quotient.high | mask.high, quotient.low | mask.low);
				quotient = this1;
				var high = modulus.high - divisor.high | 0;
				var low = modulus.low - divisor.low | 0;
				if (haxe_Int32.ucompare(modulus.low, divisor.low) < 0) {
					var ret = high--;
					high = high | 0;
				}
				var this2 = new haxe__$Int64__$_$_$Int64(high, low);
				modulus = this2;
			}
			var b = 1;
			b &= 63;
			if (b == 0) {
				var this3 = new haxe__$Int64__$_$_$Int64(mask.high, mask.low);
				mask = this3;
			} else if (b < 32) {
				var this4 = new haxe__$Int64__$_$_$Int64(mask.high >>> b, mask.high << 32 - b | mask.low >>> b);
				mask = this4;
			} else {
				var this5 = new haxe__$Int64__$_$_$Int64(0, mask.high >>> b - 32);
				mask = this5;
			}
			var b1 = 1;
			b1 &= 63;
			if (b1 == 0) {
				var this6 = new haxe__$Int64__$_$_$Int64(divisor.high, divisor.low);
				divisor = this6;
			} else if (b1 < 32) {
				var this7 = new haxe__$Int64__$_$_$Int64(divisor.high >>> b1, divisor.high << 32 - b1 | divisor.low >>> b1);
				divisor = this7;
			} else {
				var this8 = new haxe__$Int64__$_$_$Int64(0, divisor.high >>> b1 - 32);
				divisor = this8;
			}
		}
		if (divSign) {
			var high = ~quotient.high;
			var low = ~quotient.low + 1 | 0;
			if (low == 0) {
				var ret = high++;
				high = high | 0;
			}
			var this1 = new haxe__$Int64__$_$_$Int64(high, low);
			quotient = this1;
		}
		if (dividend.high < 0) {
			var high = ~modulus.high;
			var low = ~modulus.low + 1 | 0;
			if (low == 0) {
				var ret = high++;
				high = high | 0;
			}
			var this1 = new haxe__$Int64__$_$_$Int64(high, low);
			modulus = this1;
		}
		return { quotient: quotient, modulus: modulus };
	};
	var haxe__$Int64__$_$_$Int64 = function (high, low) {
		this.high = high;
		this.low = low;
	};
	haxe__$Int64__$_$_$Int64.__name__ = true;
	haxe__$Int64__$_$_$Int64.prototype = {
		__class__: haxe__$Int64__$_$_$Int64
	};
	var haxe_Int64Helper = function () { };
	haxe_Int64Helper.__name__ = true;
	haxe_Int64Helper.fromFloat = function (f) {
		if (isNaN(f) || !isFinite(f)) {
			throw haxe_Exception.thrown("Number is NaN or Infinite");
		}
		var noFractions = f - f % 1;
		if (noFractions > 9007199254740991) {
			throw haxe_Exception.thrown("Conversion overflow");
		}
		if (noFractions < -9007199254740991) {
			throw haxe_Exception.thrown("Conversion underflow");
		}
		var this1 = new haxe__$Int64__$_$_$Int64(0, 0);
		var result = this1;
		var neg = noFractions < 0;
		var rest = neg ? -noFractions : noFractions;
		var i = 0;
		while (rest >= 1) {
			var curr = rest % 2;
			rest /= 2;
			if (curr >= 1) {
				var a_high = 0;
				var a_low = 1;
				var b = i;
				b &= 63;
				var b1;
				if (b == 0) {
					var this1 = new haxe__$Int64__$_$_$Int64(a_high, a_low);
					b1 = this1;
				} else if (b < 32) {
					var this2 = new haxe__$Int64__$_$_$Int64(a_high << b | a_low >>> 32 - b, a_low << b);
					b1 = this2;
				} else {
					var this3 = new haxe__$Int64__$_$_$Int64(a_low << b - 32, 0);
					b1 = this3;
				}
				var high = result.high + b1.high | 0;
				var low = result.low + b1.low | 0;
				if (haxe_Int32.ucompare(low, result.low) < 0) {
					var ret = high++;
					high = high | 0;
				}
				var this4 = new haxe__$Int64__$_$_$Int64(high, low);
				result = this4;
			}
			++i;
		}
		if (neg) {
			var high = ~result.high;
			var low = ~result.low + 1 | 0;
			if (low == 0) {
				var ret = high++;
				high = high | 0;
			}
			var this1 = new haxe__$Int64__$_$_$Int64(high, low);
			result = this1;
		}
		return result;
	};
	var haxe_Timer = function (time_ms) {
		var me = this;
		this.id = setInterval(function () {
			me.run();
		}, time_ms);
	};
	haxe_Timer.__name__ = true;
	haxe_Timer.delay = function (f, time_ms) {
		var t = new haxe_Timer(time_ms);
		t.run = function () {
			t.stop();
			f();
		};
		return t;
	};
	haxe_Timer.prototype = {
		stop: function () {
			if (this.id == null) {
				return;
			}
			clearInterval(this.id);
			this.id = null;
		}
		, run: function () {
		}
		, __class__: haxe_Timer
	};
	var haxe_ValueException = function (value, previous, native) {
		haxe_Exception.call(this, String(value), previous, native);
		this.value = value;
	};
	haxe_ValueException.__name__ = true;
	haxe_ValueException.__super__ = haxe_Exception;
	haxe_ValueException.prototype = $extend(haxe_Exception.prototype, {
		__class__: haxe_ValueException
	});
	var haxe_crypto_Md5 = function () {
	};
	haxe_crypto_Md5.__name__ = true;
	haxe_crypto_Md5.make = function (b) {
		var h = new haxe_crypto_Md5().doEncode(haxe_crypto_Md5.bytes2blks(b));
		var out = new haxe_io_Bytes(new ArrayBuffer(16));
		var p = 0;
		out.b[p++] = h[0] & 255;
		out.b[p++] = h[0] >> 8 & 255;
		out.b[p++] = h[0] >> 16 & 255;
		out.b[p++] = h[0] >>> 24;
		out.b[p++] = h[1] & 255;
		out.b[p++] = h[1] >> 8 & 255;
		out.b[p++] = h[1] >> 16 & 255;
		out.b[p++] = h[1] >>> 24;
		out.b[p++] = h[2] & 255;
		out.b[p++] = h[2] >> 8 & 255;
		out.b[p++] = h[2] >> 16 & 255;
		out.b[p++] = h[2] >>> 24;
		out.b[p++] = h[3] & 255;
		out.b[p++] = h[3] >> 8 & 255;
		out.b[p++] = h[3] >> 16 & 255;
		out.b[p++] = h[3] >>> 24;
		return out;
	};
	haxe_crypto_Md5.bytes2blks = function (b) {
		var nblk = (b.length + 8 >> 6) + 1;
		var blks = [];
		var blksSize = nblk * 16;
		var _g = 0;
		var _g1 = blksSize;
		while (_g < _g1) {
			var i = _g++;
			blks[i] = 0;
		}
		var i = 0;
		while (i < b.length) {
			blks[i >> 2] |= b.b[i] << (((b.length << 3) + i & 3) << 3);
			++i;
		}
		blks[i >> 2] |= 128 << (b.length * 8 + i) % 4 * 8;
		var l = b.length * 8;
		var k = nblk * 16 - 2;
		blks[k] = l & 255;
		blks[k] |= (l >>> 8 & 255) << 8;
		blks[k] |= (l >>> 16 & 255) << 16;
		blks[k] |= (l >>> 24 & 255) << 24;
		return blks;
	};
	haxe_crypto_Md5.prototype = {
		bitOR: function (a, b) {
			var lsb = a & 1 | b & 1;
			var msb31 = a >>> 1 | b >>> 1;
			return msb31 << 1 | lsb;
		}
		, bitXOR: function (a, b) {
			var lsb = a & 1 ^ b & 1;
			var msb31 = a >>> 1 ^ b >>> 1;
			return msb31 << 1 | lsb;
		}
		, bitAND: function (a, b) {
			var lsb = a & 1 & (b & 1);
			var msb31 = a >>> 1 & b >>> 1;
			return msb31 << 1 | lsb;
		}
		, addme: function (x, y) {
			var lsw = (x & 65535) + (y & 65535);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return msw << 16 | lsw & 65535;
		}
		, rol: function (num, cnt) {
			return num << cnt | num >>> 32 - cnt;
		}
		, cmn: function (q, a, b, x, s, t) {
			return this.addme(this.rol(this.addme(this.addme(a, q), this.addme(x, t)), s), b);
		}
		, ff: function (a, b, c, d, x, s, t) {
			return this.cmn(this.bitOR(this.bitAND(b, c), this.bitAND(~b, d)), a, b, x, s, t);
		}
		, gg: function (a, b, c, d, x, s, t) {
			return this.cmn(this.bitOR(this.bitAND(b, d), this.bitAND(c, ~d)), a, b, x, s, t);
		}
		, hh: function (a, b, c, d, x, s, t) {
			return this.cmn(this.bitXOR(this.bitXOR(b, c), d), a, b, x, s, t);
		}
		, ii: function (a, b, c, d, x, s, t) {
			return this.cmn(this.bitXOR(c, this.bitOR(b, ~d)), a, b, x, s, t);
		}
		, doEncode: function (x) {
			var a = 1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d = 271733878;
			var step;
			var i = 0;
			while (i < x.length) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				step = 0;
				a = this.ff(a, b, c, d, x[i], 7, -680876936);
				d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
				c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
				b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
				a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
				d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
				c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
				b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
				a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
				d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
				c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
				b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
				a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
				d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
				c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
				b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);
				a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
				d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
				c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
				b = this.gg(b, c, d, a, x[i], 20, -373897302);
				a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
				d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
				c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
				b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
				a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
				d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
				c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
				b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
				a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
				d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
				c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
				b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);
				a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
				d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
				c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
				b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
				a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
				d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
				c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
				b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
				a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
				d = this.hh(d, a, b, c, x[i], 11, -358537222);
				c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
				b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
				a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
				d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
				c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
				b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);
				a = this.ii(a, b, c, d, x[i], 6, -198630844);
				d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
				c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
				b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
				a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
				d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
				c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
				b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
				a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
				d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
				c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
				b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
				a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
				d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
				c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
				b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);
				a = this.addme(a, olda);
				b = this.addme(b, oldb);
				c = this.addme(c, oldc);
				d = this.addme(d, oldd);
				i += 16;
			}
			return [a, b, c, d];
		}
		, __class__: haxe_crypto_Md5
	};
	var haxe_crypto_Sha1 = function () {
	};
	haxe_crypto_Sha1.__name__ = true;
	haxe_crypto_Sha1.make = function (b) {
		var h = new haxe_crypto_Sha1().doEncode(haxe_crypto_Sha1.bytes2blks(b));
		var out = new haxe_io_Bytes(new ArrayBuffer(20));
		var p = 0;
		out.b[p++] = h[0] >>> 24;
		out.b[p++] = h[0] >> 16 & 255;
		out.b[p++] = h[0] >> 8 & 255;
		out.b[p++] = h[0] & 255;
		out.b[p++] = h[1] >>> 24;
		out.b[p++] = h[1] >> 16 & 255;
		out.b[p++] = h[1] >> 8 & 255;
		out.b[p++] = h[1] & 255;
		out.b[p++] = h[2] >>> 24;
		out.b[p++] = h[2] >> 16 & 255;
		out.b[p++] = h[2] >> 8 & 255;
		out.b[p++] = h[2] & 255;
		out.b[p++] = h[3] >>> 24;
		out.b[p++] = h[3] >> 16 & 255;
		out.b[p++] = h[3] >> 8 & 255;
		out.b[p++] = h[3] & 255;
		out.b[p++] = h[4] >>> 24;
		out.b[p++] = h[4] >> 16 & 255;
		out.b[p++] = h[4] >> 8 & 255;
		out.b[p++] = h[4] & 255;
		return out;
	};
	haxe_crypto_Sha1.bytes2blks = function (b) {
		var nblk = (b.length + 8 >> 6) + 1;
		var blks = [];
		var _g = 0;
		var _g1 = nblk * 16;
		while (_g < _g1) {
			var i = _g++;
			blks[i] = 0;
		}
		var _g = 0;
		var _g1 = b.length;
		while (_g < _g1) {
			var i = _g++;
			var p = i >> 2;
			blks[p] |= b.b[i] << 24 - ((i & 3) << 3);
		}
		var i = b.length;
		var p = i >> 2;
		blks[p] |= 128 << 24 - ((i & 3) << 3);
		blks[nblk * 16 - 1] = b.length * 8;
		return blks;
	};
	haxe_crypto_Sha1.prototype = {
		doEncode: function (x) {
			var w = [];
			var a = 1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d = 271733878;
			var e = -1009589776;
			var i = 0;
			while (i < x.length) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				var olde = e;
				var j = 0;
				while (j < 80) {
					if (j < 16) {
						w[j] = x[i + j];
					} else {
						var num = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
						w[j] = num << 1 | num >>> 31;
					}
					var t = (a << 5 | a >>> 27) + this.ft(j, b, c, d) + e + w[j] + this.kt(j);
					e = d;
					d = c;
					c = b << 30 | b >>> 2;
					b = a;
					a = t;
					++j;
				}
				a += olda;
				b += oldb;
				c += oldc;
				d += oldd;
				e += olde;
				i += 16;
			}
			return [a, b, c, d, e];
		}
		, ft: function (t, b, c, d) {
			if (t < 20) {
				return b & c | ~b & d;
			}
			if (t < 40) {
				return b ^ c ^ d;
			}
			if (t < 60) {
				return b & c | b & d | c & d;
			}
			return b ^ c ^ d;
		}
		, kt: function (t) {
			if (t < 20) {
				return 1518500249;
			}
			if (t < 40) {
				return 1859775393;
			}
			if (t < 60) {
				return -1894007588;
			}
			return -899497514;
		}
		, __class__: haxe_crypto_Sha1
	};
	var haxe_ds_BalancedTree = function () {
	};
	haxe_ds_BalancedTree.__name__ = true;
	haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
	haxe_ds_BalancedTree.prototype = {
		set: function (key, value) {
			this.root = this.setLoop(key, value, this.root);
		}
		, get: function (key) {
			var node = this.root;
			while (node != null) {
				var c = this.compare(key, node.key);
				if (c == 0) {
					return node.value;
				}
				if (c < 0) {
					node = node.left;
				} else {
					node = node.right;
				}
			}
			return null;
		}
		, setLoop: function (k, v, node) {
			if (node == null) {
				return new haxe_ds_TreeNode(null, k, v, null);
			}
			var c = this.compare(k, node.key);
			if (c == 0) {
				return new haxe_ds_TreeNode(node.left, k, v, node.right, node == null ? 0 : node._height);
			} else if (c < 0) {
				var nl = this.setLoop(k, v, node.left);
				return this.balance(nl, node.key, node.value, node.right);
			} else {
				var nr = this.setLoop(k, v, node.right);
				return this.balance(node.left, node.key, node.value, nr);
			}
		}
		, balance: function (l, k, v, r) {
			var hl = l == null ? 0 : l._height;
			var hr = r == null ? 0 : r._height;
			if (hl > hr + 2) {
				var _this = l.left;
				var _this1 = l.right;
				if ((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
					return new haxe_ds_TreeNode(l.left, l.key, l.value, new haxe_ds_TreeNode(l.right, k, v, r));
				} else {
					return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left, l.key, l.value, l.right.left), l.right.key, l.right.value, new haxe_ds_TreeNode(l.right.right, k, v, r));
				}
			} else if (hr > hl + 2) {
				var _this = r.right;
				var _this1 = r.left;
				if ((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
					return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l, k, v, r.left), r.key, r.value, r.right);
				} else {
					return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l, k, v, r.left.left), r.left.key, r.left.value, new haxe_ds_TreeNode(r.left.right, r.key, r.value, r.right));
				}
			} else {
				return new haxe_ds_TreeNode(l, k, v, r, (hl > hr ? hl : hr) + 1);
			}
		}
		, compare: function (k1, k2) {
			return Reflect.compare(k1, k2);
		}
		, __class__: haxe_ds_BalancedTree
	};
	var haxe_ds_TreeNode = function (l, k, v, r, h) {
		if (h == null) {
			h = -1;
		}
		this.left = l;
		this.key = k;
		this.value = v;
		this.right = r;
		if (h == -1) {
			var tmp;
			var _this = this.left;
			var _this1 = this.right;
			if ((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				var _this = this.left;
				tmp = _this == null ? 0 : _this._height;
			} else {
				var _this = this.right;
				tmp = _this == null ? 0 : _this._height;
			}
			this._height = tmp + 1;
		} else {
			this._height = h;
		}
	};
	haxe_ds_TreeNode.__name__ = true;
	haxe_ds_TreeNode.prototype = {
		__class__: haxe_ds_TreeNode
	};
	var haxe_ds_EnumValueMap = function () {
		haxe_ds_BalancedTree.call(this);
	};
	haxe_ds_EnumValueMap.__name__ = true;
	haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
	haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
	haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype, {
		compare: function (k1, k2) {
			var d = k1._hx_index - k2._hx_index;
			if (d != 0) {
				return d;
			}
			var p1 = Type.enumParameters(k1);
			var p2 = Type.enumParameters(k2);
			if (p1.length == 0 && p2.length == 0) {
				return 0;
			}
			return this.compareArgs(p1, p2);
		}
		, compareArgs: function (a1, a2) {
			var ld = a1.length - a2.length;
			if (ld != 0) {
				return ld;
			}
			var _g = 0;
			var _g1 = a1.length;
			while (_g < _g1) {
				var i = _g++;
				var d = this.compareArg(a1[i], a2[i]);
				if (d != 0) {
					return d;
				}
			}
			return 0;
		}
		, compareArg: function (v1, v2) {
			if (Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
				return this.compare(v1, v2);
			} else if (((v1) instanceof Array) && ((v2) instanceof Array)) {
				return this.compareArgs(v1, v2);
			} else {
				return Reflect.compare(v1, v2);
			}
		}
		, __class__: haxe_ds_EnumValueMap
	});
	var haxe_ds_StringMap = function () {
		this.h = Object.create(null);
	};
	haxe_ds_StringMap.__name__ = true;
	haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
	haxe_ds_StringMap.prototype = {
		__class__: haxe_ds_StringMap
	};
	var haxe_io_Bytes = function (data) {
		this.length = data.byteLength;
		this.b = new Uint8Array(data);
		this.b.bufferValue = data;
		data.hxBytes = this;
		data.bytes = this.b;
	};
	haxe_io_Bytes.__name__ = true;
	haxe_io_Bytes.ofString = function (s, encoding) {
		if (encoding == haxe_io_Encoding.RawNative) {
			var buf = new Uint8Array(s.length << 1);
			var _g = 0;
			var _g1 = s.length;
			while (_g < _g1) {
				var i = _g++;
				var c = s.charCodeAt(i);
				buf[i << 1] = c & 255;
				buf[i << 1 | 1] = c >> 8;
			}
			return new haxe_io_Bytes(buf.buffer);
		}
		var a = [];
		var i = 0;
		while (i < s.length) {
			var c = s.charCodeAt(i++);
			if (55296 <= c && c <= 56319) {
				c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
			}
			if (c <= 127) {
				a.push(c);
			} else if (c <= 2047) {
				a.push(192 | c >> 6);
				a.push(128 | c & 63);
			} else if (c <= 65535) {
				a.push(224 | c >> 12);
				a.push(128 | c >> 6 & 63);
				a.push(128 | c & 63);
			} else {
				a.push(240 | c >> 18);
				a.push(128 | c >> 12 & 63);
				a.push(128 | c >> 6 & 63);
				a.push(128 | c & 63);
			}
		}
		return new haxe_io_Bytes(new Uint8Array(a).buffer);
	};
	haxe_io_Bytes.ofHex = function (s) {
		if ((s.length & 1) != 0) {
			throw haxe_Exception.thrown("Not a hex string (odd number of digits)");
		}
		var a = [];
		var i = 0;
		var len = s.length >> 1;
		while (i < len) {
			var high = s.charCodeAt(i * 2);
			var low = s.charCodeAt(i * 2 + 1);
			high = (high & 15) + ((high & 64) >> 6) * 9;
			low = (low & 15) + ((low & 64) >> 6) * 9;
			a.push((high << 4 | low) & 255);
			++i;
		}
		return new haxe_io_Bytes(new Uint8Array(a).buffer);
	};
	haxe_io_Bytes.prototype = {
		toHex: function () {
			var s_b = "";
			var chars = [];
			var str = "0123456789abcdef";
			var _g = 0;
			var _g1 = str.length;
			while (_g < _g1) {
				var i = _g++;
				chars.push(HxOverrides.cca(str, i));
			}
			var _g = 0;
			var _g1 = this.length;
			while (_g < _g1) {
				var i = _g++;
				var c = this.b[i];
				s_b += String.fromCodePoint(chars[c >> 4]);
				s_b += String.fromCodePoint(chars[c & 15]);
			}
			return s_b;
		}
		, __class__: haxe_io_Bytes
	};
	var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = {
		__ename__: true, __constructs__: null
		, UTF8: { _hx_name: "UTF8", _hx_index: 0, __enum__: "haxe.io.Encoding", toString: $estr }
		, RawNative: { _hx_name: "RawNative", _hx_index: 1, __enum__: "haxe.io.Encoding", toString: $estr }
	};
	haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8, haxe_io_Encoding.RawNative];
	var haxe_iterators_ArrayIterator = function (array) {
		this.current = 0;
		this.array = array;
	};
	haxe_iterators_ArrayIterator.__name__ = true;
	haxe_iterators_ArrayIterator.prototype = {
		hasNext: function () {
			return this.current < this.array.length;
		}
		, next: function () {
			return this.array[this.current++];
		}
		, __class__: haxe_iterators_ArrayIterator
	};
	var js_Boot = function () { };
	js_Boot.__name__ = true;
	js_Boot.getClass = function (o) {
		if (o == null) {
			return null;
		} else if (((o) instanceof Array)) {
			return Array;
		} else {
			var cl = o.__class__;
			if (cl != null) {
				return cl;
			}
			var name = js_Boot.__nativeClassName(o);
			if (name != null) {
				return js_Boot.__resolveNativeClass(name);
			}
			return null;
		}
	};
	js_Boot.__string_rec = function (o, s) {
		if (o == null) {
			return "null";
		}
		if (s.length >= 5) {
			return "<...>";
		}
		var t = typeof (o);
		if (t == "function" && (o.__name__ || o.__ename__)) {
			t = "object";
		}
		switch (t) {
			case "function":
				return "<function>";
			case "object":
				if (o.__enum__) {
					var e = $hxEnums[o.__enum__];
					var con = e.__constructs__[o._hx_index];
					var n = con._hx_name;
					if (con.__params__) {
						s = s + "\t";
						return n + "(" + ((function ($this) {
							var $r;
							var _g = [];
							{
								var _g1 = 0;
								var _g2 = con.__params__;
								while (true) {
									if (!(_g1 < _g2.length)) {
										break;
									}
									var p = _g2[_g1];
									_g1 = _g1 + 1;
									_g.push(js_Boot.__string_rec(o[p], s));
								}
							}
							$r = _g;
							return $r;
						}(this))).join(",") + ")";
					} else {
						return n;
					}
				}
				if (((o) instanceof Array)) {
					var str = "[";
					s += "\t";
					var _g = 0;
					var _g1 = o.length;
					while (_g < _g1) {
						var i = _g++;
						str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i], s);
					}
					str += "]";
					return str;
				}
				var tostr;
				try {
					tostr = o.toString;
				} catch (_g) {
					return "???";
				}
				if (tostr != null && tostr != Object.toString && typeof (tostr) == "function") {
					var s2 = o.toString();
					if (s2 != "[object Object]") {
						return s2;
					}
				}
				var str = "{\n";
				s += "\t";
				var hasp = o.hasOwnProperty != null;
				var k = null;
				for (k in o) {
					if (hasp && !o.hasOwnProperty(k)) {
						continue;
					}
					if (k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
						continue;
					}
					if (str.length != 2) {
						str += ", \n";
					}
					str += s + k + " : " + js_Boot.__string_rec(o[k], s);
				}
				s = s.substring(1);
				str += "\n" + s + "}";
				return str;
			case "string":
				return o;
			default:
				return String(o);
		}
	};
	js_Boot.__interfLoop = function (cc, cl) {
		if (cc == null) {
			return false;
		}
		if (cc == cl) {
			return true;
		}
		var intf = cc.__interfaces__;
		if (intf != null) {
			var _g = 0;
			var _g1 = intf.length;
			while (_g < _g1) {
				var i = _g++;
				var i1 = intf[i];
				if (i1 == cl || js_Boot.__interfLoop(i1, cl)) {
					return true;
				}
			}
		}
		return js_Boot.__interfLoop(cc.__super__, cl);
	};
	js_Boot.__instanceof = function (o, cl) {
		if (cl == null) {
			return false;
		}
		switch (cl) {
			case Array:
				return ((o) instanceof Array);
			case Bool:
				return typeof (o) == "boolean";
			case Dynamic:
				return o != null;
			case Float:
				return typeof (o) == "number";
			case Int:
				if (typeof (o) == "number") {
					return ((o | 0) === o);
				} else {
					return false;
				}
				break;
			case String:
				return typeof (o) == "string";
			default:
				if (o != null) {
					if (typeof (cl) == "function") {
						if (js_Boot.__downcastCheck(o, cl)) {
							return true;
						}
					} else if (typeof (cl) == "object" && js_Boot.__isNativeObj(cl)) {
						if (((o) instanceof cl)) {
							return true;
						}
					}
				} else {
					return false;
				}
				if (cl == Class ? o.__name__ != null : false) {
					return true;
				}
				if (cl == Enum ? o.__ename__ != null : false) {
					return true;
				}
				return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
		}
	};
	js_Boot.__downcastCheck = function (o, cl) {
		if (!((o) instanceof cl)) {
			if (cl.__isInterface__) {
				return js_Boot.__interfLoop(js_Boot.getClass(o), cl);
			} else {
				return false;
			}
		} else {
			return true;
		}
	};
	js_Boot.__cast = function (o, t) {
		if (o == null || js_Boot.__instanceof(o, t)) {
			return o;
		} else {
			throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
		}
	};
	js_Boot.__nativeClassName = function (o) {
		var name = js_Boot.__toStr.call(o).slice(8, -1);
		if (name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
			return null;
		}
		return name;
	};
	js_Boot.__isNativeObj = function (o) {
		return js_Boot.__nativeClassName(o) != null;
	};
	js_Boot.__resolveNativeClass = function (name) {
		return $global[name];
	};
	var uuid_Uuid = function () { };
	uuid_Uuid.__name__ = true;
	uuid_Uuid.splitmix64_seed = function (index) {
		var b_high = -1640531527;
		var b_low = 2135587861;
		var high = index.high + b_high | 0;
		var low = index.low + b_low | 0;
		if (haxe_Int32.ucompare(low, index.low) < 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high, low);
		var result = this1;
		var b = 30;
		b &= 63;
		var b1;
		if (b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high, result.low);
			b1 = this1;
		} else if (b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high >> b, result.high << 32 - b | result.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high >> 31, result.high >> b - 32);
			b1 = this1;
		}
		var a_high = result.high ^ b1.high;
		var a_low = result.low ^ b1.low;
		var b_high = -1084733587;
		var b_low = 484763065;
		var mask = 65535;
		var al = a_low & mask;
		var ah = a_low >>> 16;
		var bl = b_low & mask;
		var bh = b_low >>> 16;
		var p00 = haxe_Int32._mul(al, bl);
		var p10 = haxe_Int32._mul(ah, bl);
		var p01 = haxe_Int32._mul(al, bh);
		var p11 = haxe_Int32._mul(ah, bh);
		var low = p00;
		var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 <<= 16;
		low = low + p01 | 0;
		if (haxe_Int32.ucompare(low, p01) < 0) {
			var ret = high++;
			high = high | 0;
		}
		p10 <<= 16;
		low = low + p10 | 0;
		if (haxe_Int32.ucompare(low, p10) < 0) {
			var ret = high++;
			high = high | 0;
		}
		high = high + (haxe_Int32._mul(a_low, b_high) + haxe_Int32._mul(a_high, b_low) | 0) | 0;
		var this1 = new haxe__$Int64__$_$_$Int64(high, low);
		result = this1;
		var b = 27;
		b &= 63;
		var b1;
		if (b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high, result.low);
			b1 = this1;
		} else if (b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high >> b, result.high << 32 - b | result.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high >> 31, result.high >> b - 32);
			b1 = this1;
		}
		var a_high = result.high ^ b1.high;
		var a_low = result.low ^ b1.low;
		var b_high = -1798288965;
		var b_low = 321982955;
		var mask = 65535;
		var al = a_low & mask;
		var ah = a_low >>> 16;
		var bl = b_low & mask;
		var bh = b_low >>> 16;
		var p00 = haxe_Int32._mul(al, bl);
		var p10 = haxe_Int32._mul(ah, bl);
		var p01 = haxe_Int32._mul(al, bh);
		var p11 = haxe_Int32._mul(ah, bh);
		var low = p00;
		var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 <<= 16;
		low = low + p01 | 0;
		if (haxe_Int32.ucompare(low, p01) < 0) {
			var ret = high++;
			high = high | 0;
		}
		p10 <<= 16;
		low = low + p10 | 0;
		if (haxe_Int32.ucompare(low, p10) < 0) {
			var ret = high++;
			high = high | 0;
		}
		high = high + (haxe_Int32._mul(a_low, b_high) + haxe_Int32._mul(a_high, b_low) | 0) | 0;
		var this1 = new haxe__$Int64__$_$_$Int64(high, low);
		result = this1;
		var b = 31;
		b &= 63;
		var b1;
		if (b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high, result.low);
			b1 = this1;
		} else if (b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high >> b, result.high << 32 - b | result.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(result.high >> 31, result.high >> b - 32);
			b1 = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(result.high ^ b1.high, result.low ^ b1.low);
		return this1;
	};
	uuid_Uuid.randomFromRange = function (min, max) {
		var s1 = uuid_Uuid.state0;
		var s0 = uuid_Uuid.state1;
		uuid_Uuid.state0 = s0;
		var b = 23;
		b &= 63;
		var b1;
		if (b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high, s1.low);
			b1 = this1;
		} else if (b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high << b | s1.low >>> 32 - b, s1.low << b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.low << b - 32, 0);
			b1 = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(s1.high ^ b1.high, s1.low ^ b1.low);
		s1 = this1;
		var a_high = s1.high ^ s0.high;
		var a_low = s1.low ^ s0.low;
		var b = 18;
		b &= 63;
		var b1;
		if (b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high, s1.low);
			b1 = this1;
		} else if (b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high >>> b, s1.high << 32 - b | s1.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(0, s1.high >>> b - 32);
			b1 = this1;
		}
		var a_high1 = a_high ^ b1.high;
		var a_low1 = a_low ^ b1.low;
		var b = 5;
		b &= 63;
		var b1;
		if (b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(s0.high, s0.low);
			b1 = this1;
		} else if (b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(s0.high >>> b, s0.high << 32 - b | s0.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(0, s0.high >>> b - 32);
			b1 = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(a_high1 ^ b1.high, a_low1 ^ b1.low);
		uuid_Uuid.state1 = this1;
		var a = uuid_Uuid.state1;
		var high = a.high + s0.high | 0;
		var low = a.low + s0.low | 0;
		if (haxe_Int32.ucompare(low, a.low) < 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high, low);
		var x = max - min + 1;
		var this2 = new haxe__$Int64__$_$_$Int64(x >> 31, x);
		var result = haxe_Int64.divMod(this1, this2).modulus.low;
		if (result < 0) {
			result = -result;
		}
		return result + min;
	};
	uuid_Uuid.randomByte = function () {
		return uuid_Uuid.randomFromRange(0, 255);
	};
	uuid_Uuid.fromShort = function (shortUuid, separator, fromAlphabet) {
		if (fromAlphabet == null) {
			fromAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		if (separator == null) {
			separator = "-";
		}
		var uuid = uuid_Uuid.convert(shortUuid, fromAlphabet, "0123456789abcdef");
		return uuid_Uuid.hexToUuid(uuid, separator);
	};
	uuid_Uuid.toShort = function (uuid, separator, toAlphabet) {
		if (toAlphabet == null) {
			toAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		if (separator == null) {
			separator = "-";
		}
		uuid = StringTools.replace(uuid, separator, "").toLowerCase();
		return uuid_Uuid.convert(uuid, "0123456789abcdef", toAlphabet);
	};
	uuid_Uuid.fromNano = function (nanoUuid, separator, fromAlphabet) {
		if (fromAlphabet == null) {
			fromAlphabet = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		}
		if (separator == null) {
			separator = "-";
		}
		var uuid = uuid_Uuid.convert(nanoUuid, fromAlphabet, "0123456789abcdef");
		return uuid_Uuid.hexToUuid(uuid, separator);
	};
	uuid_Uuid.toNano = function (uuid, separator, toAlphabet) {
		if (toAlphabet == null) {
			toAlphabet = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		}
		if (separator == null) {
			separator = "-";
		}
		uuid = StringTools.replace(uuid, separator, "").toLowerCase();
		return uuid_Uuid.convert(uuid, "0123456789abcdef", toAlphabet);
	};
	uuid_Uuid.v1 = function (node, optClockSequence, msecs, optNsecs, randomFunc, separator, shortUuid, toAlphabet) {
		if (toAlphabet == null) {
			toAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		if (shortUuid == null) {
			shortUuid = false;
		}
		if (separator == null) {
			separator = "-";
		}
		if (optNsecs == null) {
			optNsecs = -1;
		}
		if (msecs == null) {
			msecs = -1;
		}
		if (optClockSequence == null) {
			optClockSequence = -1;
		}
		if (randomFunc == null) {
			randomFunc = uuid_Uuid.randomByte;
		}
		var buffer = new haxe_io_Bytes(new ArrayBuffer(16));
		if (node == null) {
			node = new haxe_io_Bytes(new ArrayBuffer(6));
			var v = randomFunc();
			node.b[0] = v;
			var v = randomFunc();
			node.b[1] = v;
			var v = randomFunc();
			node.b[2] = v;
			var v = randomFunc();
			node.b[3] = v;
			var v = randomFunc();
			node.b[4] = v;
			var v = randomFunc();
			node.b[5] = v;
			node.b[0] |= 1;
		}
		if (uuid_Uuid.clockSequenceBuffer == -1) {
			uuid_Uuid.clockSequenceBuffer = (randomFunc() << 8 | randomFunc()) & 16383;
		}
		var clockSeq = optClockSequence;
		if (optClockSequence == -1) {
			clockSeq = uuid_Uuid.clockSequenceBuffer;
		}
		if (msecs == -1) {
			msecs = Math.round(Date.now());
		}
		var nsecs = optNsecs;
		if (optNsecs == -1) {
			nsecs = uuid_Uuid.lastNSecs + 1;
		}
		var dt = msecs - uuid_Uuid.lastMSecs + (nsecs - uuid_Uuid.lastNSecs) / 10000;
		if (dt < 0 && optClockSequence == -1) {
			clockSeq = clockSeq + 1 & 16383;
		}
		if ((dt < 0 || msecs > uuid_Uuid.lastMSecs) && optNsecs == -1) {
			nsecs = 0;
		}
		if (nsecs >= 10000) {
			throw haxe_Exception.thrown("Can't create more than 10M uuids/sec");
		}
		uuid_Uuid.lastMSecs = msecs;
		uuid_Uuid.lastNSecs = nsecs;
		uuid_Uuid.clockSequenceBuffer = clockSeq;
		msecs += 12219292800000;
		var imsecs = haxe_Int64Helper.fromFloat(msecs);
		var b_high = 0;
		var b_low = 268435455;
		var a_high = imsecs.high & b_high;
		var a_low = imsecs.low & b_low;
		var b_high = 0;
		var b_low = 10000;
		var mask = 65535;
		var al = a_low & mask;
		var ah = a_low >>> 16;
		var bl = b_low & mask;
		var bh = b_low >>> 16;
		var p00 = haxe_Int32._mul(al, bl);
		var p10 = haxe_Int32._mul(ah, bl);
		var p01 = haxe_Int32._mul(al, bh);
		var p11 = haxe_Int32._mul(ah, bh);
		var low = p00;
		var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 <<= 16;
		low = low + p01 | 0;
		if (haxe_Int32.ucompare(low, p01) < 0) {
			var ret = high++;
			high = high | 0;
		}
		p10 <<= 16;
		low = low + p10 | 0;
		if (haxe_Int32.ucompare(low, p10) < 0) {
			var ret = high++;
			high = high | 0;
		}
		high = high + (haxe_Int32._mul(a_low, b_high) + haxe_Int32._mul(a_high, b_low) | 0) | 0;
		var a_high = high;
		var a_low = low;
		var b_high = nsecs >> 31;
		var b_low = nsecs;
		var high = a_high + b_high | 0;
		var low = a_low + b_low | 0;
		if (haxe_Int32.ucompare(low, a_low) < 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high, low);
		var tl = haxe_Int64.divMod(this1, uuid_Uuid.DVS).modulus.low;
		buffer.b[0] = tl >>> 24 & 255;
		buffer.b[1] = tl >>> 16 & 255;
		buffer.b[2] = tl >>> 8 & 255;
		buffer.b[3] = tl & 255;
		var a = haxe_Int64.divMod(imsecs, uuid_Uuid.DVS).quotient;
		var b_high = 0;
		var b_low = 10000;
		var mask = 65535;
		var al = a.low & mask;
		var ah = a.low >>> 16;
		var bl = b_low & mask;
		var bh = b_low >>> 16;
		var p00 = haxe_Int32._mul(al, bl);
		var p10 = haxe_Int32._mul(ah, bl);
		var p01 = haxe_Int32._mul(al, bh);
		var p11 = haxe_Int32._mul(ah, bh);
		var low = p00;
		var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 <<= 16;
		low = low + p01 | 0;
		if (haxe_Int32.ucompare(low, p01) < 0) {
			var ret = high++;
			high = high | 0;
		}
		p10 <<= 16;
		low = low + p10 | 0;
		if (haxe_Int32.ucompare(low, p10) < 0) {
			var ret = high++;
			high = high | 0;
		}
		high = high + (haxe_Int32._mul(a.low, b_high) + haxe_Int32._mul(a.high, b_low) | 0) | 0;
		var a_high = high;
		var a_low = low;
		var b_high = 0;
		var b_low = 268435455;
		var this_high = a_high & b_high;
		var this_low = a_low & b_low;
		var tmh = this_low;
		buffer.b[4] = tmh >>> 8 & 255;
		buffer.b[5] = tmh & 255;
		buffer.b[6] = tmh >>> 24 & 15 | 16;
		buffer.b[7] = tmh >>> 16 & 255;
		buffer.b[8] = clockSeq >>> 8 | 128;
		buffer.b[9] = clockSeq & 255;
		buffer.b[10] = node.b[0];
		buffer.b[11] = node.b[1];
		buffer.b[12] = node.b[2];
		buffer.b[13] = node.b[3];
		buffer.b[14] = node.b[4];
		buffer.b[15] = node.b[5];
		var uuid = uuid_Uuid.stringify(buffer, separator);
		if (shortUuid) {
			uuid = uuid_Uuid.toShort(uuid, separator, toAlphabet);
		}
		return uuid;
	};
	uuid_Uuid.v3 = function (name, namespace, separator, shortUuid, toAlphabet) {
		if (toAlphabet == null) {
			toAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		if (shortUuid == null) {
			shortUuid = false;
		}
		if (separator == null) {
			separator = "-";
		}
		if (namespace == null) {
			namespace = "";
		}
		namespace = StringTools.replace(namespace, "-", "");
		var buffer = haxe_crypto_Md5.make(haxe_io_Bytes.ofHex(namespace + haxe_io_Bytes.ofString(name).toHex()));
		buffer.b[6] = buffer.b[6] & 15 | 48;
		buffer.b[8] = buffer.b[8] & 63 | 128;
		var uuid = uuid_Uuid.stringify(buffer, separator);
		if (shortUuid) {
			uuid = uuid_Uuid.toShort(uuid, separator, toAlphabet);
		}
		return uuid;
	};
	uuid_Uuid.v4 = function (randBytes, randomFunc, separator, shortUuid, toAlphabet) {
		if (toAlphabet == null) {
			toAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		if (shortUuid == null) {
			shortUuid = false;
		}
		if (separator == null) {
			separator = "-";
		}
		if (randomFunc == null) {
			randomFunc = uuid_Uuid.randomByte;
		}
		var buffer = randBytes;
		if (buffer == null) {
			buffer = new haxe_io_Bytes(new ArrayBuffer(16));
			var v = randomFunc();
			buffer.b[0] = v;
			var v = randomFunc();
			buffer.b[1] = v;
			var v = randomFunc();
			buffer.b[2] = v;
			var v = randomFunc();
			buffer.b[3] = v;
			var v = randomFunc();
			buffer.b[4] = v;
			var v = randomFunc();
			buffer.b[5] = v;
			var v = randomFunc();
			buffer.b[6] = v;
			var v = randomFunc();
			buffer.b[7] = v;
			var v = randomFunc();
			buffer.b[8] = v;
			var v = randomFunc();
			buffer.b[9] = v;
			var v = randomFunc();
			buffer.b[10] = v;
			var v = randomFunc();
			buffer.b[11] = v;
			var v = randomFunc();
			buffer.b[12] = v;
			var v = randomFunc();
			buffer.b[13] = v;
			var v = randomFunc();
			buffer.b[14] = v;
			var v = randomFunc();
			buffer.b[15] = v;
		} else if (buffer.length < 16) {
			throw haxe_Exception.thrown("Random bytes should be at least 16 bytes");
		}
		buffer.b[6] = buffer.b[6] & 15 | 64;
		buffer.b[8] = buffer.b[8] & 63 | 128;
		var uuid = uuid_Uuid.stringify(buffer, separator);
		if (shortUuid) {
			uuid = uuid_Uuid.toShort(uuid, separator, toAlphabet);
		}
		return uuid;
	};
	uuid_Uuid.v5 = function (name, namespace, separator, shortUuid, toAlphabet) {
		if (toAlphabet == null) {
			toAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		if (shortUuid == null) {
			shortUuid = false;
		}
		if (separator == null) {
			separator = "-";
		}
		if (namespace == null) {
			namespace = "";
		}
		namespace = StringTools.replace(namespace, "-", "");
		var buffer = haxe_crypto_Sha1.make(haxe_io_Bytes.ofHex(namespace + haxe_io_Bytes.ofString(name).toHex()));
		buffer.b[6] = buffer.b[6] & 15 | 80;
		buffer.b[8] = buffer.b[8] & 63 | 128;
		var uuid = uuid_Uuid.stringify(buffer, separator);
		if (shortUuid) {
			uuid = uuid_Uuid.toShort(uuid, separator, toAlphabet);
		}
		return uuid;
	};
	uuid_Uuid.stringify = function (data, separator) {
		if (separator == null) {
			separator = "-";
		}
		return uuid_Uuid.hexToUuid(data.toHex(), separator);
	};
	uuid_Uuid.parse = function (uuid, separator) {
		if (separator == null) {
			separator = "-";
		}
		return haxe_io_Bytes.ofHex(StringTools.replace(uuid, separator, ""));
	};
	uuid_Uuid.validate = function (uuid, separator) {
		if (separator == null) {
			separator = "-";
		}
		if (separator == "") {
			uuid = HxOverrides.substr(uuid, 0, 8) + "-" + HxOverrides.substr(uuid, 8, 4) + "-" + HxOverrides.substr(uuid, 12, 4) + "-" + HxOverrides.substr(uuid, 16, 4) + "-" + HxOverrides.substr(uuid, 20, 12);
		} else if (separator != "-") {
			uuid = StringTools.replace(uuid, separator, "-");
		}
		return uuid_Uuid.regexp.match(uuid);
	};
	uuid_Uuid.version = function (uuid, separator) {
		if (separator == null) {
			separator = "-";
		}
		uuid = StringTools.replace(uuid, separator, "");
		return Std.parseInt("0x" + HxOverrides.substr(uuid, 12, 1));
	};
	uuid_Uuid.hexToUuid = function (hex, separator) {
		return HxOverrides.substr(hex, 0, 8) + separator + HxOverrides.substr(hex, 8, 4) + separator + HxOverrides.substr(hex, 12, 4) + separator + HxOverrides.substr(hex, 16, 4) + separator + HxOverrides.substr(hex, 20, 12);
	};
	uuid_Uuid.convert = function (number, fromAlphabet, toAlphabet) {
		var fromBase = fromAlphabet.length;
		var toBase = toAlphabet.length;
		var len = number.length;
		var buf = "";
		var this1 = new Array(len);
		var numberMap = this1;
		var divide = 0;
		var newlen = 0;
		var _g = 0;
		var _g1 = len;
		while (_g < _g1) {
			var i = _g++;
			numberMap[i] = fromAlphabet.indexOf(number.charAt(i));
		}
		while (true) {
			divide = 0;
			newlen = 0;
			var _g = 0;
			var _g1 = len;
			while (_g < _g1) {
				var i = _g++;
				divide = divide * fromBase + numberMap[i];
				if (divide >= toBase) {
					numberMap[newlen++] = Math.floor(divide / toBase);
					divide %= toBase;
				} else if (newlen > 0) {
					numberMap[newlen++] = 0;
				}
			}
			len = newlen;
			buf = toAlphabet.charAt(divide) + buf;
			if (!(newlen != 0)) {
				break;
			}
		}
		return buf;
	};
	uuid_Uuid.nanoId = function (len, alphabet, randomFunc) {
		if (alphabet == null) {
			alphabet = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		}
		if (len == null) {
			len = 21;
		}
		if (randomFunc == null) {
			randomFunc = uuid_Uuid.randomByte;
		}
		if (alphabet == null) {
			throw haxe_Exception.thrown("Alphabet cannot be null");
		}
		if (alphabet.length == 0 || alphabet.length >= 256) {
			throw haxe_Exception.thrown("Alphabet must contain between 1 and 255 symbols");
		}
		if (len <= 0) {
			throw haxe_Exception.thrown("Length must be greater than zero");
		}
		var mask = (2 << Math.floor(Math.log(alphabet.length - 1) / Math.log(2))) - 1;
		var step = Math.ceil(1.6 * mask * len / alphabet.length);
		var sb_b = "";
		while (sb_b.length != len) {
			var _g = 0;
			var _g1 = step;
			while (_g < _g1) {
				var i = _g++;
				var rnd = randomFunc();
				var aIndex = rnd & mask;
				if (aIndex < alphabet.length) {
					sb_b += Std.string(alphabet.charAt(aIndex));
					if (sb_b.length == len) {
						break;
					}
				}
			}
		}
		return sb_b;
	};
	uuid_Uuid.short = function (toAlphabet, randomFunc) {
		if (toAlphabet == null) {
			toAlphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		}
		return uuid_Uuid.v4(null, randomFunc, null, true, toAlphabet);
	};
	function $bind(o, m) { if (m == null) return null; if (m.__id__ == null) m.__id__ = $global.$haxeUID++; var f; if (o.hx__closures__ == null) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if (f == null) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
	$global.$haxeUID |= 0;
	if (typeof (performance) != "undefined" ? typeof (performance.now) == "function" : false) {
		HxOverrides.now = performance.now.bind(performance);
	}
	if (String.fromCodePoint == null) String.fromCodePoint = function (c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c >> 10) + 0xD7C0) + String.fromCharCode((c & 0x3FF) + 0xDC00); }
	String.prototype.__class__ = String;
	String.__name__ = true;
	Array.__name__ = true;
	var Int = {};
	var Dynamic = {};
	var Float = Number;
	var Bool = Boolean;
	var Class = {};
	var Enum = {};
	js_Boot.__toStr = ({}).toString;
	engine_GameLoop.TargetFps = 15;
	engine_entity_EngineShipEntity.ShapeOffsetByDir = (function ($this) {
		var $r;
		var _g = new haxe_ds_EnumValueMap();
		_g.set(engine_entity_GameEntityDirection.East, new engine_entity_PosOffset(0, -100, -40));
		_g.set(engine_entity_GameEntityDirection.North, new engine_entity_PosOffset(-90, -50, 110));
		_g.set(engine_entity_GameEntityDirection.NorthEast, new engine_entity_PosOffset(-26, -110, 19));
		_g.set(engine_entity_GameEntityDirection.NorthWest, new engine_entity_PosOffset(-155, -65, 87));
		_g.set(engine_entity_GameEntityDirection.South, new engine_entity_PosOffset(90, 26, 72));
		_g.set(engine_entity_GameEntityDirection.SouthEast, new engine_entity_PosOffset(26, -80, -6));
		_g.set(engine_entity_GameEntityDirection.SouthWest, new engine_entity_PosOffset(-23, -113, 19));
		_g.set(engine_entity_GameEntityDirection.West, new engine_entity_PosOffset(0, -110, -42));
		$r = _g;
		return $r;
	}(this));
	engine_entity_EngineShipEntity.LeftCanonsOffsetByDir = (function ($this) {
		var $r;
		var _g = new haxe_ds_EnumValueMap();
		_g.set(engine_entity_GameEntityDirection.East, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -65, -50), new engine_entity_PosOffset(0, -25, -50), new engine_entity_PosOffset(0, 15, -50)));
		_g.set(engine_entity_GameEntityDirection.North, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -72, 64), new engine_entity_PosOffset(0, -72, 31), new engine_entity_PosOffset(0, -72, -3)));
		_g.set(engine_entity_GameEntityDirection.NorthEast, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -73, 4), new engine_entity_PosOffset(0, -46, -10), new engine_entity_PosOffset(0, -19, -21)));
		_g.set(engine_entity_GameEntityDirection.NorthWest, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -82, 42), new engine_entity_PosOffset(0, -52, 58), new engine_entity_PosOffset(0, -23, 69)));
		_g.set(engine_entity_GameEntityDirection.South, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, 58, -36), new engine_entity_PosOffset(0, 58, -2), new engine_entity_PosOffset(0, 58, 31)));
		_g.set(engine_entity_GameEntityDirection.SouthEast, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -14, -27), new engine_entity_PosOffset(0, 10, -10), new engine_entity_PosOffset(0, 36, 2)));
		_g.set(engine_entity_GameEntityDirection.SouthWest, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, 27, 61), new engine_entity_PosOffset(0, 56, 48), new engine_entity_PosOffset(0, 90, 33)));
		_g.set(engine_entity_GameEntityDirection.West, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -27, 69), new engine_entity_PosOffset(0, 14, 69), new engine_entity_PosOffset(0, 57, 69)));
		$r = _g;
		return $r;
	}(this));
	engine_entity_EngineShipEntity.RightCanonsOffsetByDir = (function ($this) {
		var $r;
		var _g = new haxe_ds_EnumValueMap();
		_g.set(engine_entity_GameEntityDirection.East, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -65, 71), new engine_entity_PosOffset(0, -25, 71), new engine_entity_PosOffset(0, 15, 71)));
		_g.set(engine_entity_GameEntityDirection.North, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, 57, 65), new engine_entity_PosOffset(0, 57, 30), new engine_entity_PosOffset(0, 57, -4)));
		_g.set(engine_entity_GameEntityDirection.NorthEast, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, 10, 70), new engine_entity_PosOffset(0, 40, 57), new engine_entity_PosOffset(0, 70, 45)));
		_g.set(engine_entity_GameEntityDirection.NorthWest, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, 61, 6), new engine_entity_PosOffset(0, 31, -6), new engine_entity_PosOffset(0, 10, -21)));
		_g.set(engine_entity_GameEntityDirection.South, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -69, -36), new engine_entity_PosOffset(0, -69, -2), new engine_entity_PosOffset(0, -69, 31)));
		_g.set(engine_entity_GameEntityDirection.SouthEast, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -103, 31), new engine_entity_PosOffset(0, -73, 50), new engine_entity_PosOffset(0, -44, 65)));
		_g.set(engine_entity_GameEntityDirection.SouthWest, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, -2, -31), new engine_entity_PosOffset(0, -27, -18), new engine_entity_PosOffset(0, -56, -6)));
		_g.set(engine_entity_GameEntityDirection.West, new engine_entity_PosOffsetArray(new engine_entity_PosOffset(0, 56, -48), new engine_entity_PosOffset(0, 15, -48), new engine_entity_PosOffset(0, -27, -48)));
		$r = _g;
		return $r;
	}(this));
	haxe_Int32._mul = Math.imul != null ? Math.imul : function (a, b) {
		return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
	};
	uuid_Uuid.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
	uuid_Uuid.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
	uuid_Uuid.ISO_OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8";
	uuid_Uuid.X500_DN = "6ba7b814-9dad-11d1-80b4-00c04fd430c8";
	uuid_Uuid.NIL = "00000000-0000-0000-0000-000000000000";
	uuid_Uuid.LOWERCASE_BASE26 = "abcdefghijklmnopqrstuvwxyz";
	uuid_Uuid.UPPERCASE_BASE26 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	uuid_Uuid.NO_LOOK_ALIKES_BASE51 = "2346789ABCDEFGHJKLMNPQRTUVWXYZabcdefghijkmnpqrtwxyz";
	uuid_Uuid.FLICKR_BASE58 = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
	uuid_Uuid.BASE_70 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-+!@#$^";
	uuid_Uuid.BASE_85 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";
	uuid_Uuid.COOKIE_BASE90 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&'()*+-./:<=>?@[]^_`{|}~";
	uuid_Uuid.NANO_ID_ALPHABET = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	uuid_Uuid.NUMBERS_BIN = "01";
	uuid_Uuid.NUMBERS_OCT = "01234567";
	uuid_Uuid.NUMBERS_DEC = "0123456789";
	uuid_Uuid.NUMBERS_HEX = "0123456789abcdef";
	uuid_Uuid.lastMSecs = 0;
	uuid_Uuid.lastNSecs = 0;
	uuid_Uuid.clockSequenceBuffer = -1;
	uuid_Uuid.regexp = new EReg("^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$", "i");
	uuid_Uuid.rndSeed = haxe_Int64Helper.fromFloat(Date.now());
	uuid_Uuid.state0 = uuid_Uuid.splitmix64_seed(uuid_Uuid.rndSeed);
	uuid_Uuid.state1 = (function ($this) {
		var $r;
		var a = uuid_Uuid.rndSeed;
		var x = Std.random(10000);
		var b_high = x >> 31;
		var b_low = x;
		var high = a.high + b_high | 0;
		var low = a.low + b_low | 0;
		if (haxe_Int32.ucompare(low, a.low) < 0) {
			var ret = high++;
			high = high | 0;
		}
		var a_high = high;
		var a_low = low;
		var b_high = 0;
		var b_low = 1;
		var high = a_high + b_high | 0;
		var low = a_low + b_low | 0;
		if (haxe_Int32.ucompare(low, a_low) < 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high, low);
		$r = uuid_Uuid.splitmix64_seed(this1);
		return $r;
	}(this));
	uuid_Uuid.DVS = (function ($this) {
		var $r;
		var this1 = new haxe__$Int64__$_$_$Int64(1, 0);
		$r = this1;
		return $r;
	}(this));
	engine_GameEngine.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
