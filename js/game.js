
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0,
        // life total, aka "beers"
        life: 5
	},

    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod : "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    "loseLife": function() {
	    game.data.life -= 1;
	    if (game.data.life <= 0) {
	        me.state.change(me.state.GAMEOVER);
        }
    },

    "reset": function() {
	    game.data.score = 0;
	    game.data.life = 5;
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.READY, new game.StoryScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAMEOVER, new game.GameOverScreen());
        me.state.set(me.state.CREDITS, new game.CreditsScreen());
        me.state.set(me.state.GAME_END, new game.GameEndScreen());

		// add our player entity in the entity pool
		me.pool.register("mainPlayer", game.PlayerEntity);
		me.pool.register("CoinEntity", game.CoinEntity);
		me.pool.register("EnemyEntity", game.EnemyEntity);
        me.pool.register("BossEntity", game.BossEntity);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,		"left");
		me.input.bindKey(me.input.KEY.RIGHT,	"right");
		// map X, Up Arrow and Space for jump1
		me.input.bindKey(me.input.KEY.X,		"jump", true);
		me.input.bindKey(me.input.KEY.UP,		"jump", true);
		me.input.bindKey(me.input.KEY.SPACE,	"jump", true);

		// cheat codes
        me.input.bindKey(me.input.KEY.NUM1,		"levelchange", true, true);
        me.input.bindKey(me.input.KEY.NUM2,		"levelchange", true, true); 
        me.input.bindKey(me.input.KEY.NUM3,		"levelchange", true, true);
        me.input.bindKey(me.input.KEY.NUM4,		"levelchange", true, true);
        me.input.bindKey(me.input.KEY.NUM5,		"levelchange", true, true);
        me.input.bindKey(me.input.KEY.M,		"goto", true, true);
        me.input.bindKey(me.input.KEY.B,		"goto", true, true);
        me.input.bindKey(me.input.KEY.P,		"goto", true, true);
        me.input.bindKey(me.input.KEY.G,		"goto", true, true);
        me.input.bindKey(me.input.KEY.C,		"goto", true, true);
        me.input.bindKey(me.input.KEY.W,		"goto", true, true);

        me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "goto") {
                let state;
                switch (keyCode) {
                    case me.input.KEY.M: state = me.state.MENU; break;
                    case me.input.KEY.B: state = me.state.READY; break;
                    case me.input.KEY.P: state = me.state.PLAY; break;
                    case me.input.KEY.G: state = me.state.GAMEOVER; break;
                    case me.input.KEY.C: state = me.state.CREDITS; break;
                    case me.input.KEY.W: state = me.state.GAME_END; break;
                }
                me.state.change(state);
            }
        });

        // play per-level audio file
        me.game.onLevelLoaded = function(level) {
          me.audio.stopTrack();
          me.audio.playTrack(level);
        };

        // Start the game.
        me.state.change(me.state.MENU);
      }
};
