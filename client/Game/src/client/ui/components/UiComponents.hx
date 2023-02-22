package client.ui.components;

import h2d.Flow;
import h2d.domkit.Object;

@:uiComp("button")
class ButtonComp extends h2d.Flow implements h2d.domkit.Object {
	static var SRC = <button class="button">
		<text public id="labelTxt" />
	</button>

	public var label(get, set):String;

	public function getTextComponent()
		return labelTxt;

	function get_label()
		return labelTxt.text;

	function set_label(s) {
		labelTxt.text = s;
		return s;
	}

	public function new(?parent) {
		super(parent);
		initComponent();
		enableInteractive = true;
		interactive.onClick = function(_) onClick();
		interactive.onOver = function(_) {
			dom.hover = true;
		};
		interactive.onPush = function(_) {
			dom.active = true;
		};
		interactive.onRelease = function(_) {
			dom.active = false;
		};
		interactive.onOut = function(_) {
			dom.hover = false;
		};
	}

	public dynamic function onClick() {}
}

@:uiComp("StartGameDialog")
class StartGameDialogComp extends h2d.Flow implements h2d.domkit.Object {
	static var SRC = <StartGameDialog>
		<button public id="btn"/>
		<button public id="btn1"/>
	</StartGameDialog>;

	public function new(?parent) {
		super(parent);

		initComponent();
	}
}

@:uiComp("RetryDialog")
class RetryDialogComp extends h2d.Flow implements h2d.domkit.Object {
	static var SRC = <RetryDialog>
		<text public id="labelTxt"/>
		<button public id="btn"/>
	</RetryDialog>;

	public function getTextComponent()
		return labelTxt;

	public function new(?parent) {
		super(parent);
		initComponent();
	}
}

@:uiComp("ChoiceDialog")
class ChoiceDialogComp extends h2d.Flow implements h2d.domkit.Object {
	static var SRC = <ChoiceDialog>
		<text public id="labelTxt"/>
		<button public id="btn1"/>
		<button public id="btn2"/>
	</ChoiceDialog>;

	public function new(?parent) {
		super(parent);
		initComponent();
	}
}
