/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings)
    {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 16.5);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.immune = false;
        this.immunetimer = -1;

        this.facingLeft = false;
    },

    /**
     * update the entity
     */
    update : function (dt) {

        if (me.input.isKeyPressed('left'))
        {
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
            this.facingLeft = true;
        }
        else if (me.input.isKeyPressed('right'))
        {
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
            this.facingLeft = false;
        }
        else
        {
            this.body.vel.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }
        if (me.input.isKeyPressed('jump'))
        {
            if (!this.body.jumping && !this.body.falling)
            {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
                // play some audio
                me.audio.play("jump");
            }
        }
        if (me.input.isKeyPressed('shoot'))
        {
            if (game.data.liquor > 0) {
                game.data.liquor -= 1;
                let x = this.pos.x;
                if (!this.facingLeft) {
                    x += this.width;
                }
                console.log("creating shot at: " + x + ", " + this.pos.y);
                let shot = me.pool.pull('ShotEntity', x, this.pos.y, {'left': this.facingLeft});
                me.game.world.addChild(shot);
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        if (this.immune) {
            this.immunetimer -= dt;
            if (this.immunetimer < 0) {
                this.immune = false;
            }
        }

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

  /**
     * colision handler
     */
    onCollision : function (response, other) {
        other = response.a === this ? response.b : response.a; // correct other
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed('down') &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y>0) && !this.body.jumping && !this.immune) {
                    console.log("ENEMY: overlap = " + response.overlapV.y + ", jumping = " + other.body.jumping + ", type = " + other.constructor.name + ", collision = " + other.body.collisionType);
                    this.immunetimer = 1000;
                    this.immune = true;
                    // bounce (force jump)
                    this.body.falling = false;
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.body.jumping = true;
                    // play some audio
                    me.audio.play("stomp");
                    other.hit();
                }
                else if (!this.immune) {
                    // let's flicker in case we touched an enemy
                    this.renderable.flicker(2000);
                    this.immunetimer = 2000;
                    this.immune = true;
                    game.loseLife();
                }
                return false;
                //break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }
});


/**
 * Coin Entity
 */
game.CoinEntity = me.CollectableEntity.extend(
{

    init: function (x, y, settings)
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y , settings]);
    },

    /**
     * colision handler
     */
    onCollision : function (response, other) {
        other = response.a === this ? response.b : response.a; // correct other
        if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            // do something when collide
            me.audio.play("cling");
            // give some score
            game.data.score += 250;
            // make sure it cannot be collected "again"
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            // remove it
            me.game.world.removeChild(this);
        }

        return false;
    }
});

game.LiquorEntity = me.CollectableEntity.extend({

    init: function (x, y)
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y , {
            width: 64, height: 64, image: "liquor"}]);
    },

    update : function (dt)
    {
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);
    },

    /**
     * colision handler
     */
    onCollision : function (response, other) {
        other = response.a === this ? response.b : response.a; // correct other
        if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            // TODO: play a sound?
            // me.audio.play("cling");
            // make sure it cannot be collected "again"
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            // remove it
            me.game.world.removeChild(this);
            game.data.liquor = 16;
            console.log("GOT LIQUOR");
            return false;
        }
        return other.body.collisionType === me.collision.types.WORLD_SHAPE;
    }
});

game.ShotEntity = me.Entity.extend({
    init: function (x, y, settings)
    {
        settings.image = "shotglass";

        settings.framewidth = settings.width = 32;
        settings.frameheight = settings.height = 32;
        // call the parent constructor
        me.Entity.prototype.init.apply(this, [x, y, settings]);

        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;

        let xVel = 7;
        if (settings.left) {
            xVel = -xVel;
        }

        this.body.vel.x = xVel;
        this.body.vel.y = -20;
    },

    update : function (dt)
    {
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);
    },

    onCollision : function (response, other) {
        other = response.a === this ? response.b : response.a; // correct other
        console.log("SHOT: collision = " + other.body.collisionType);
        if (other.body.collisionType === me.collision.types.WORLD_SHAPE) {
            // disappear!
            me.game.world.removeChild(this);
        } else if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            console.log("HIT: " + other.constructor.name);
            other.hit();
            me.game.world.removeChild(this);
        }
        return false; // passes through other stuff
    }
});

/**
 * Enemy Entity
 */
game.EnemyEntity = me.Entity.extend(
{
    init: function (x, y, settings)
    {
        // define this here instead of tiled
        settings.image = "possubull";

        // save the area size defined in Tiled
        var width = settings.width;
        //var height = settings.height;

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.endX   = x + width - settings.framewidth;
        this.pos.x  = x + width - settings.framewidth;

        // to remember which side we were walking
        this.walkLeft = false;

        // walking & jumping speed
        this.body.setVelocity(2, 6);

        // no coins for enemies
        this.body.setCollisionMask(this.body.collisionMask & ~me.collision.types.COLLECTABLE_OBJECT);
    },

    hit : function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        this.alive = false;
        this.body.vel.y = -this.body.accel.y * me.timer.tick;
        game.data.score += 500;
    },

    // manage the enemy movement
    update : function (dt)
    {
        if (this.alive)
        {
            if (this.walkLeft && this.pos.x <= this.startX)
            {
                this.walkLeft = false;
            }
            else if (!this.walkLeft && this.pos.x >= this.endX)
            {
                this.walkLeft = true;
            }

            this.renderable.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

        }
        else
        {
            this.body.vel.x = 0;
        }
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        other = response.a === this ? response.b : response.a; // correct other
        if (other.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            console.log("ENEMY: overlap = " + response.overlapV.y + ", jumping = " + other.body.jumping);
            return false;
        }
        // Make all other objects solid
        return true;
    }
});

game.MiniBossEntity = me.Entity.extend(
    {
        init: function (x, y, settings)
        {
            // define this here instead of tiled
            settings.image = "miniboss";

            // save the area size defined in Tiled
            var width = settings.width;
            //var height = settings.height;

            // adjust the size setting information to match the sprite size
            // so that the entity object is created with the right size
            settings.framewidth = settings.width = 128;
            settings.frameheight = settings.height = 128;

            // redefine the default shape (used to define path) with a shape matching the renderable
            settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

            // call the parent constructor
            this._super(me.Entity, 'init', [x, y , settings]);

            // set start/end position based on the initial area size
            x = this.pos.x;
            this.startX = x;
            this.endX   = x + width - settings.framewidth;
            this.pos.x  = x + width - settings.framewidth;

            // to remember which side we were walking
            this.walkLeft = false;

            // walking & jumping speed
            this.body.setVelocity(1, 10);
            this.body.gravity.y = 0.2;

            // no coins for enemies
            this.body.setCollisionMask(this.body.collisionMask & ~me.collision.types.COLLECTABLE_OBJECT);

            // jump every second
            this.jumptimer = 1000;

            this.life = 3;
            this.immune = false;
            this.immunetimer = -1;
        },

        hit : function() {
            if (!this.immune) {
                this.life -= 1;
                this.body.vel.y = -this.body.vel.y;
                this.body.falling = true;
                this.body.jumping = false;

                if (this.life <= 0) {
                    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                    this.body.vel.y = -this.body.accel.y * me.timer.tick;
                    this.alive = false;
                    game.data.score += 2500;
                    console.log("creating liquor at: " +  this.pos.x + ", " + this.pos.y);
                    let liquor = me.pool.pull('LiquorEntity', this.pos.x, this.pos.y);
                    //let liquor = new game.LiquorEntity(, {});
                    liquor.body.vel.y = this.body.vel.y; // fall down to platform if in air
                    me.game.world.addChild(liquor);
                    let levelEntity = me.game.world.getChildByName('levelEntity')[0];
                    levelEntity.nextlevel = "area04";
                    levelEntity.gotolevel = "area04";
                }
                this.immunetimer = 2000;
                this.immune = true;
            }
        },

        // manage the enemy movement
        update : function (dt)
        {
            if (this.alive)
            {

                if (this.walkLeft && this.pos.x <= this.startX)
                {
                    this.walkLeft = false;
                }
                else if (!this.walkLeft && this.pos.x >= this.endX)
                {
                    this.walkLeft = true;
                }

                this.renderable.flipX(this.walkLeft);
                this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

                /*this.jumptimer -= dt;
                if (this.jumptimer <= 0) {*/
                if (!this.body.jumping && !this.body.falling) {
                    // set current vel to the maximum defined value
                    // gravity will then do the rest
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.body.jumping = true;
                }
                this.jumptimer = 1000;
                //}
            }
            else
            {
                this.body.vel.x = 0;
            }
            // check & update movement
            this.body.update(dt);

            if (this.immune) {
                this.immunetimer -= dt;
                if (this.immunetimer < 0) {
                    this.immune = false;
                }
            }

            // handle collisions against other shapes
            me.collision.check(this);

            // return true if we moved or if the renderable was updated
            return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
        },

        /**
         * colision handler
         * (called when colliding with other objects)
         */
        onCollision : function (response, other) {
            other = response.a === this ? response.b : response.a; // correct other
            if (other.body.collisionType !== me.collision.types.WORLD_SHAPE) {
                console.log("BOSS: overlap = " + response.overlapV.y + ", jumping = " + other.body.jumping + ", life = " + this.life);
                return false;
            }
            // Make all other objects solid
            return true;
        }
    });

game.BossEntity = me.Entity.extend(
{
    init: function (x, y, settings)
    {
        // define this here instead of tiled
        settings.image = "boss";

        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 192;
        settings.frameheight = settings.height = 192;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.endX   = x + width - settings.framewidth;
        this.pos.x  = x + width - settings.framewidth;
        y = this.pos.y;
        this.startY = y;
        this.endY   = y + height - settings.frameheight;
        this.pos.y  = this.endY;
        this.body.falling = true;
        this.body.vel.y = 1;

        // to remember which side we were walking
        this.walkLeft = false;

        // walking & jumping speed
        this.body.setVelocity(1, 10);
        this.body.gravity.y = 0.2;

        // no coins for enemies
        this.body.setCollisionMask(this.body.collisionMask & ~me.collision.types.COLLECTABLE_OBJECT);

        this.life = 3;
        this.immune = false;
        this.immunetimer = -1;
    },

    hit : function() {
        if (!this.immune) {
            this.life -= 1;
            this.body.vel.y = -this.body.vel.y;
            this.body.falling = true;
            this.body.jumping = false;

            if (this.life <= 0) {
                this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                this.body.vel.y = -this.body.accel.y * me.timer.tick;
                this.alive = false;
                game.data.score += 5000;
                me.timer.setTimeout(function(timer) {
                    me.state.change(me.state.GAME_END);
                }, 3000);
            }
            this.immunetimer = 1000;
            this.immune = true;
        }
    },

    // manage the enemy movement
    update : function (dt)
    {
        if (this.alive)
        {

            if (this.walkLeft && this.pos.x <= this.startX)
            {
                this.walkLeft = false;
            }
            else if (!this.walkLeft && this.pos.x >= this.endX)
            {
                this.walkLeft = true;
            }

            this.renderable.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
        }
        else
        {
            this.body.vel.x = 0;
        }
        // check & update movement
        this.body.update(dt);

        if (this.immune) {
            this.immunetimer -= dt;
            if (this.immunetimer < 0) {
                this.immune = false;
            }
        }

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        other = response.a === this ? response.b : response.a; // correct other
        if (other.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            console.log("BOSS: overlap = " + response.overlapV.y + ", jumping = " + other.body.jumping + ", life = " + this.life);
            return false;
        }
        // Make all other objects solid
        // and be loud about it, shake the phone, etc
        me.device.vibrate(75);
        return true;
    }
});
