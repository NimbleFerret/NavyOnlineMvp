// package client.scene;
// import h2d.Scene;
// import h2d.Flow;
// import h2d.domkit.Object;
// @:uiComp("view")
// class ViewComp extends h2d.Flow implements h2d.domkit.Object {
// 	static var SRC =
// 	<view class="mybox" min-width="200" content-halign={align}>
// 		<text text={"Hello World"}/>
// 		for( i in icons )
// 			<bitmap src={i} id="icons[]"/>
// 	</view>;
// 	public function new(align:h2d.Flow.FlowAlign, icons:Array<h2d.Tile>, ?parent) {
// 		super(parent);
// 		initComponent();
// 	}
// }
// @:uiComp("button1")
// class ButtonComp extends h2d.Flow implements h2d.domkit.Object {
// 	static var SRC =
// 	<button1>
// 		<text public id="labelTxt" />
// 	</button1>
// 	public var label(get, set): String;
// 	function get_label() return labelTxt.text;
// 	function set_label(s) {
// 		labelTxt.text = s;
// 		return s;
// 	}
// 	public function new( ?parent ) {
// 		super(parent);
// 		initComponent();
// 		enableInteractive = true;
// 		interactive.onClick = function(_) onClick();
// 		interactive.onOver = function(_) {
// 			dom.hover = true;
// 		};
// 		interactive.onPush = function(_) {
// 			dom.active = true;
// 		};
// 		interactive.onRelease = function(_) {
// 			dom.active = false;
// 		};
// 		interactive.onOut = function(_) {
// 			dom.hover = false;
// 		};
// 	}
// 	public dynamic function onClick() {
// 	}
// }
// @:uiComp("container1")
// class ContainerComp extends h2d.Flow implements h2d.domkit.Object {
// 	static var SRC =
// 	<container1>
// 		<view(align,[]) id="view"/>
// 		<button1 public id="btn"/>
// 		<button1 public id="btn1"/>
// 		<button1 public id="btn2"/>
// 	</container1>;
// 	public function new(align:h2d.Flow.FlowAlign, ?parent) {
// 		super(parent);
// 		initComponent();
// 	}
// }
// class SceneUIDemo extends Scene {
// 	var center : h2d.Flow;
// 	var style = null;
// 	public function new() {
// 		super();
// 	}
// 	public function start() {
// 		center = new h2d.Flow(this);
// 		center.horizontalAlign = center.verticalAlign = Middle;
// 		onResize();
// 		var root = new ContainerComp(Right, center);
// 		root.setScale(3);
// 		// Override
// 		root.btn.label = "Button";
// 		root.btn1.label = "Highlight ON";
// 		root.btn2.labelTxt.text = "Highlight OFF";
// 		root.btn1.onClick = function() {
// 			root.btn.dom.addClass("highlight");
// 		}
// 		root.btn2.onClick = function() {
// 			root.btn.dom.removeClass("highlight");
// 		}
// 		style = new h2d.domkit.Style();
// 		style.load(hxd.Res.style);
// 		style.addObject(root);
// 	}
// 	public function update() {
// 		style.sync();
// 	}
// 	public function onResize() {
// 		center.minWidth = center.maxWidth = this.width;
// 		center.minHeight = center.maxHeight = this.height;
// 	}
// }
