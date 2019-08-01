game.PlayScreen = me.Stage.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		
        // load a level
		me.levelDirector.loadLevel("area05");
		
		// reset the score
		game.reset();
		
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

		this.cheatHandler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "levelchange") {
				let n = -1;
				switch (keyCode) {
					case me.input.KEY.NUM1: n = 1; break;
					case me.input.KEY.NUM2: n = 2; break;
					case me.input.KEY.NUM3: n = 3; break;
					case me.input.KEY.NUM4: n = 4; break;
					case me.input.KEY.NUM5: n = 5; break;
				}
				me.levelDirector.loadLevel("area0" + n);
			}
		});
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
		me.event.unsubscribe(this.cheatHandler);
	}
});
