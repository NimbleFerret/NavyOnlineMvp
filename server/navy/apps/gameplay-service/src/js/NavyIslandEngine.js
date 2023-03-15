(function ($hx_exports, $global) {
    "use strict";
    $hx_exports["game"] = $hx_exports["game"] || {};
    $hx_exports["game"]["engine"] = $hx_exports["game"]["engine"] || {};
    $hx_exports["game"]["engine"]["base"] = $hx_exports["game"]["engine"]["base"] || {};
    $hx_exports["game"]["engine"]["base"]["core"] = $hx_exports["game"]["engine"]["base"]["core"] || {};
    ; $hx_exports["game"]["engine"]["navy"] = $hx_exports["game"]["engine"]["navy"] || {};
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
    var game_engine_base_PosOffset = function (x, y, r) {
        if (r == null) {
            r = 0;
        }
        this.x = x;
        this.y = y;
        this.r = r;
    };
    game_engine_base_PosOffset.__name__ = true;
    game_engine_base_PosOffset.prototype = {
        __class__: game_engine_base_PosOffset
    };
    var game_engine_base_PosOffsetArray = function (positions) {
        this.positions = [];
        this.positions = positions;
    };
    game_engine_base_PosOffsetArray.__name__ = true;
    game_engine_base_PosOffsetArray.prototype = {
        __class__: game_engine_base_PosOffsetArray
    };
    var game_engine_base_EntityShape = function (width, height, rectOffsetX, rectOffsetY) {
        if (rectOffsetY == null) {
            rectOffsetY = 0;
        }
        if (rectOffsetX == null) {
            rectOffsetX = 0;
        }
        this.rotation = 0.0;
        this.width = width;
        this.height = height;
        this.rectOffsetX = rectOffsetX;
        this.rectOffsetY = rectOffsetY;
    };
    game_engine_base_EntityShape.__name__ = true;
    game_engine_base_EntityShape.prototype = {
        __class__: game_engine_base_EntityShape
    };
    var game_engine_base_BaseObjectEntity = function (struct) {
        this.x = struct.x;
        this.y = struct.y;
        this.acceleration = struct.acceleration;
        this.minSpeed = struct.minSpeed;
        this.maxSpeed = struct.maxSpeed;
        this.currentSpeed = struct.currentSpeed;
        this.movementDelay = struct.movementDelay;
        this.direction = struct.direction;
        this.rotation = struct.rotation;
        this.id = struct.id;
        this.ownerId = struct.ownerId;
    };
    game_engine_base_BaseObjectEntity.__name__ = true;
    game_engine_base_BaseObjectEntity.prototype = {
        __class__: game_engine_base_BaseObjectEntity
    };
    var game_engine_base_PlayerInputCommand = function (inputType, playerId, index) {
        this.inputType = inputType;
        this.playerId = playerId;
        this.index = index;
    };
    game_engine_base_PlayerInputCommand.__name__ = true;
    game_engine_base_PlayerInputCommand.prototype = {
        __class__: game_engine_base_PlayerInputCommand
    };
    var game_engine_base_InputCommandEngineWrapped = function (playerInputCommand, tick) {
        this.playerInputCommand = playerInputCommand;
        this.tick = tick;
    };
    game_engine_base_InputCommandEngineWrapped.__name__ = true;
    game_engine_base_InputCommandEngineWrapped.prototype = {
        __class__: game_engine_base_InputCommandEngineWrapped
    };
    var game_engine_base_MathUtils = function () { };
    game_engine_base_MathUtils.__name__ = true;
    game_engine_base_MathUtils.getHullRadByDir = function (dir) {
        var degree = 0;
        switch (dir) {
            case 1:
                degree = -270;
                break;
            case 2:
                degree = 0;
                break;
            case 3:
                degree = -335;
                break;
            case 4:
                degree = -65;
                break;
            case 5:
                degree = -180;
                break;
            case 6:
                degree = -245;
                break;
            case 7:
                degree = -115;
                break;
            case 8:
                degree = -90;
                break;
        }
        return game_engine_base_MathUtils.degreeToRads(degree);
    };
    game_engine_base_MathUtils.getGunRadByDir = function (dir) {
        var degree = 0;
        switch (dir) {
            case 1:
                degree = -270;
                break;
            case 2:
                degree = 0;
                break;
            case 3:
                degree = -315;
                break;
            case 4:
                degree = -45;
                break;
            case 5:
                degree = -180;
                break;
            case 6:
                degree = -225;
                break;
            case 7:
                degree = -135;
                break;
            case 8:
                degree = -90;
                break;
        }
        return game_engine_base_MathUtils.degreeToRads(degree);
    };
    game_engine_base_MathUtils.dirToRad = function (dir) {
        if (dir == null) {
            return 0.0;
        }
        var degree = 0;
        switch (dir) {
            case 1:
                degree = 0;
                break;
            case 2:
                degree = -90;
                break;
            case 3:
                degree = -25;
                break;
            case 4:
                degree = -155;
                break;
            case 5:
                degree = 90;
                break;
            case 6:
                degree = 25;
                break;
            case 7:
                degree = 155;
                break;
            case 8:
                degree = 180;
                break;
        }
        return game_engine_base_MathUtils.degreeToRads(degree);
    };
    game_engine_base_MathUtils.angleBetweenPoints = function (point1, point2) {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x);
    };
    game_engine_base_MathUtils.degreeToRads = function (degrees) {
        return Math.PI / 180 * degrees;
    };
    game_engine_base_MathUtils.radsToDegree = function (rads) {
        return rads * (180 / Math.PI);
    };
    game_engine_base_MathUtils.normalizeAngle = function (rads) {
        rads %= 2 * Math.PI;
        if (rads >= 0) {
            return rads;
        } else {
            return rads + 2 * Math.PI;
        }
    };
    game_engine_base_MathUtils.rotatePointAroundCenter = function (x, y, cx, cy, r) {
        var cos = Math.cos(r);
        var sin = Math.sin(r);
        return new game_engine_base_geometry_Point(cos * (x - cx) - sin * (y - cy) + cx, cos * (y - cy) + sin * (x - cx) + cy);
    };
    game_engine_base_MathUtils.lineToLineIntersection = function (lineA, lineB) {
        var numA = (lineB.x2 - lineB.x1) * (lineA.y1 - lineB.y1) - (lineB.y2 - lineB.y1) * (lineA.x1 - lineB.x1);
        var numB = (lineA.x2 - lineA.x1) * (lineA.y1 - lineB.y1) - (lineA.y2 - lineA.y1) * (lineA.x1 - lineB.x1);
        var deNom = (lineB.y2 - lineB.y1) * (lineA.x2 - lineA.x1) - (lineB.x2 - lineB.x1) * (lineA.y2 - lineA.y1);
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
    game_engine_base_MathUtils.differ = function (a, b, error) {
        return Math.abs(a - b) > (error == 0 ? 1 : error);
    };
    var game_engine_base_core_EngineMode = $hxEnums["game.engine.base.core.EngineMode"] = {
        __ename__: true, __constructs__: null
        , Client: { _hx_name: "Client", _hx_index: 0, __enum__: "game.engine.base.core.EngineMode", toString: $estr }
        , Server: { _hx_name: "Server", _hx_index: 1, __enum__: "game.engine.base.core.EngineMode", toString: $estr }
    };
    game_engine_base_core_EngineMode.__constructs__ = [game_engine_base_core_EngineMode.Client, game_engine_base_core_EngineMode.Server];
    var game_engine_base_core_EngineGameMode = $hxEnums["game.engine.base.core.EngineGameMode"] = {
        __ename__: true, __constructs__: null
        , Island: { _hx_name: "Island", _hx_index: 0, __enum__: "game.engine.base.core.EngineGameMode", toString: $estr }
        , Sea: { _hx_name: "Sea", _hx_index: 1, __enum__: "game.engine.base.core.EngineGameMode", toString: $estr }
    };
    game_engine_base_core_EngineGameMode.__constructs__ = [game_engine_base_core_EngineGameMode.Island, game_engine_base_core_EngineGameMode.Sea];
    var game_engine_base_core_BaseEngine = $hx_exports["game"]["engine"]["base"]["core"]["BaseEngine"] = function (engineMode, engineGameMode, mainEntityManager) {
        if (engineMode == null) {
            engineMode = game_engine_base_core_EngineMode.Server;
        }
        this.coldInputCommands = [];
        this.coldInputCommandsTreshhold = 10;
        this.ticksSinceLastPop = 0;
        this.hotInputCommands = [];
        this.removeMainEntityQueue = [];
        this.addMainEntityQueue = [];
        this.validatedInputCommands = [];
        this.playerEntityMap = new haxe_ds_StringMap();
        var _gthis = this;
        this.engineMode = engineMode;
        this.engineGameMode = engineGameMode;
        this.mainEntityManager = mainEntityManager;
        var loop = function (dt, tick) {
            _gthis.tick = tick;
            if (_gthis.ticksSinceLastPop == _gthis.coldInputCommandsTreshhold) {
                _gthis.ticksSinceLastPop = 0;
                _gthis.coldInputCommands.shift();
            }
            _gthis.ticksSinceLastPop++;
            _gthis.processCreateEntityQueue();
            _gthis.processRemoveEntityQueue();
            _gthis.processInputCommands(_gthis.hotInputCommands);
            _gthis.hotInputCommands = [];
            _gthis.engineLoopUpdate(dt);
            if (_gthis.postLoopCallback != null) {
                _gthis.postLoopCallback();
            }
            _gthis.validatedInputCommands = [];
        };
        this.gameLoop = new game_engine_base_core_GameLoop(loop);
        this.okLoopTime = 1000 / this.gameLoop.targetFps | 0;
    };
    game_engine_base_core_BaseEngine.__name__ = true;
    game_engine_base_core_BaseEngine.prototype = {
        createMainEntity: function (entity, fireCallback) {
            if (fireCallback == null) {
                fireCallback = false;
            }
            this.addMainEntityQueue.push({ entity: entity, fireCallback: fireCallback });
        }
        , removeMainEntity: function (entityId) {
            this.removeMainEntityQueue.push(entityId);
        }
        , getMainEntityById: function (id) {
            return this.mainEntityManager.getEntityById(id);
        }
        , getMainEntityIdByOwnerId: function (id) {
            return this.playerEntityMap.h[id];
        }
        , getMainEntityByOwnerId: function (id) {
            return this.mainEntityManager.getEntityById(this.playerEntityMap.h[id]);
        }
        , getMainEntities: function () {
            return this.mainEntityManager.entities;
        }
        , processCreateEntityQueue: function () {
            var _g = 0;
            var _g1 = this.addMainEntityQueue;
            while (_g < _g1.length) {
                var queueTask = _g1[_g];
                ++_g;
                this.mainEntityManager.add(queueTask.entity);
                var this1 = this.playerEntityMap;
                var key = queueTask.entity.getOwnerId();
                var value = queueTask.entity.getId();
                this1.h[key] = value;
                if (queueTask.fireCallback) {
                    if (this.createMainEntityCallback != null) {
                        this.createMainEntityCallback(queueTask.entity);
                    }
                }
            }
            this.addMainEntityQueue = [];
        }
        , processRemoveEntityQueue: function () {
            var _g = 0;
            var _g1 = this.removeMainEntityQueue;
            while (_g < _g1.length) {
                var entityId = _g1[_g];
                ++_g;
                var entity = this.mainEntityManager.getEntityById(entityId);
                if (entity != null) {
                    if (this.deleteMainEntityCallback != null) {
                        this.deleteMainEntityCallback(entity);
                    }
                    var this1 = this.playerEntityMap;
                    var key = entity.getOwnerId();
                    var _this = this1;
                    if (Object.prototype.hasOwnProperty.call(_this.h, key)) {
                        delete (_this.h[key]);
                    }
                    this.mainEntityManager.remove(entity.getId());
                }
            }
            this.removeMainEntityQueue = [];
        }
        , checkLocalMovementInputAllowance: function (entityId, playerInputType) {
            var entity = this.mainEntityManager.getEntityById(entityId);
            if (entity == null) {
                return false;
            } else if (entity.checkLocalMovementInput()) {
                return entity.canMove(playerInputType);
            } else {
                return false;
            }
        }
        , addInputCommand: function (playerInputCommand) {
            if (playerInputCommand.inputType != null && playerInputCommand.playerId != null) {
                var wrappedCommand = new game_engine_base_InputCommandEngineWrapped(playerInputCommand, this.tick);
                this.hotInputCommands.push(wrappedCommand);
                this.coldInputCommands.push(wrappedCommand);
            }
        }
        , destroy: function () {
            this.gameLoop.stopLoop();
            this.mainEntityManager.destroy();
            this.postLoopCallback = null;
            this.createMainEntityCallback = null;
            this.deleteMainEntityCallback = null;
            this.customDestroy();
        }
        , __class__: game_engine_base_core_BaseEngine
    };
    var game_engine_base_core_Loop = function () { };
    game_engine_base_core_Loop.__name__ = true;
    game_engine_base_core_Loop.__isInterface__ = true;
    game_engine_base_core_Loop.prototype = {
        __class__: game_engine_base_core_Loop
    };
    var game_engine_base_core_GameLoop = $hx_exports["game"]["engine"]["base"]["core"]["GameLoop"] = function (update) {
        this.targetFps = 10;
        this.gameLoop = new game_engine_base_core_DummyJsLoop(update, this.targetFps);
    };
    game_engine_base_core_GameLoop.__name__ = true;
    game_engine_base_core_GameLoop.prototype = {
        stopLoop: function () {
            this.gameLoop.stopLoop();
        }
        , __class__: game_engine_base_core_GameLoop
    };
    var game_engine_base_core_DummyJsLoop = function (update, targetFps) {
        this.active = true;
        this.delta = 0.0;
        this.previous = Date.now();
        this.tick = 0;
        this.targetFPSMillis = Math.floor(1000 / targetFps);
        this.update = update;
        this.loop();
    };
    game_engine_base_core_DummyJsLoop.__name__ = true;
    game_engine_base_core_DummyJsLoop.__interfaces__ = [game_engine_base_core_Loop];
    game_engine_base_core_DummyJsLoop.prototype = {
        stopLoop: function () {
            this.active = false;
        }
        , loop: function () {
            if (this.active) {
                haxe_Timer.delay($bind(this, this.loop), this.targetFPSMillis);
                var now = Date.now();
                this.delta = (now - this.previous) / 1000;
                this.update(this.delta, this.tick);
                this.previous = now;
                this.tick++;
            }
        }
        , __class__: game_engine_base_core_DummyJsLoop
    };
    var game_engine_base_entity_GameEntityCustomUpdate = function () { };
    game_engine_base_entity_GameEntityCustomUpdate.__name__ = true;
    game_engine_base_entity_GameEntityCustomUpdate.__isInterface__ = true;
    game_engine_base_entity_GameEntityCustomUpdate.prototype = {
        __class__: game_engine_base_entity_GameEntityCustomUpdate
    };
    var game_engine_base_entity_GameEntityCustomCollide = function () { };
    game_engine_base_entity_GameEntityCustomCollide.__name__ = true;
    game_engine_base_entity_GameEntityCustomCollide.__isInterface__ = true;
    game_engine_base_entity_GameEntityCustomCollide.prototype = {
        __class__: game_engine_base_entity_GameEntityCustomCollide
    };
    var game_engine_base_entity_EngineBaseGameEntity = function (baseObjectEntity, shape) {
        this.dy = 0.0;
        this.dx = 0.0;
        this.lastLocalMovementInputCheck = 0.0;
        this.lastMovementInputCheck = 0.0;
        this.isMovable = true;
        this.isCollides = true;
        this.isAlive = true;
        this.baseObjectEntity = baseObjectEntity;
        this.shape = shape;
        if (baseObjectEntity.id == null) {
            this.baseObjectEntity.id = uuid_Uuid.short();
        }
        if (baseObjectEntity.ownerId == null) {
            this.baseObjectEntity.ownerId = uuid_Uuid.short();
        }
    };
    game_engine_base_entity_EngineBaseGameEntity.__name__ = true;
    game_engine_base_entity_EngineBaseGameEntity.prototype = {
        update: function (dt) {
            this.lastDeltaTime = dt;
            if (this.customUpdate != null) {
                this.customUpdate.onUpdate();
            }
            this.move();
            if (this.customUpdate != null) {
                this.customUpdate.postUpdate();
            }
            this.updateHash();
        }
        , getBodyRectangle: function () {
            var shapeWidth = this.shape.width;
            var shapeHeight = this.shape.height;
            var rectOffsetX = this.shape.rectOffsetX;
            var rectOffsetY = this.shape.rectOffsetY;
            var x = this.baseObjectEntity.x;
            var y = this.baseObjectEntity.y;
            var direction = this.baseObjectEntity.direction;
            return new game_engine_base_geometry_Rectangle(x + rectOffsetX, y + rectOffsetY, shapeWidth, shapeHeight, game_engine_base_MathUtils.dirToRad(direction) + this.shape.rotation);
        }
        , getVirtualBodyRectangleInFuture: function (ticks) {
            var cachedPositionX = this.baseObjectEntity.x;
            var cachedPositionY = this.baseObjectEntity.y;
            var _g = 0;
            var _g1 = ticks;
            while (_g < _g1) {
                var i = _g++;
                this.move();
            }
            var resultingRect = this.getBodyRectangle();
            this.baseObjectEntity.x = cachedPositionX;
            this.baseObjectEntity.y = cachedPositionY;
            return resultingRect;
        }
        , getForwardLookingLine: function (lineLength) {
            var rect = this.getBodyRectangle();
            var x = rect.getCenter().x;
            var y = rect.getCenter().y;
            return { p1: rect.getCenter(), p2: game_engine_base_MathUtils.rotatePointAroundCenter(x + lineLength, y, x, y, this.baseObjectEntity.rotation) };
        }
        , collides: function (isCollides) {
            this.isCollides = isCollides;
            if (this.customCollide != null) {
                this.customCollide.onCollide();
            }
        }
        , isChanged: function () {
            return this.previousTickHash != this.currentTickHash;
        }
        , updateHash: function () {
            var hash = this.updateHashImpl();
            if (this.previousTickHash == null && this.currentTickHash == null) {
                this.previousTickHash = hash;
                this.currentTickHash = hash;
            } else {
                this.previousTickHash = this.currentTickHash;
                this.currentTickHash = hash;
            }
        }
        , checkMovementInput: function () {
            var now = HxOverrides.now() / 1000;
            if (this.lastMovementInputCheck == 0 || this.lastMovementInputCheck + this.baseObjectEntity.movementDelay < now) {
                this.lastMovementInputCheck = now;
                return true;
            } else {
                return false;
            }
        }
        , checkLocalMovementInput: function () {
            var now = HxOverrides.now() / 1000;
            if (this.lastLocalMovementInputCheck == 0 || this.lastLocalMovementInputCheck + this.baseObjectEntity.movementDelay < now) {
                this.lastLocalMovementInputCheck = now;
                return true;
            } else {
                return false;
            }
        }
        , moveStepInDirection: function (plainDirection) {
            switch (plainDirection) {
                case 1:
                    this.baseObjectEntity.y -= this.baseObjectEntity.acceleration * this.lastDeltaTime;
                    break;
                case 2:
                    this.baseObjectEntity.y += this.baseObjectEntity.acceleration * this.lastDeltaTime;
                    break;
                case 3:
                    this.baseObjectEntity.x -= this.baseObjectEntity.acceleration * this.lastDeltaTime;
                    break;
                case 4:
                    this.baseObjectEntity.x += this.baseObjectEntity.acceleration * this.lastDeltaTime;
                    break;
            }
        }
        , move: function () {
            if (this.baseObjectEntity.currentSpeed != 0) {
                this.dx = this.baseObjectEntity.currentSpeed * Math.cos(this.baseObjectEntity.rotation) * this.lastDeltaTime;
                this.dy = this.baseObjectEntity.currentSpeed * Math.sin(this.baseObjectEntity.rotation) * this.lastDeltaTime;
                this.baseObjectEntity.x += this.dx;
                this.baseObjectEntity.y += this.dy;
            }
        }
        , getX: function () {
            return this.baseObjectEntity.x;
        }
        , getY: function () {
            return this.baseObjectEntity.y;
        }
        , getId: function () {
            return this.baseObjectEntity.id;
        }
        , getOwnerId: function () {
            return this.baseObjectEntity.ownerId;
        }
        , getDirection: function () {
            return this.baseObjectEntity.direction;
        }
        , getMaxSpeed: function () {
            return this.baseObjectEntity.maxSpeed;
        }
        , getMinSpeed: function () {
            return this.baseObjectEntity.minSpeed;
        }
        , getRotation: function () {
            return this.baseObjectEntity.rotation;
        }
        , getCurrentSpeed: function () {
            return this.baseObjectEntity.currentSpeed;
        }
        , setX: function (x) {
            this.baseObjectEntity.x = x;
        }
        , setY: function (y) {
            this.baseObjectEntity.y = y;
        }
        , setRotation: function (r) {
            this.baseObjectEntity.rotation = r;
        }
        , incrementRotation: function (r) {
            this.baseObjectEntity.rotation += r;
        }
        , decrementRotation: function (r) {
            this.baseObjectEntity.rotation -= r;
        }
        , setCurrentSpeed: function (speed) {
            return this.baseObjectEntity.currentSpeed = speed;
        }
        , __class__: game_engine_base_entity_EngineBaseGameEntity
    };
    var game_engine_base_entity_manager_BaseEntityManager = function () {
        this.entities = new Map();
    };
    game_engine_base_entity_manager_BaseEntityManager.__name__ = true;
    game_engine_base_entity_manager_BaseEntityManager.prototype = {
        destroy: function () {
            this.entities.clear();
            this.updateCallback = null;
        }
        , getChangedEntities: function () {
            var result = [];
            this.entities.forEach(function (value, key, map) {
                if (value.isChanged()) {
                    result.push(value);
                }
            });
            return result;
        }
        , add: function (entity) {
            this.entities.set(entity.getId(), entity);
        }
        , remove: function (id) {
            this.entities.delete(id);
        }
        , getEntityById: function (id) {
            return this.entities.get(id);
        }
        , __class__: game_engine_base_entity_manager_BaseEntityManager
    };
    var game_engine_base_geometry_Line = function (x1, y1, x2, y2) {
        if (y2 == null) {
            y2 = 0;
        }
        if (x2 == null) {
            x2 = 0;
        }
        if (y1 == null) {
            y1 = 0;
        }
        if (x1 == null) {
            x1 = 0;
        }
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    };
    game_engine_base_geometry_Line.__name__ = true;
    game_engine_base_geometry_Line.prototype = {
        getMidPoint: function () {
            return new game_engine_base_geometry_Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
        }
        , intersectsWithLine: function (line) {
            return game_engine_base_MathUtils.lineToLineIntersection(this, line);
        }
        , __class__: game_engine_base_geometry_Line
    };
    var game_engine_base_geometry_Point = function (x, y) {
        if (y == null) {
            y = 0;
        }
        if (x == null) {
            x = 0;
        }
        this.x = x;
        this.y = y;
    };
    game_engine_base_geometry_Point.__name__ = true;
    game_engine_base_geometry_Point.prototype = {
        distanceSq: function (p) {
            var dx = this.x - p.x;
            var dy = this.y - p.y;
            return dx * dx + dy * dy;
        }
        , distance: function (p) {
            var dx = this.x - p.x;
            var dy = this.y - p.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        , __class__: game_engine_base_geometry_Point
    };
    var game_engine_base_geometry_Rectangle = function (x, y, w, h, r) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
    };
    game_engine_base_geometry_Rectangle.__name__ = true;
    game_engine_base_geometry_Rectangle.prototype = {
        getCenter: function () {
            return new game_engine_base_geometry_Point(this.x, this.y);
        }
        , getMaxSide: function () {
            if (this.w > this.h) {
                return this.w;
            } else {
                return this.h;
            }
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
            var rotatedCoords = game_engine_base_MathUtils.rotatePointAroundCenter(this.getLeft(), this.getTop(), this.x, this.y, this.r);
            return new game_engine_base_geometry_Point(rotatedCoords.x, rotatedCoords.y);
        }
        , getBottomLeftPoint: function () {
            var rotatedCoords = game_engine_base_MathUtils.rotatePointAroundCenter(this.getLeft(), this.getBottom(), this.x, this.y, this.r);
            return new game_engine_base_geometry_Point(rotatedCoords.x, rotatedCoords.y);
        }
        , getTopRightPoint: function () {
            var rotatedCoords = game_engine_base_MathUtils.rotatePointAroundCenter(this.getRight(), this.getTop(), this.x, this.y, this.r);
            return new game_engine_base_geometry_Point(rotatedCoords.x, rotatedCoords.y);
        }
        , getBottomRightPoint: function () {
            var rotatedCoords = game_engine_base_MathUtils.rotatePointAroundCenter(this.getRight(), this.getBottom(), this.x, this.y, this.r);
            return new game_engine_base_geometry_Point(rotatedCoords.x, rotatedCoords.y);
        }
        , getLines: function () {
            var topLeftPoint = this.getTopLeftPoint();
            var bottomLeftPoint = this.getBottomLeftPoint();
            var topRightPoint = this.getTopRightPoint();
            var bottomRightPoint = this.getBottomRightPoint();
            return { lineA: new game_engine_base_geometry_Line(topLeftPoint.x, topLeftPoint.y, topRightPoint.x, topRightPoint.y), lineB: new game_engine_base_geometry_Line(topRightPoint.x, topRightPoint.y, bottomRightPoint.x, bottomRightPoint.y), lineC: new game_engine_base_geometry_Line(bottomRightPoint.x, bottomRightPoint.y, bottomLeftPoint.x, bottomLeftPoint.y), lineD: new game_engine_base_geometry_Line(bottomLeftPoint.x, bottomLeftPoint.y, topLeftPoint.x, topLeftPoint.y) };
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
        , intersectsWithLine: function (line) {
            var lines = this.getLines();
            if (lines.lineA.intersectsWithLine(line)) {
                return true;
            } else if (lines.lineB.intersectsWithLine(line)) {
                return true;
            } else if (lines.lineC.intersectsWithLine(line)) {
                return true;
            } else if (lines.lineD.intersectsWithLine(line)) {
                return true;
            }
            return false;
        }
        , intersectsWithPoint: function (point) {
            if (this.r == 0) {
                if (Math.abs(this.x - point.x) < this.w / 2) {
                    return Math.abs(this.y - point.y) < this.h / 2;
                } else {
                    return false;
                }
            }
            var tx = Math.cos(this.r) * point.x - Math.sin(this.r) * point.y;
            var ty = Math.cos(this.r) * point.y + Math.sin(this.r) * point.x;
            var cx = Math.cos(this.r) * this.x - Math.sin(this.r) * this.y;
            var cy = Math.cos(this.r) * this.y + Math.sin(this.r) * this.x;
            if (Math.abs(cx - tx) < this.w / 2) {
                return Math.abs(cy - ty) < this.h / 2;
            } else {
                return false;
            }
        }
        , intersectsWithRect: function (b) {
            if (this.r == 0 && b.r == 0) {
                return this.contains(b);
            } else {
                var rA = this.getLines();
                var rB = b.getLines();
                if (rA.lineA.intersectsWithLine(rB.lineA) || rA.lineA.intersectsWithLine(rB.lineB) || rA.lineA.intersectsWithLine(rB.lineC) || rA.lineA.intersectsWithLine(rB.lineD)) {
                    return true;
                }
                if (rA.lineB.intersectsWithLine(rB.lineA) || rA.lineB.intersectsWithLine(rB.lineB) || rA.lineB.intersectsWithLine(rB.lineC) || rA.lineB.intersectsWithLine(rB.lineD)) {
                    return true;
                }
                if (rA.lineC.intersectsWithLine(rB.lineA) || rA.lineC.intersectsWithLine(rB.lineB) || rA.lineC.intersectsWithLine(rB.lineC) || rA.lineC.intersectsWithLine(rB.lineD)) {
                    return true;
                }
                if (rA.lineD.intersectsWithLine(rB.lineA) || rA.lineD.intersectsWithLine(rB.lineB) || rA.lineD.intersectsWithLine(rB.lineC) || rA.lineD.intersectsWithLine(rB.lineD)) {
                    return true;
                }
                return false;
            }
        }
        , __class__: game_engine_base_geometry_Rectangle
    };
    var game_engine_navy_NavyIslandEngine = $hx_exports["game"]["engine"]["navy"]["NavyIslandEngine"] = function (engineMode) {
        if (engineMode == null) {
            engineMode = game_engine_base_core_EngineMode.Server;
        }
        this.lineColliders = [];
        game_engine_base_core_BaseEngine.call(this, engineMode, game_engine_base_core_EngineGameMode.Island, new game_engine_navy_entity_manager_CharacterManager());
        this.addLineCollider(1462, 132, 1293, 115);
        this.addLineCollider(1293, 115, 1274, 62);
        this.addLineCollider(1274, 62, 1207, 52);
        this.addLineCollider(1207, 52, 1206, -8);
        this.addLineCollider(1206, -8, 1070, -14);
        this.addLineCollider(1070, -14, 1065, -78);
        this.addLineCollider(1065, -78, 823, -88);
        this.addLineCollider(823, -88, 718, -9);
        this.addLineCollider(718, -9, 465, -15);
        this.addLineCollider(465, -15, 303, 146);
        this.addLineCollider(303, 146, 289, 202);
        this.addLineCollider(289, 202, 96, 204);
        this.addLineCollider(1463, 134, 1620, -15);
        this.addLineCollider(1620, -15, 1692, -15);
        this.addLineCollider(1692, -15, 1836, -12);
        this.addLineCollider(1836, -12, 2002, 151);
        this.addLineCollider(2002, 151, 2000, 309);
        this.addLineCollider(2000, 309, 1921, 317);
        this.addLineCollider(1921, 317, 1918, 346);
        this.addLineCollider(1918, 346, 1909, 479);
        this.addLineCollider(1909, 479, 1915, 592);
        this.addLineCollider(1915, 592, 1905, 667);
        this.addLineCollider(1905, 667, 1425, 670);
        this.addLineCollider(1425, 670, 1412, 675);
        this.addLineCollider(1412, 675, 1404, 742);
        this.addLineCollider(1404, 742, 1046, 746);
        this.addLineCollider(1046, 746, 1041, 667);
        this.addLineCollider(1041, 667, 835, 668);
        this.addLineCollider(835, 668, 829, 813);
        this.addLineCollider(829, 813, 619, 813);
        this.addLineCollider(619, 813, 613, 739);
        this.addLineCollider(613, 739, 464, 736);
        this.addLineCollider(464, 736, 465, 663);
        this.addLineCollider(465, 663, 180, 660);
        this.addLineCollider(180, 660, 174, 596);
        this.addLineCollider(174, 596, 114, 590);
        this.addLineCollider(114, 590, 112, 537);
        this.addLineCollider(112, 537, 347, 530);
        this.addLineCollider(347, 530, 345, 287);
        this.addLineCollider(345, 287, 109, 281);
        this.addLineCollider(109, 281, 96, 206);
    };
    game_engine_navy_NavyIslandEngine.__name__ = true;
    game_engine_navy_NavyIslandEngine.main = function () {
    };
    game_engine_navy_NavyIslandEngine.__super__ = game_engine_base_core_BaseEngine;
    game_engine_navy_NavyIslandEngine.prototype = $extend(game_engine_base_core_BaseEngine.prototype, {
        processInputCommands: function (inputs) {
            var _g = 0;
            while (_g < inputs.length) {
                var i = inputs[_g];
                ++_g;
                var input = js_Boot.__cast(i.playerInputCommand, game_engine_navy_NavyInputCommand);
                var inputInitiator = input.playerId;
                var entityId = this.playerEntityMap.h[inputInitiator];
                var character = js_Boot.__cast(this.mainEntityManager.getEntityById(entityId), game_engine_navy_entity_NavyCharacterEntity);
                if (character == null || character.getOwnerId() != inputInitiator) {
                    continue;
                }
                switch (input.inputType) {
                    case 1:
                        if (character.moveInDirection(1)) {
                            this.validatedInputCommands.push(input);
                        }
                        break;
                    case 2:
                        if (character.moveInDirection(2)) {
                            this.validatedInputCommands.push(input);
                        }
                        break;
                    case 3:
                        if (character.moveInDirection(3)) {
                            this.validatedInputCommands.push(input);
                        }
                        break;
                    case 4:
                        if (character.moveInDirection(4)) {
                            this.validatedInputCommands.push(input);
                        }
                        break;
                    default:
                }
            }
        }
        , engineLoopUpdate: function (dt) {
            var jsIterator = this.mainEntityManager.entities.values();
            var _g_jsIterator = jsIterator;
            var _g_lastStep = jsIterator.next();
            while (!_g_lastStep.done) {
                var v = _g_lastStep.value;
                _g_lastStep = _g_jsIterator.next();
                var character = v;
                var char = js_Boot.__cast(character, game_engine_navy_entity_NavyCharacterEntity);
                char.resetMovementBlock();
                character.collides(false);
                character.update(dt);
                var _g = 0;
                var _g1 = this.lineColliders;
                while (_g < _g1.length) {
                    var lineCollider = _g1[_g];
                    ++_g;
                    var charRect = character.getBodyRectangle();
                    var _this = lineCollider.getMidPoint();
                    var p = charRect.getCenter();
                    var dx = _this.x - p.x;
                    var dy = _this.y - p.y;
                    if (Math.sqrt(dx * dx + dy * dy) < charRect.getMaxSide() * 3) {
                        if (charRect.intersectsWithLine(lineCollider)) {
                            character.collides(true);
                            char.blockMovement();
                            break;
                        }
                    }
                }
            }
        }
        , customDestroy: function () {
        }
        , buildEngineEntity: function (struct) {
            return new game_engine_navy_entity_NavyCharacterEntity(new game_engine_base_BaseObjectEntity(struct));
        }
        , addLineCollider: function (x1, y1, x2, y2) {
            this.lineColliders.push(new game_engine_base_geometry_Line(x1, y1, x2, y2));
        }
        , applyPlayerInput: function (inputType, playerId, index, shootDetails) {
            this.addInputCommand(new game_engine_navy_NavyInputCommand(inputType, playerId, index, shootDetails));
        }
        , __class__: game_engine_navy_NavyIslandEngine
    });
    var game_engine_navy_ShipObjectEntity = function (struct) {
        game_engine_base_BaseObjectEntity.call(this, struct);
        this.serverShipRef = struct.serverShipRef;
        this.free = struct.free;
        this.role = struct.role;
        this.shipHullSize = struct.shipHullSize;
        this.shipWindows = struct.shipWindows;
        this.shipCannons = struct.shipCannons;
        this.cannonsRange = struct.cannonsRange;
        this.cannonsDamage = struct.cannonsDamage;
        this.cannonsAngleSpread = struct.cannonsAngleSpread;
        this.cannonsShellSpeed = struct.cannonsShellSpeed;
        this.armor = struct.armor;
        this.hull = struct.hull;
        this.movementDelay = struct.movementDelay;
        this.turnDelay = struct.turnDelay;
        this.fireDelay = struct.fireDelay;
    };
    game_engine_navy_ShipObjectEntity.__name__ = true;
    game_engine_navy_ShipObjectEntity.__super__ = game_engine_base_BaseObjectEntity;
    game_engine_navy_ShipObjectEntity.prototype = $extend(game_engine_base_BaseObjectEntity.prototype, {
        __class__: game_engine_navy_ShipObjectEntity
    });
    var game_engine_navy_ShellObjectEntity = function (struct) {
        game_engine_base_BaseObjectEntity.call(this, struct);
        this.rotation = struct.rotation;
        this.side = struct.side;
        this.pos = struct.pos;
        this.damage = struct.damage;
        this.range = struct.range;
    };
    game_engine_navy_ShellObjectEntity.__name__ = true;
    game_engine_navy_ShellObjectEntity.__super__ = game_engine_base_BaseObjectEntity;
    game_engine_navy_ShellObjectEntity.prototype = $extend(game_engine_base_BaseObjectEntity.prototype, {
        __class__: game_engine_navy_ShellObjectEntity
    });
    var game_engine_navy_NavyInputCommand = function (inputType, playerId, index, shootDetails) {
        game_engine_base_PlayerInputCommand.call(this, inputType, playerId, index);
        this.shootDetails = shootDetails;
    };
    game_engine_navy_NavyInputCommand.__name__ = true;
    game_engine_navy_NavyInputCommand.__super__ = game_engine_base_PlayerInputCommand;
    game_engine_navy_NavyInputCommand.prototype = $extend(game_engine_base_PlayerInputCommand.prototype, {
        __class__: game_engine_navy_NavyInputCommand
    });
    var game_engine_navy_entity_CurrentState = $hxEnums["game.engine.navy.entity.CurrentState"] = {
        __ename__: true, __constructs__: null
        , Idle: { _hx_name: "Idle", _hx_index: 0, __enum__: "game.engine.navy.entity.CurrentState", toString: $estr }
        , Moving: { _hx_name: "Moving", _hx_index: 1, __enum__: "game.engine.navy.entity.CurrentState", toString: $estr }
    };
    game_engine_navy_entity_CurrentState.__constructs__ = [game_engine_navy_entity_CurrentState.Idle, game_engine_navy_entity_CurrentState.Moving];
    var game_engine_navy_entity_NavyCharacterEntity = function (baseObjectEntity) {
        game_engine_base_entity_EngineBaseGameEntity.call(this, baseObjectEntity, game_engine_navy_entity_NavyEntitiesConfig.EntityShapeByType.h[5]);
        this.shape.rectOffsetX = 60;
        this.shape.rectOffsetY = 60;
    };
    game_engine_navy_entity_NavyCharacterEntity.__name__ = true;
    game_engine_navy_entity_NavyCharacterEntity.__super__ = game_engine_base_entity_EngineBaseGameEntity;
    game_engine_navy_entity_NavyCharacterEntity.prototype = $extend(game_engine_base_entity_EngineBaseGameEntity.prototype, {
        canMove: function (playerInputType) {
            return this.isMovable;
        }
        , updateHashImpl: function () {
            return 0;
        }
        , moveInDirection: function (plainDirection) {
            var stateChanged = false;
            if (this.checkMovementInput() && this.canMoveIfBlocked(plainDirection)) {
                stateChanged = true;
                this.moveStepInDirection(plainDirection);
                this.lastMovementDirection = plainDirection;
            }
            return stateChanged;
        }
        , blockMovement: function () {
            this.blockedMovementDirection = this.lastMovementDirection;
        }
        , resetMovementBlock: function () {
            this.blockedMovementDirection = null;
        }
        , canMoveIfBlocked: function (newDirection) {
            if (this.blockedMovementDirection != null) {
                if (!(this.blockedMovementDirection == 3 && newDirection == 4 || this.blockedMovementDirection == 4 && newDirection == 3 || this.blockedMovementDirection == 1 && newDirection == 2)) {
                    if (this.blockedMovementDirection == 2) {
                        return newDirection == 1;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
            return true;
        }
        , __class__: game_engine_navy_entity_NavyCharacterEntity
    });
    var game_engine_navy_entity_NavyEntitiesConfig = function () { };
    game_engine_navy_entity_NavyEntitiesConfig.__name__ = true;
    var game_engine_navy_entity_manager_CharacterManager = function () {
        game_engine_base_entity_manager_BaseEntityManager.call(this);
    };
    game_engine_navy_entity_manager_CharacterManager.__name__ = true;
    game_engine_navy_entity_manager_CharacterManager.__super__ = game_engine_base_entity_manager_BaseEntityManager;
    game_engine_navy_entity_manager_CharacterManager.prototype = $extend(game_engine_base_entity_manager_BaseEntityManager.prototype, {
        __class__: game_engine_navy_entity_manager_CharacterManager
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
    var haxe_ds_IntMap = function () {
        this.h = {};
    };
    haxe_ds_IntMap.__name__ = true;
    haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
    haxe_ds_IntMap.prototype = {
        __class__: haxe_ds_IntMap
    };
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
    game_engine_navy_entity_NavyEntitiesConfig.EntityShapeByType = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_EntityShape(200, 80);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_EntityShape(300, 120);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_EntityShape(10, 10);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_EntityShape(60, 60);
            _g.h[5] = value;
        }
        $r = _g;
        return $r;
    }(this));
    game_engine_navy_entity_NavyEntitiesConfig.ShapeOffsetByDir = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_PosOffset(0, -100, -40);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_PosOffset(-90, -50, 110);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_PosOffset(-26, -110, 19);
            _g.h[3] = value;
        }
        {
            var value = new game_engine_base_PosOffset(-155, -65, 87);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_PosOffset(90, 26, 72);
            _g.h[5] = value;
        }
        {
            var value = new game_engine_base_PosOffset(26, -80, -6);
            _g.h[6] = value;
        }
        {
            var value = new game_engine_base_PosOffset(-23, -113, 19);
            _g.h[7] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, -110, -42);
            _g.h[8] = value;
        }
        $r = _g;
        return $r;
    }(this));
    game_engine_navy_entity_NavyEntitiesConfig.RightCannonsOffsetByDirSm = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-28, 26), new game_engine_base_PosOffset(0, 26), new game_engine_base_PosOffset(28, 26)]);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(17, 31), new game_engine_base_PosOffset(36, 21), new game_engine_base_PosOffset(55, 13)]);
            _g.h[3] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(50, 10), new game_engine_base_PosOffset(50, -13), new game_engine_base_PosOffset(50, 33)]);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(50, -16), new game_engine_base_PosOffset(28, -26), new game_engine_base_PosOffset(7, -33)]);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(50, -50), new game_engine_base_PosOffset(21, -50), new game_engine_base_PosOffset(-8, -50)]);
            _g.h[8] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-10, -41), new game_engine_base_PosOffset(-27, -34), new game_engine_base_PosOffset(-41, -27)]);
            _g.h[7] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-50, -31), new game_engine_base_PosOffset(-50, -11), new game_engine_base_PosOffset(-50, 10)]);
            _g.h[5] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-70, 10), new game_engine_base_PosOffset(-50, 19), new game_engine_base_PosOffset(-28, 29)]);
            _g.h[6] = value;
        }
        $r = _g;
        return $r;
    }(this));
    game_engine_navy_entity_NavyEntitiesConfig.LeftCannonsOffsetByDirSm = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-28, -52), new game_engine_base_PosOffset(0, -52), new game_engine_base_PosOffset(28, -52)]);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-55, -16), new game_engine_base_PosOffset(-35, -24), new game_engine_base_PosOffset(-16, -32)]);
            _g.h[3] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-50, 10), new game_engine_base_PosOffset(-50, -13), new game_engine_base_PosOffset(-50, 33)]);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-13, 32), new game_engine_base_PosOffset(-32, 22), new game_engine_base_PosOffset(-52, 11)]);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(50, 27), new game_engine_base_PosOffset(21, 27), new game_engine_base_PosOffset(-8, 27)]);
            _g.h[8] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(70, 5), new game_engine_base_PosOffset(50, 15), new game_engine_base_PosOffset(31, 25)]);
            _g.h[7] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(50, -31), new game_engine_base_PosOffset(50, -11), new game_engine_base_PosOffset(50, 10)]);
            _g.h[5] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(11, -32), new game_engine_base_PosOffset(27, -25), new game_engine_base_PosOffset(46, -15)]);
            _g.h[6] = value;
        }
        $r = _g;
        return $r;
    }(this));
    game_engine_navy_entity_NavyEntitiesConfig.RightCannonsOffsetByDirMid = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-49, 54), new game_engine_base_PosOffset(-19, 54), new game_engine_base_PosOffset(11, 54), new game_engine_base_PosOffset(41, 54)]);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(21, 51), new game_engine_base_PosOffset(47, 38), new game_engine_base_PosOffset(72, 25), new game_engine_base_PosOffset(96, 12)]);
            _g.h[3] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(47, 8), new game_engine_base_PosOffset(47, -13), new game_engine_base_PosOffset(47, -34), new game_engine_base_PosOffset(47, -55)]);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(27, -17), new game_engine_base_PosOffset(5, -28), new game_engine_base_PosOffset(-19, -40), new game_engine_base_PosOffset(-42, -51)]);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(0, -59), new game_engine_base_PosOffset(-24, -59), new game_engine_base_PosOffset(-51, -59), new game_engine_base_PosOffset(-78, -59)]);
            _g.h[8] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-61, -28), new game_engine_base_PosOffset(-82, -17), new game_engine_base_PosOffset(-103, -6), new game_engine_base_PosOffset(-125, 5)]);
            _g.h[7] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-87, -10), new game_engine_base_PosOffset(-87, 10), new game_engine_base_PosOffset(-87, 30), new game_engine_base_PosOffset(-87, 50)]);
            _g.h[5] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-82, 33), new game_engine_base_PosOffset(-60, 44), new game_engine_base_PosOffset(-39, 54), new game_engine_base_PosOffset(-18, 64)]);
            _g.h[6] = value;
        }
        $r = _g;
        return $r;
    }(this));
    game_engine_navy_entity_NavyEntitiesConfig.LeftCannonsOffsetByDirMid = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-43, -59), new game_engine_base_PosOffset(-15, -59), new game_engine_base_PosOffset(13, -59), new game_engine_base_PosOffset(41, -59)]);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-63, -20), new game_engine_base_PosOffset(-43, -30), new game_engine_base_PosOffset(-23, -40), new game_engine_base_PosOffset(-3, -50)]);
            _g.h[3] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-87, 8), new game_engine_base_PosOffset(-87, -13), new game_engine_base_PosOffset(-87, -34), new game_engine_base_PosOffset(-87, -55)]);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(-60, 48), new game_engine_base_PosOffset(-81, 38), new game_engine_base_PosOffset(-102, 28), new game_engine_base_PosOffset(-123, 18)]);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(0, 54), new game_engine_base_PosOffset(-24, 54), new game_engine_base_PosOffset(-51, 54), new game_engine_base_PosOffset(-78, 54)]);
            _g.h[8] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(42, 36), new game_engine_base_PosOffset(24, 44), new game_engine_base_PosOffset(-3, 59), new game_engine_base_PosOffset(-26, 70)]);
            _g.h[7] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(48, -10), new game_engine_base_PosOffset(48, 10), new game_engine_base_PosOffset(48, 30), new game_engine_base_PosOffset(48, 50)]);
            _g.h[5] = value;
        }
        {
            var value = new game_engine_base_PosOffsetArray([new game_engine_base_PosOffset(25, -26), new game_engine_base_PosOffset(47, -16), new game_engine_base_PosOffset(70, -4), new game_engine_base_PosOffset(93, 6)]);
            _g.h[6] = value;
        }
        $r = _g;
        return $r;
    }(this));
    game_engine_navy_entity_NavyEntitiesConfig.RightSideRectOffsetByDir = (function ($this) {
        var $r;
        var _g = new haxe_ds_IntMap();
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[1] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[2] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[3] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[4] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[5] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[6] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[7] = value;
        }
        {
            var value = new game_engine_base_PosOffset(0, 0, 0);
            _g.h[8] = value;
        }
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
    game_engine_navy_NavyIslandEngine.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
