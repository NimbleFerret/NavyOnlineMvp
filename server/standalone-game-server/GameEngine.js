(function ($hx_exports, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var entity_manager_BaseEntityManager = function() {
	this.entities = new haxe_ds_StringMap();
};
entity_manager_BaseEntityManager.__name__ = true;
entity_manager_BaseEntityManager.prototype = {
	add: function(entity) {
		this.entities.h[entity.id] = entity;
	}
	,remove: function(id) {
		var _this = this.entities;
		if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
			delete(_this.h[id]);
		}
	}
	,getEntityById: function(id) {
		return this.entities.h[id];
	}
	,__class__: entity_manager_BaseEntityManager
};
var entity_manager_ShipManager = function() {
	entity_manager_BaseEntityManager.call(this);
};
entity_manager_ShipManager.__name__ = true;
entity_manager_ShipManager.__super__ = entity_manager_BaseEntityManager;
entity_manager_ShipManager.prototype = $extend(entity_manager_BaseEntityManager.prototype,{
	__class__: entity_manager_ShipManager
});
var entity_manager_ShellManager = function() {
	entity_manager_BaseEntityManager.call(this);
};
entity_manager_ShellManager.__name__ = true;
entity_manager_ShellManager.__super__ = entity_manager_BaseEntityManager;
entity_manager_ShellManager.prototype = $extend(entity_manager_BaseEntityManager.prototype,{
	shootFromLeftShipSide: function(ship) {
		var r = ship.rotation + MathUtils.degreeToRads(-90);
	}
	,__class__: entity_manager_ShellManager
});
var entity_Side = $hxEnums["entity.Side"] = { __ename__:true,__constructs__:null
	,Left: {_hx_name:"Left",_hx_index:0,__enum__:"entity.Side",toString:$estr}
	,Right: {_hx_name:"Right",_hx_index:1,__enum__:"entity.Side",toString:$estr}
};
entity_Side.__constructs__ = [entity_Side.Left,entity_Side.Right];
var GameLoop = function(update) {
	console.log("src/GameLoop.hx:11:","JS !");
	new DummyJsLoop(update);
};
GameLoop.__name__ = true;
GameLoop.prototype = {
	__class__: GameLoop
};
var DummyJsLoop = function(update) {
	this.delta = 0.0;
	this.previous = Date.now();
	this.tick = 0;
	this.targetFPSMillis = Math.floor(1000 / GameLoop.TargetFps);
	this.update = update;
	this.loop();
};
DummyJsLoop.__name__ = true;
DummyJsLoop.prototype = {
	loop: function() {
		haxe_Timer.delay($bind(this,this.loop),this.targetFPSMillis);
		var now = Date.now();
		this.delta = (now - this.previous) / 1000;
		this.update(this.delta,this.tick);
		this.previous = now;
		this.tick++;
	}
	,__class__: DummyJsLoop
};
var GameEngine = $hx_exports["GameEngine"] = function() {
	this.framesPassed = 0;
	this.allowShoot = false;
	var _gthis = this;
	this.shipManager = new entity_manager_ShipManager();
	this.shellManager = new entity_manager_ShellManager();
	var loop = function(dt,tick) {
		_gthis.framesPassed++;
		if(_gthis.framesPassed == 50) {
			_gthis.allowShoot = true;
		}
		var h = _gthis.shipManager.entities.h;
		var ship_h = h;
		var ship_keys = Object.keys(h);
		var ship_length = ship_keys.length;
		var ship_current = 0;
		while(ship_current < ship_length) {
			var ship = ship_h[ship_keys[ship_current++]];
			if(ship.isAlive) {
				ship.collides(false);
				ship.update(dt);
				if(ship.id == "2" && _gthis.allowShoot) {
					_gthis.allowShoot = false;
					_gthis.framesPassed = 0;
					_gthis.shipShootBySide(entity_Side.Right,"2");
				}
				var h = _gthis.shipManager.entities.h;
				var ship2_h = h;
				var ship2_keys = Object.keys(h);
				var ship2_length = ship2_keys.length;
				var ship2_current = 0;
				while(ship2_current < ship2_length) {
					var ship2 = ship2_h[ship2_keys[ship2_current++]];
					if(ship.id != ship2.id) {
						if(ship.getGameRect().intersectsWithRect(ship2.getGameRect())) {
							ship.collides(true);
							ship2.collides(true);
						}
					}
				}
			}
		}
		var shipsToDelete = [];
		var shellsToDelete = [];
		var h = _gthis.shellManager.entities.h;
		var shell_h = h;
		var shell_keys = Object.keys(h);
		var shell_length = shell_keys.length;
		var shell_current = 0;
		while(shell_current < shell_length) {
			var shell = shell_h[shell_keys[shell_current++]];
			shell.update(dt);
			var h = _gthis.shipManager.entities.h;
			var ship_h = h;
			var ship_keys = Object.keys(h);
			var ship_length = ship_keys.length;
			var ship_current = 0;
			while(ship_current < ship_length) {
				var ship = ship_h[ship_keys[ship_current++]];
				if(shell.ownerId != ship.id) {
					if(shell.getGameRect().intersectsWithRect(ship.getGameRect()) && ship.isAlive) {
						ship.collides(true);
						shell.collides(true);
						var engineShipEntity = js_Boot.__cast(ship , entity_EngineShipEntity);
						var engineShellEntity = js_Boot.__cast(shell , entity_EngineShellEntity);
						engineShipEntity.inflictDamage(engineShellEntity.baseDamage);
						if(_gthis.shipHitByShellCallback != null) {
							_gthis.shipHitByShellCallback({ ship : engineShipEntity, damage : engineShellEntity.baseDamage});
						}
						if(!engineShipEntity.isAlive) {
							shipsToDelete.push(engineShipEntity.id);
						}
					}
				}
			}
			if(!shell.isAlive) {
				shellsToDelete.push(shell.id);
			}
		}
		var _g = 0;
		var _g1 = shellsToDelete.length;
		while(_g < _g1) {
			var i = _g++;
			var shell = js_Boot.__cast(_gthis.shellManager.getEntityById(shellsToDelete[i]) , entity_EngineShellEntity);
			if(shell != null) {
				if(_gthis.deleteShellCallback != null) {
					_gthis.deleteShellCallback(shell);
				}
				_gthis.shellManager.remove(shell.id);
			}
		}
		var _g = 0;
		var _g1 = shipsToDelete.length;
		while(_g < _g1) {
			var i = _g++;
			var ship = js_Boot.__cast(_gthis.shipManager.getEntityById(shipsToDelete[i]) , entity_EngineShipEntity);
			if(ship != null) {
				if(_gthis.deleteShipCallback != null) {
					_gthis.deleteShipCallback(ship);
				}
				_gthis.shipManager.remove(ship.id);
			}
		}
	};
	this.gameLoop = new GameLoop(loop);
};
GameEngine.__name__ = true;
GameEngine.main = function() {
};
GameEngine.GenerateId = function() {
	return "";
};
GameEngine.prototype = {
	addShip: function(x,y,id) {
		var newShip = new entity_EngineShipEntity(x,y,id);
		this.shipManager.add(newShip);
		return newShip;
	}
	,getShipById: function(id) {
		return this.shipManager.getEntityById(id);
	}
	,getShips: function() {
		return this.shipManager.entities;
	}
	,removeShip: function() {
	}
	,shipAccelerate: function(shipId) {
		var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId) , entity_EngineShipEntity);
		if(ship != null) {
			ship.accelerate();
		}
	}
	,shipDecelerate: function(shipId) {
		var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId) , entity_EngineShipEntity);
		if(ship != null) {
			ship.decelerate();
		}
	}
	,shipRotateLeft: function(shipId) {
		var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId) , entity_EngineShipEntity);
		if(ship != null) {
			ship.rotateLeft();
		}
	}
	,shipRotateRight: function(shipId) {
		var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId) , entity_EngineShipEntity);
		if(ship != null) {
			ship.rotateRight();
		}
	}
	,shipShootBySide: function(side,shipId) {
		var ship = js_Boot.__cast(this.shipManager.getEntityById(shipId) , entity_EngineShipEntity);
		if(ship != null) {
			var shipSideRadRotation = ship.rotation + MathUtils.degreeToRads(side == entity_Side.Left ? -90 : 90);
			var pos1 = ship.getCanonOffsetBySideAndIndex(side,0);
			var shell1 = this.addShell(side,0,pos1.x,pos1.y,shipSideRadRotation,ship.id);
			if(this.createShellCallback != null) {
				this.createShellCallback([shell1]);
			}
		}
	}
	,addShell: function(side,pos,x,y,rotation,ownerId) {
		var newShell = new entity_EngineShellEntity(side,pos,x,y,rotation,ownerId);
		this.shellManager.add(newShell);
		return newShell;
	}
	,__class__: GameEngine
};
Math.__name__ = true;
var MathUtils = function() { };
MathUtils.__name__ = true;
MathUtils.dirToRad = function(dir) {
	var result = 0;
	switch(dir._hx_index) {
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
	return MathUtils.degreeToRads(result);
};
MathUtils.degreeToRads = function(degrees) {
	return degrees * Math.PI / 180;
};
MathUtils.rotatePointAroundCenter = function(x,y,cx,cy,r) {
	var cos = Math.cos(r);
	var sin = Math.sin(r);
	return { x : cos * (x - cx) - sin * (y - cy) + cx, y : cos * (y - cy) + sin * (x - cx) + cy};
};
MathUtils.lineToLineIntersection = function(x1,y1,x2,y2,x3,y3,x4,y4) {
	var numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
	var numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
	var deNom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	if(deNom == 0) {
		return false;
	}
	var uA = numA / deNom;
	var uB = numB / deNom;
	if(uA >= 0 && uA <= 1 && uB >= 0) {
		return uB <= 1;
	} else {
		return false;
	}
};
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.isEnumValue = function(v) {
	if(v != null) {
		return v.__enum__ != null;
	} else {
		return false;
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var Type = function() { };
Type.__name__ = true;
Type.enumParameters = function(e) {
	var enm = $hxEnums[e.__enum__];
	var params = enm.__constructs__[e._hx_index].__params__;
	if(params != null) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < params.length) {
			var p = params[_g1];
			++_g1;
			_g.push(e[p]);
		}
		return _g;
	} else {
		return [];
	}
};
var entity_GameEntityType = $hxEnums["entity.GameEntityType"] = { __ename__:true,__constructs__:null
	,Ship: {_hx_name:"Ship",_hx_index:0,__enum__:"entity.GameEntityType",toString:$estr}
	,Shell: {_hx_name:"Shell",_hx_index:1,__enum__:"entity.GameEntityType",toString:$estr}
};
entity_GameEntityType.__constructs__ = [entity_GameEntityType.Ship,entity_GameEntityType.Shell];
var entity_GameEntityDirection = $hxEnums["entity.GameEntityDirection"] = { __ename__:true,__constructs__:null
	,East: {_hx_name:"East",_hx_index:0,__enum__:"entity.GameEntityDirection",toString:$estr}
	,North: {_hx_name:"North",_hx_index:1,__enum__:"entity.GameEntityDirection",toString:$estr}
	,NorthEast: {_hx_name:"NorthEast",_hx_index:2,__enum__:"entity.GameEntityDirection",toString:$estr}
	,NorthWest: {_hx_name:"NorthWest",_hx_index:3,__enum__:"entity.GameEntityDirection",toString:$estr}
	,South: {_hx_name:"South",_hx_index:4,__enum__:"entity.GameEntityDirection",toString:$estr}
	,SouthEast: {_hx_name:"SouthEast",_hx_index:5,__enum__:"entity.GameEntityDirection",toString:$estr}
	,SouthWest: {_hx_name:"SouthWest",_hx_index:6,__enum__:"entity.GameEntityDirection",toString:$estr}
	,West: {_hx_name:"West",_hx_index:7,__enum__:"entity.GameEntityDirection",toString:$estr}
};
entity_GameEntityDirection.__constructs__ = [entity_GameEntityDirection.East,entity_GameEntityDirection.North,entity_GameEntityDirection.NorthEast,entity_GameEntityDirection.NorthWest,entity_GameEntityDirection.South,entity_GameEntityDirection.SouthEast,entity_GameEntityDirection.SouthWest,entity_GameEntityDirection.West];
var entity_PosOffset = function(r,x,y) {
	this.x = x;
	this.y = y;
	this.r = r;
};
entity_PosOffset.__name__ = true;
entity_PosOffset.prototype = {
	__class__: entity_PosOffset
};
var entity_PosOffsetArray = function(one,two,three,four) {
	this.one = one;
	this.two = two;
	this.three = three;
	this.four = four;
};
entity_PosOffsetArray.__name__ = true;
entity_PosOffsetArray.prototype = {
	__class__: entity_PosOffsetArray
};
var entity_EngineBaseGameEntity = function(entityType,x,y,rotation,id,ownerId) {
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
	this.direction = entity_GameEntityDirection.East;
	this.isCollides = true;
	this.isAlive = true;
	this.entityType = entityType;
	switch(entityType._hx_index) {
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
	if(id == null) {
		this.id = "NEW UUID";
	} else {
		this.id = id;
	}
	if(ownerId != null) {
		this.ownerId = ownerId;
	}
};
entity_EngineBaseGameEntity.__name__ = true;
entity_EngineBaseGameEntity.prototype = {
	update: function(dt) {
		this.customUpdate(dt);
		if(this.canMove) {
			this.move(dt);
		}
	}
	,getGameRect: function() {
		return new entity_EngineGameRect(this.x,this.y,this.shapeWidth,this.shapeHeight,MathUtils.dirToRad(this.direction));
	}
	,collides: function(isCollides) {
		this.isCollides = isCollides;
		this.onCollision();
	}
	,move: function(dt) {
		this.dx = this.currentSpeed * Math.cos(this.rotation) * dt;
		this.dy = this.currentSpeed * Math.sin(this.rotation) * dt;
		this.x += this.dx;
		this.y += this.dy;
	}
	,__class__: entity_EngineBaseGameEntity
};
var entity_EngineGameRect = function(x,y,w,h,r) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = r;
};
entity_EngineGameRect.__name__ = true;
entity_EngineGameRect.prototype = {
	getCenter: function() {
		return { x : this.x + this.w / 2, y : this.y + this.y / 2};
	}
	,getLeft: function() {
		return this.x - this.w / 2;
	}
	,getRight: function() {
		return this.x + this.w / 2;
	}
	,getTop: function() {
		return this.y - this.h / 2;
	}
	,getBottom: function() {
		return this.y + this.h / 2;
	}
	,getTopLeftPoint: function() {
		var rotatedCoords = MathUtils.rotatePointAroundCenter(this.getLeft(),this.getTop(),this.x,this.y,this.r);
		return { x : rotatedCoords.x, y : rotatedCoords.y};
	}
	,getBottomLeftPoint: function() {
		var rotatedCoords = MathUtils.rotatePointAroundCenter(this.getLeft(),this.getBottom(),this.x,this.y,this.r);
		return { x : rotatedCoords.x, y : rotatedCoords.y};
	}
	,getTopRightPoint: function() {
		var rotatedCoords = MathUtils.rotatePointAroundCenter(this.getRight(),this.getTop(),this.x,this.y,this.r);
		return { x : rotatedCoords.x, y : rotatedCoords.y};
	}
	,getBottomRightPoint: function() {
		var rotatedCoords = MathUtils.rotatePointAroundCenter(this.getRight(),this.getBottom(),this.x,this.y,this.r);
		return { x : rotatedCoords.x, y : rotatedCoords.y};
	}
	,getLines: function() {
		var topLeftPoint = this.getTopLeftPoint();
		var bottomLeftPoint = this.getBottomLeftPoint();
		var topRightPoint = this.getTopRightPoint();
		var bottomRightPoint = this.getBottomRightPoint();
		return { lineA : { x1 : topLeftPoint.x, y1 : topLeftPoint.y, x2 : topRightPoint.x, y2 : topRightPoint.y}, lineB : { x1 : topRightPoint.x, y1 : topRightPoint.y, x2 : bottomRightPoint.x, y2 : bottomRightPoint.y}, lineC : { x1 : bottomRightPoint.x, y1 : bottomRightPoint.y, x2 : bottomLeftPoint.x, y2 : bottomLeftPoint.y}, lineD : { x1 : bottomLeftPoint.x, y1 : bottomLeftPoint.y, x2 : topLeftPoint.x, y2 : topLeftPoint.y}};
	}
	,contains: function(b) {
		var result = true;
		if(this.getLeft() >= b.getRight() || b.getLeft() >= this.getRight()) {
			result = false;
		}
		if(this.getTop() >= b.getBottom() || b.getTop() >= this.getBottom()) {
			result = false;
		}
		return result;
	}
	,intersectsWithLine: function(x1,y1,x2,y2) {
		var rA = this.getLines();
		if(MathUtils.lineToLineIntersection(x1,y1,x2,y2,rA.lineA.x1,rA.lineA.y1,rA.lineA.x2,rA.lineA.y2)) {
			return true;
		} else if(MathUtils.lineToLineIntersection(x1,y1,x2,y2,rA.lineB.x1,rA.lineB.y1,rA.lineB.x2,rA.lineB.y2)) {
			return true;
		} else if(MathUtils.lineToLineIntersection(x1,y1,x2,y2,rA.lineC.x1,rA.lineC.y1,rA.lineC.x2,rA.lineC.y2)) {
			return true;
		} else if(MathUtils.lineToLineIntersection(x1,y1,x2,y2,rA.lineD.x1,rA.lineD.y1,rA.lineD.x2,rA.lineD.y2)) {
			return true;
		}
		return false;
	}
	,intersectsWithRect: function(b) {
		if(this.r == 0 && b.r == 0) {
			return this.contains(b);
		} else {
			var rA = this.getLines();
			var rB = b.getLines();
			if(MathUtils.lineToLineIntersection(rA.lineA.x1,rA.lineA.y1,rA.lineA.x2,rA.lineA.y2,rB.lineA.x1,rB.lineA.y1,rB.lineA.x2,rB.lineA.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineA.x1,rA.lineA.y1,rA.lineA.x2,rA.lineA.y2,rB.lineB.x1,rB.lineB.y1,rB.lineB.x2,rB.lineB.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineA.x1,rA.lineA.y1,rA.lineA.x2,rA.lineA.y2,rB.lineC.x1,rB.lineC.y1,rB.lineC.x2,rB.lineC.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineA.x1,rA.lineA.y1,rA.lineA.x2,rA.lineA.y2,rB.lineD.x1,rB.lineD.y1,rB.lineD.x2,rB.lineD.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineB.x1,rA.lineB.y1,rA.lineB.x2,rA.lineB.y2,rB.lineA.x1,rB.lineA.y1,rB.lineA.x2,rB.lineA.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineB.x1,rA.lineB.y1,rA.lineB.x2,rA.lineB.y2,rB.lineB.x1,rB.lineB.y1,rB.lineB.x2,rB.lineB.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineB.x1,rA.lineB.y1,rA.lineB.x2,rA.lineB.y2,rB.lineC.x1,rB.lineC.y1,rB.lineC.x2,rB.lineC.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineB.x1,rA.lineB.y1,rA.lineB.x2,rA.lineB.y2,rB.lineD.x1,rB.lineD.y1,rB.lineD.x2,rB.lineD.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineC.x1,rA.lineC.y1,rA.lineC.x2,rA.lineC.y2,rB.lineA.x1,rB.lineA.y1,rB.lineA.x2,rB.lineA.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineC.x1,rA.lineC.y1,rA.lineC.x2,rA.lineC.y2,rB.lineB.x1,rB.lineB.y1,rB.lineB.x2,rB.lineB.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineC.x1,rA.lineC.y1,rA.lineC.x2,rA.lineC.y2,rB.lineC.x1,rB.lineC.y1,rB.lineC.x2,rB.lineC.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineC.x1,rA.lineC.y1,rA.lineC.x2,rA.lineC.y2,rB.lineD.x1,rB.lineD.y1,rB.lineD.x2,rB.lineD.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineD.x1,rA.lineD.y1,rA.lineD.x2,rA.lineD.y2,rB.lineA.x1,rB.lineA.y1,rB.lineA.x2,rB.lineA.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineD.x1,rA.lineD.y1,rA.lineD.x2,rA.lineD.y2,rB.lineB.x1,rB.lineB.y1,rB.lineB.x2,rB.lineB.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineD.x1,rA.lineD.y1,rA.lineD.x2,rA.lineD.y2,rB.lineC.x1,rB.lineC.y1,rB.lineC.x2,rB.lineC.y2)) {
				return true;
			} else if(MathUtils.lineToLineIntersection(rA.lineD.x1,rA.lineD.y1,rA.lineD.x2,rA.lineD.y2,rB.lineD.x1,rB.lineD.y1,rB.lineD.x2,rB.lineD.y2)) {
				return true;
			}
			return false;
		}
	}
	,__class__: entity_EngineGameRect
};
var entity_DieEffect = $hxEnums["entity.DieEffect"] = { __ename__:true,__constructs__:null
	,Splash: {_hx_name:"Splash",_hx_index:0,__enum__:"entity.DieEffect",toString:$estr}
	,Explosion: {_hx_name:"Explosion",_hx_index:1,__enum__:"entity.DieEffect",toString:$estr}
};
entity_DieEffect.__constructs__ = [entity_DieEffect.Splash,entity_DieEffect.Explosion];
var entity_EngineShellEntity = function(side,pos,x,y,rotation,ownerId) {
	this.distanceTraveled = 0.0;
	this.maxTravelDistance = 600;
	this.dieEffect = entity_DieEffect.Splash;
	this.baseDamage = 50;
	entity_EngineBaseGameEntity.call(this,entity_GameEntityType.Shell,x,y,rotation,null,ownerId);
	this.side = side;
	this.pos = pos;
	this.currentSpeed = 380;
	this.currentSpeed += Std.random(30);
	var rndDir = Std.random(2);
	var rndAngle = Std.random(7);
	this.rotation += MathUtils.degreeToRads(rndDir == 1 ? rndAngle : -rndAngle);
};
entity_EngineShellEntity.__name__ = true;
entity_EngineShellEntity.__super__ = entity_EngineBaseGameEntity;
entity_EngineShellEntity.prototype = $extend(entity_EngineBaseGameEntity.prototype,{
	customUpdate: function(dt) {
		this.distanceTraveled += Math.abs(this.dx) + Math.abs(this.dy);
		if(this.distanceTraveled >= this.maxTravelDistance) {
			this.isAlive = false;
		}
	}
	,onCollision: function() {
		this.isAlive = false;
		this.dieEffect = entity_DieEffect.Explosion;
	}
	,__class__: entity_EngineShellEntity
});
var entity_EngineShipEntity = function(x,y,id) {
	this.currentArmor = 1000;
	this.currentHull = 1000;
	this.baseArmor = 1000;
	this.baseHull = 1000;
	entity_EngineBaseGameEntity.call(this,entity_GameEntityType.Ship,x,y,0,id);
};
entity_EngineShipEntity.__name__ = true;
entity_EngineShipEntity.__super__ = entity_EngineBaseGameEntity;
entity_EngineShipEntity.prototype = $extend(entity_EngineBaseGameEntity.prototype,{
	accelerate: function() {
		this.currentSpeed += this.speedStep;
		if(this.currentSpeed > this.maxSpeed) {
			this.currentSpeed = this.maxSpeed;
		}
		if(this.speedChangeCallback != null) {
			this.speedChangeCallback(this.currentSpeed);
		}
	}
	,decelerate: function() {
		this.currentSpeed -= this.speedStep;
		if(this.currentSpeed < this.minSpeed) {
			this.currentSpeed = this.minSpeed;
		}
		if(this.speedChangeCallback != null) {
			this.speedChangeCallback(this.currentSpeed);
		}
	}
	,rotateLeft: function() {
		this.rotation -= MathUtils.degreeToRads(45);
		switch(this.direction._hx_index) {
		case 0:
			this.direction = entity_GameEntityDirection.NorthEast;
			break;
		case 1:
			this.direction = entity_GameEntityDirection.NorthWest;
			break;
		case 2:
			this.direction = entity_GameEntityDirection.North;
			break;
		case 3:
			this.direction = entity_GameEntityDirection.West;
			break;
		case 4:
			this.direction = entity_GameEntityDirection.SouthEast;
			break;
		case 5:
			this.direction = entity_GameEntityDirection.East;
			break;
		case 6:
			this.direction = entity_GameEntityDirection.South;
			break;
		case 7:
			this.direction = entity_GameEntityDirection.SouthWest;
			break;
		}
		if(this.directionChangeCallback != null) {
			this.directionChangeCallback(this.direction);
		}
	}
	,rotateRight: function() {
		this.rotation += MathUtils.degreeToRads(45);
		switch(this.direction._hx_index) {
		case 0:
			this.direction = entity_GameEntityDirection.SouthEast;
			break;
		case 1:
			this.direction = entity_GameEntityDirection.NorthEast;
			break;
		case 2:
			this.direction = entity_GameEntityDirection.East;
			break;
		case 3:
			this.direction = entity_GameEntityDirection.North;
			break;
		case 4:
			this.direction = entity_GameEntityDirection.SouthWest;
			break;
		case 5:
			this.direction = entity_GameEntityDirection.South;
			break;
		case 6:
			this.direction = entity_GameEntityDirection.West;
			break;
		case 7:
			this.direction = entity_GameEntityDirection.NorthWest;
			break;
		}
		if(this.directionChangeCallback != null) {
			this.directionChangeCallback(this.direction);
		}
	}
	,inflictDamage: function(damage) {
		if(this.currentArmor > 0) {
			var damageDiff = Math.round(Math.abs(this.currentArmor - damage));
			if(this.currentArmor - damage < 0) {
				this.currentArmor = 0;
				this.currentHull -= damageDiff;
			} else {
				this.currentArmor -= damage;
			}
		} else {
			this.currentHull -= damage;
			if(this.currentHull <= 0) {
				this.isAlive = false;
			}
		}
	}
	,getCanonOffsetBySideAndIndex: function(side,index) {
		var offset = side == entity_Side.Left ? entity_EngineShipEntity.LeftCanonsOffsetByDir.get(this.direction) : entity_EngineShipEntity.RightCanonsOffsetByDir.get(this.direction);
		var offsetX = offset.one.x;
		var offsetY = offset.one.y;
		if(index == 1) {
			offsetX = offset.two.x;
			offsetY = offset.two.y;
		} else if(index == 2) {
			offsetX = offset.three.x;
			offsetY = offset.three.y;
		}
		return { x : this.x + offsetX, y : this.y + offsetY};
	}
	,customUpdate: function(dt) {
	}
	,onCollision: function() {
	}
	,__class__: entity_EngineShipEntity
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
});
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	__class__: haxe_ValueException
});
var haxe_ds_BalancedTree = function() {
};
haxe_ds_BalancedTree.__name__ = true;
haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
haxe_ds_BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	,setLoop: function(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		var c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,balance: function(l,k,v,r) {
		var hl = l == null ? 0 : l._height;
		var hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			var _this = l.left;
			var _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			var _this = r.right;
			var _this1 = r.left;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) {
		h = -1;
	}
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) {
		var tmp;
		var _this = this.left;
		var _this1 = this.right;
		if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
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
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
haxe_ds_EnumValueMap.__name__ = true;
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1._hx_index - k2._hx_index;
		if(d != 0) {
			return d;
		}
		var p1 = Type.enumParameters(k1);
		var p2 = Type.enumParameters(k2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		var _g = 0;
		var _g1 = a1.length;
		while(_g < _g1) {
			var i = _g++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if(((v1) instanceof Array) && ((v2) instanceof Array)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	__class__: haxe_ds_StringMap
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
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
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
GameLoop.TargetFps = 15;
GameEngine.instance = new GameEngine();
entity_EngineShipEntity.ShapeOffsetByDir = (function($this) {
	var $r;
	var _g = new haxe_ds_EnumValueMap();
	_g.set(entity_GameEntityDirection.East,new entity_PosOffset(0,-100,-40));
	_g.set(entity_GameEntityDirection.North,new entity_PosOffset(-90,-50,110));
	_g.set(entity_GameEntityDirection.NorthEast,new entity_PosOffset(-26,-110,19));
	_g.set(entity_GameEntityDirection.NorthWest,new entity_PosOffset(-155,-65,87));
	_g.set(entity_GameEntityDirection.South,new entity_PosOffset(90,26,72));
	_g.set(entity_GameEntityDirection.SouthEast,new entity_PosOffset(26,-80,-6));
	_g.set(entity_GameEntityDirection.SouthWest,new entity_PosOffset(-23,-113,19));
	_g.set(entity_GameEntityDirection.West,new entity_PosOffset(0,-110,-42));
	$r = _g;
	return $r;
}(this));
entity_EngineShipEntity.LeftCanonsOffsetByDir = (function($this) {
	var $r;
	var _g = new haxe_ds_EnumValueMap();
	_g.set(entity_GameEntityDirection.East,new entity_PosOffsetArray(new entity_PosOffset(0,-65,-50),new entity_PosOffset(0,-25,-50),new entity_PosOffset(0,15,-50)));
	_g.set(entity_GameEntityDirection.North,new entity_PosOffsetArray(new entity_PosOffset(0,-72,64),new entity_PosOffset(0,-72,31),new entity_PosOffset(0,-72,-3)));
	_g.set(entity_GameEntityDirection.NorthEast,new entity_PosOffsetArray(new entity_PosOffset(0,-73,4),new entity_PosOffset(0,-46,-10),new entity_PosOffset(0,-19,-21)));
	_g.set(entity_GameEntityDirection.NorthWest,new entity_PosOffsetArray(new entity_PosOffset(0,-82,42),new entity_PosOffset(0,-52,58),new entity_PosOffset(0,-23,69)));
	_g.set(entity_GameEntityDirection.South,new entity_PosOffsetArray(new entity_PosOffset(0,58,-36),new entity_PosOffset(0,58,-2),new entity_PosOffset(0,58,31)));
	_g.set(entity_GameEntityDirection.SouthEast,new entity_PosOffsetArray(new entity_PosOffset(0,-14,-27),new entity_PosOffset(0,10,-10),new entity_PosOffset(0,36,2)));
	_g.set(entity_GameEntityDirection.SouthWest,new entity_PosOffsetArray(new entity_PosOffset(0,27,61),new entity_PosOffset(0,56,48),new entity_PosOffset(0,90,33)));
	_g.set(entity_GameEntityDirection.West,new entity_PosOffsetArray(new entity_PosOffset(0,-27,69),new entity_PosOffset(0,14,69),new entity_PosOffset(0,57,69)));
	$r = _g;
	return $r;
}(this));
entity_EngineShipEntity.RightCanonsOffsetByDir = (function($this) {
	var $r;
	var _g = new haxe_ds_EnumValueMap();
	_g.set(entity_GameEntityDirection.East,new entity_PosOffsetArray(new entity_PosOffset(0,-65,71),new entity_PosOffset(0,-25,71),new entity_PosOffset(0,15,71)));
	_g.set(entity_GameEntityDirection.North,new entity_PosOffsetArray(new entity_PosOffset(0,57,65),new entity_PosOffset(0,57,30),new entity_PosOffset(0,57,-4)));
	_g.set(entity_GameEntityDirection.NorthEast,new entity_PosOffsetArray(new entity_PosOffset(0,10,70),new entity_PosOffset(0,40,57),new entity_PosOffset(0,70,45)));
	_g.set(entity_GameEntityDirection.NorthWest,new entity_PosOffsetArray(new entity_PosOffset(0,61,6),new entity_PosOffset(0,31,-6),new entity_PosOffset(0,10,-21)));
	_g.set(entity_GameEntityDirection.South,new entity_PosOffsetArray(new entity_PosOffset(0,-69,-36),new entity_PosOffset(0,-69,-2),new entity_PosOffset(0,-69,31)));
	_g.set(entity_GameEntityDirection.SouthEast,new entity_PosOffsetArray(new entity_PosOffset(0,-103,31),new entity_PosOffset(0,-73,50),new entity_PosOffset(0,-44,65)));
	_g.set(entity_GameEntityDirection.SouthWest,new entity_PosOffsetArray(new entity_PosOffset(0,-2,-31),new entity_PosOffset(0,-27,-18),new entity_PosOffset(0,-56,-6)));
	_g.set(entity_GameEntityDirection.West,new entity_PosOffsetArray(new entity_PosOffset(0,56,-48),new entity_PosOffset(0,15,-48),new entity_PosOffset(0,-27,-48)));
	$r = _g;
	return $r;
}(this));
GameEngine.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
