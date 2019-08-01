game.resources = [
	/**
	 * Graphics.
	 */
	// the main player spritesheet
	{name: "assbutt",     type:"image",	src: "data/img/sprite/assbutt.png"},
	// the spinning coin spritesheet
	{name: "spinning_coin_gold",  type:"image",	src: "data/img/sprite/spinning_coin_gold.png"},
	// liquor
	{name: "liquor",              type:"image",	src: "data/img/sprite/liquor.png"},
	{name: "shotglass",           type:"image",	src: "data/img/sprite/shotglass.png"},
	// life icon
	{name: "life",                type:"image",	src: "data/img/sprite/life.png"},
	// our enemy entity
	{name: "possubull",       type:"image",	src: "data/img/sprite/possubull.png"},
	// mini boss
	{name: "miniboss",       type:"image",	src: "data/img/sprite/misharoo.png"},
	// boss
	{name: "boss",                type:"image", src: "data/img/sprite/ryanomite.png"},
    // game font
    { name: "PressStart2P",       type:"image", src: "data/fnt/PressStart2P.png" },
    { name: "PressStart2P",       type:"binary", src: "data/fnt/PressStart2P.fnt"},
	// title screen
	{name: "title_screen",        type:"image",	src: "data/img/gui/title_screen.jpg"},
	// story screen
	{name: "story_screen",        type:"image",	src: "data/img/gui/story_screen2.jpg"},
	// the parallax background
    {name: "bkg0",         type:"image",	src: "data/img/bkg0.jpg"},
	{name: "bkg1",         type:"image",	src: "data/img/bkg1.jpg"},
	// our level tileset
	{name: "area01_level_tiles",  type:"image",	src: "data/img/map/area01_level_tiles.png"},

	/*
	 * Maps.
 	 */
	{name: "area01",              type: "tmx",	src: "data/map/area01.tmx"},
	{name: "area02",              type: "tmx",	src: "data/map/area02.tmx"},
    {name: "area03",              type: "tmx",	src: "data/map/area03.tmx"},
    {name: "area04",              type: "tmx",	src: "data/map/area04.tmx"},
    {name: "area05",              type: "tmx",	src: "data/map/area05.tmx"},

	/*
	 * Background music.
	 */
	{name: "area01", type: "audio", src: "data/bgm/"},
	{name: "area02", type: "audio", src: "data/bgm/"},
	{name: "area03", type: "audio", src: "data/bgm/"},
	{name: "area04", type: "audio", src: "data/bgm/"},
	{name: "area05", type: "audio", src: "data/bgm/"},
	{name: "title", type: "audio", src: "data/bgm/"},
	{name: "story", type: "audio", src: "data/bgm/"},
	{name: "game_end", type: "audio", src: "data/bgm/"},
	{name: "gameover", type: "audio", src: "data/bgm/"},

	/*
	 * Sound effects.
	 */
	{name: "cling", type: "audio", src: "data/sfx/"},
	{name: "stomp", type: "audio", src: "data/sfx/"},
	{name: "jump",  type: "audio", src: "data/sfx/"}
];
