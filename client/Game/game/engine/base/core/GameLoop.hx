package game.engine.base.core;

#if js
import js.lib.Date;
#end

interface Loop {
	function stopLoop():Void;
}

@:expose
class GameLoop {
	public final targetFps = 10;

	private final gameLoop:Loop;

	public function new(update:Dynamic) {
		#if js
		gameLoop = new DummyJsLoop(update, targetFps);
		#end

		#if (target.threaded)
		// sys.thread.Thread.create(() -> {
		// 	while (true) {
		// 		trace("other thread");
		// 		Sys.sleep(1 / targetFps);
		// 	}
		// });
		#end
	}

	public function stopLoop() {
		gameLoop.stopLoop();
	}
}

#if js
class DummyJsLoop implements Loop {
	final targetFPSMillis:Int;

	var tick = 0;
	var previous = Date.now();
	var delta = 0.0;
	var update:Dynamic;
	var active = true;

	public function new(update:Dynamic, targetFps:Int) {
		this.targetFPSMillis = Math.floor(1000 / targetFps); // 1000 ms / frames per second
		this.update = update;
		loop();
	}

	public function stopLoop() {
		active = false;
	}

	private function loop() {
		if (active) {
			haxe.Timer.delay(loop, this.targetFPSMillis);

			final now = Date.now();
			this.delta = (now - this.previous) / 1000;
			this.update(delta, tick);
			this.previous = now;
			tick++;
		}
	}
}
#end
