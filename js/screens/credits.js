game.CreditsScreen = me.Stage.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		
		// play the audio track
		// TODO: find game over music
        //me.audio.stopTrack();
		//me.audio.playTrack("geom-dash-blast-processing");

		me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);

		me.game.world.addChild(new (me.Renderable.extend({
			init : function() {
				this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
				this.anchorPoint.set(0, 0);

				this.creditsfont = new me.Text(0, 0, {
					"font": "Courier New",
					"size": 80,
					"fillStyle": "#FFFFFF",
					"bold": true,
					"textAlign": "center",
					"textBaseline": "middle"
				});
				this.titlefont = new me.Text(0, 0, {
					"font": "Courier New",
					"size": 30,
					"fillStyle": "#FFFFFF",
					"bold": true,
					"italic": true
				});
				this.namefont = new me.Text(0, 0, {
					"font": "Courier New",
					"size": 30,
					"fillStyle": "#FFFFFF",
					"bold": true
				});
				this.credits = [
					["Graphic Design", "Robert \"Ghostbuster\" Muir"],
					["Level Design", "Jack \"Paranoid\" Conradson"],
					["Engine Design", "Ryan Ernst"]
				];
			},

			update : function (dt) {
				return true;
			},

			draw : function (renderer) {
				let centerx = me.game.viewport.width / 2;
				let titley = 75;
				this.creditsfont.draw(renderer, "CREDITS", centerx, titley);
				for (let i = 0; i < this.credits.length; ++i) {
					let y = titley  + 75 + i * 100;
					let credit = this.credits[i];
					this.titlefont.draw(renderer, credit[0], 50, y);
					this.namefont.draw(renderer, credit[1], 400, y);
				}
			}
		})), 2);

		// transition to credits after 3 seconds
		me.timer.setTimeout(function(timer) {
			me.game.reset();
			me.audio.play("cling");
			me.state.change(me.state.MENU);
		}, 3000);
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {

	}
});
