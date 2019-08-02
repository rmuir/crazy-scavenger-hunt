game.GameEndScreen = me.Stage.extend({
  /**
   *  action to perform on state change
   */
  onResetEvent : function() {

    // play the audio track
    me.audio.stopTrack();
    me.audio.playTrack("game_end");

    me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);

    me.game.world.addChild(new (me.Renderable.extend({
      init : function() {
        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        this.anchorPoint.set(0, 0);

        this.font = new me.Text(0, 0, {
          "font": "Courier New",
          "size": 100,
          "fillStyle": "#FFFFFF",
          "bold": true,
          "textAlign": "center",
          "textBaseline": "middle"
        });
      },

      update : function (dt) {
        return true;
      },

      draw : function (renderer) {
        let centerx = me.game.viewport.width / 2;
        let centery = me.game.viewport.height / 2;
        this.font.draw(renderer, "YOU", centerx, centery - 75);
        this.font.draw(renderer, "WIN", centerx, centery + 75);
      },

    })), 2);

    // transition to credits after 3 seconds
    this.creditsTimer = me.timer.setTimeout(function(timer) {
      me.state.change(me.state.CREDITS);
    }, 4500);
  },

  onDestroyEvent: function() {
    me.timer.clearTimeout(this.creditsTimer);
  }
});
