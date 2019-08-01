game.TitleScreen = me.Stage.extend({

    /**
     *  action to perform on state change
     */
    onResetEvent : function() {

        me.audio.stopTrack();
        me.audio.playTrack("title");

        // title screen
        var backgroundImage = new me.Sprite(0, 0, {
               image: me.loader.getImage('title_screen'),
            }
        );

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

                // font for the scrolling text
                //this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
                this.titletext = new me.Text(0, 0, {
                    "font": "Comic Sans MS",
                    "size": 40,
                    "fillStyle": "#ffb366"
                });
                this.titletextsmall = new me.Text(0, 0, {
                    "font": "Comic Sans MS",
                    "size": 30,
                    "fillStyle": "#ffb366"
                });

                this.playtext = new me.Text(0, 0, {
                    "font": "Courier New",
                    "size": 20,
                    "fillStyle": "#4d4d4d"
                });
            },

            update : function (dt) {
                return true;
            },

            draw : function (renderer) {
                let left = 525;
                let top = 100;
                this.titletext.draw(renderer, "ADVENTURES", left, top);
                this.titletextsmall.draw(renderer, "of", left + 120, top + 50);
                this.titletext.draw(renderer, "ASSBUTT", left + 45, top + 100);
                top += 200;
                this.playtext.draw(renderer, "PRESS ENTER", left + 70, top);
                this.playtext.draw(renderer, "TO PLAY", left + 100, top + 25);
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
                me.state.change(me.state.READY);
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
