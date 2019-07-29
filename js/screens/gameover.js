game.GameOverScreen = me.Stage.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		
		// play the audio track
		// TODO: find game over music
        //me.audio.stopTrack();
		//me.audio.playTrack("geom-dash-blast-processing");

		me.game.world.addChild(new (me.Container.extend ({
			init : function() {
				this.backgroundColor = "#000000"
			}
		})));
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {

	}
});
