package engine;

#if js
import js.lib.Date;
#end

class GameLoop {
	public static final TargetFps = 15;

	public function new(update:Dynamic) {
		#if js
		trace("JS !");
		new DummyJsLoop(update);
		#end

		#if (target.threaded)
		trace("NATIVE !");
		// sys.thread.Thread.create(() -> {
		// 	while (true) {
		// 		trace("other thread");
		// 		Sys.sleep(1 / targetFps);
		// 	}
		// });
		#end
	}
}

#if js
class DummyJsLoop {
	final targetFPSMillis = Math.floor(1000 / GameLoop.TargetFps); // 1000 ms / frames per second

	var tick = 0;
	var previous = Date.now();
	var delta = 0.0;
	var update:Dynamic;

	public function new(update:Dynamic) {
		this.update = update;
		loop();
	}

	private function loop() {
		haxe.Timer.delay(loop, targetFPSMillis);

		final now = Date.now();
		this.delta = (now - this.previous) / 1000;
		this.update(delta, tick);
		this.previous = now;
		tick++;
	}
}
#end
