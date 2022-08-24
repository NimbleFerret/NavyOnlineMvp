package client.event;

enum EventType {
	SocketServerGameInit;
	SocketServerMessageAddShip;
	SocketServerMessageAddShell;
	SocketServerMessageRemoveShip;
	SocketServerMessageUpdateWorldState;
	SocketServerMessageShipMove;
	SocketServerMessageShipShoot;
}

interface EventListener {
	function notify(eventType:EventType, params:Dynamic):Void;
}

class EventManager {
	private final listeners = new Map<EventType, List<EventListener>>();

	public static final instance:EventManager = new EventManager();

	private function new() {}

	public function subscribe(eventType:EventType, listener:EventListener) {
		if (listeners.exists(eventType)) {
			final users = listeners.get(eventType);
			users.add(listener);
		} else {
			final newList = new List();
			newList.add(listener);
			listeners.set(eventType, newList);
		}
	}

	public function unsubscribe(eventType:EventType, listener:EventListener) {
		final users = listeners.get(eventType);
		users.remove(listener);
	}

	public function notify(eventType:EventType, params:Dynamic) {
		final ls = listeners.get(eventType);
		for (listener in ls) {
			listener.notify(eventType, params);
		}
	}
}
