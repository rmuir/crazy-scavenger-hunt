game.CreditsScreen = me.Stage.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {

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
					["Engine Design", "Ryan Ernst"],
					["Gameplay", "Ryan Ernst"],
					["Screenplay", "Jack \"Paranoid\" Conradson"],
					["Sound Engineer", "Robert \"Ghostbuster\" Muir"],
					["AI Engineer", "Ryan Ernst"],
				];

				this.titley = 75;
				this.creditstween = new me.Tween(this).to({titley: -300}, 10000)
					.onComplete(this.changeToMenu.bind(this)).start();
			},

			update : function (dt) {
				return true;
			},

			changeToMenu : function() {
				me.game.reset();
				me.state.change(me.state.MENU);
			},

			draw : function (renderer) {
				let centerx = me.game.viewport.width / 2;
				this.creditsfont.draw(renderer, "CREDITS", centerx, this.titley);
				for (let i = 0; i < this.credits.length; ++i) {
					let y = this.titley  + 100 + i * 75;
					let credit = this.credits[i];
					this.titlefont.draw(renderer, credit[0], 50, y);
					this.namefont.draw(renderer, credit[1], 400, y);
				}
			},

			onDestroyEvent: function() {
				this.creditstween.stop();
			}
		})), 2);
	},
	
	

});
