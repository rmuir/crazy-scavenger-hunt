

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

	init: function() {
		// call the constructor
		this._super(me.Container, 'init');

		// persistent across level change
		this.isPersistent = true;

		// make sure we use screen coordinates
		this.floating = true;

		// give a name
		this.name = "HUD";

		// add our child score object
		this.addChild(new game.HUD.ScoreItem(-10, 30)); // relative to top right
		this.addChild(new game.HUD.LifeItem(25, 25)); // relative to top left
		this.addChild(new game.HUD.DirectionButtonItem(25, -25)) // relative to bottom left
	}
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend( {
	/**
	 * constructor
	 */
	init: function(x, y) {

		// call the parent constructor
		// (size does not matter here)
		this._super(me.Renderable, 'init', [x, y, 10, 10]);

		// create the font object
		this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

        // font alignment to right, bottom
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

		// local copy of the global score
		this.score = -1;
	},

	/**
	 * update function
	 */
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		if (this.score !== game.data.score) {
			this.score = game.data.score;
			return true;
		}
		return false;
	},

	/**
	 * draw the score
	 */
	draw : function (renderer) {
		this.font.draw (renderer, game.data.score, me.game.viewport.width + this.pos.x, this.pos.y);
	}

});

/**
 * life total
 */
game.HUD.LifeItem = me.Container.extend( {

	init: function(x, y) {
		this._super(me.Container, 'init');
		this.pos.x = x;
		this.pos.y = y;

		this.sprites = [];
		for (let i = 0; i < game.data.life; ++i) {
			let sprite = new me.Sprite(i * 40, 0, {
				image: me.loader.getImage('life')
			});
			this.sprites[i] = sprite;
			this.addChild(sprite);
		}

		// local copy of the global life
		this.life = -1;
	},

	update : function (dt) {
		if (this.life !== game.data.life) {
			this.life = game.data.life;
			console.log("life: " + this.life);
			for (let i = this.sprites.length; i > this.life; --i) {
				this.sprites[i - 1].alpha = 0.0;
			}
			return true;
		}
		return me.Container.prototype.update.apply(this, [dt]);
	}
});

game.HUD.DirectionButtonItem = me.GUI_Object.extend({
	init: function(x, y) {
		settings = {
			image: "life",
			framewidth: 50,
			frameheight: 50,
			isHoldable: true,
		};
		y += me.game.viewport.height;
		this._super(me.GUI_Object, "init", [x, y, settings]);
	},

	onHold: function() {
		console.log("holding");
	}
});
