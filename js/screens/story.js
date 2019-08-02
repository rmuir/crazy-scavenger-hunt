game.StoryScreen = me.Stage.extend({

  /**
   *  action to perform on state change
   */
  onResetEvent : function() {

    me.audio.stopTrack();
    me.audio.playTrack("story");

    // title screen
    var backgroundImage = new me.Sprite(0, 0, {
      image: me.loader.getImage('story_screen'),
    });

    // position and scale to fit with the viewport size
    backgroundImage.anchorPoint.set(0, 0);
    backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);
    // add to the world container
    me.game.world.addChild(backgroundImage, 1);

    // add a new renderable component with the scrolling text
    me.game.world.addChild(new (me.Renderable.extend ({
      // constructor
      init : function() {
        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        this.anchorPoint.set(0, 0);

        this.story = [
          "Ryanomite the Teetotaler has stolen all of Assbutt's",
          "beer money and hidden it throughout the Evil",
          "Kingdom. Assbutt is down to only five emergency beers!",
          "Help Assbutt retrieve his beer money and show",
          "Ryanomite the teetotaler the error of his ways."
        ];

        this.font = new me.Text(0, 0, {
          "font": "Comic Sans MS",
          "size": 30,
          "fillStyle": "#f2f2f2",
          "textAlign": "center"
        });

        /*this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
          this.font.textAlign = "center"*/
        this.storytop = me.game.viewport.height;

        this.storytween = new me.Tween(this).to({storytop: -me.game.viewport.height/2 - 100}, 15000)
                           .onComplete(this.changeToPlay.bind(this)).start();
      },

      changeToPlay : function() {
        me.state.change(me.state.PLAY)
      },

      update : function (dt) {
        return true;
      },

      draw : function (renderer) {
        let top = this.storytop;
        let center = me.game.viewport.width / 2;
        for (let i = 0; i < this.story.length; ++i) {
          this.font.draw(renderer, this.story[i], center, top);
          top += 75;
        }
      },

      onDestroyEvent : function() {
        //just in case
        this.storytween.stop();
      }
    })), 2);

    // change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        // play something on tap / enter
        // this will unlock audio on mobile devices
        me.audio.play("cling");
        me.state.change(me.state.PLAY);
      }
    });
  },

  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function() {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindPointer(me.input.pointer.LEFT);
    me.event.unsubscribe(this.handler);
  }
});
