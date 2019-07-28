game.resources = [
	/**
	 * Graphics.
	 */
	// the main player spritesheet
	{name: "assbutt",     type:"image",	src: "data/img/sprite/assbutt.png"},
	// the spinning coin spritesheet
	{name: "spinning_coin_gold",  type:"image",	src: "data/img/sprite/spinning_coin_gold.png"},
	// our enemy entity
	{name: "possubull",       type:"image",	src: "data/img/sprite/possubull.png"},
    // game font
    { name: "PressStart2P",       type:"image", src: "data/fnt/PressStart2P.png" },
    { name: "PressStart2P",       type:"binary", src: "data/fnt/PressStart2P.fnt"},
	// title screen
	{name: "title_screen",        type:"image",	src: "data/img/gui/title_screen.jpg"},
	// story screen
	{name: "story_screen",        type:"image",	src: "data/img/gui/story_screen2.jpg"},
	// the parallax background
	{name: "area01_bkg0",         type:"image",	src: "data/img/area01_bkg0.png"},
	{name: "area01_bkg1",         type:"image",	src: "data/img/area01_bkg1.png"},
	// our level tileset
	{name: "area01_level_tiles",  type:"image",	src: "data/img/map/area01_level_tiles.png"},

	/*
	 * Maps.
 	 */
	{name: "area01",              type: "tmx",	src: "data/map/area01.tmx"},
	{name: "area02",              type: "tmx",	src: "data/map/area02.tmx"},

	/*
	 * Background music.
	 */
	{name: "geom-dash-blast-processing", type: "audio", src: "data/bgm/"},
	{name: "geom-dash-menu", type: "audio", src: "data/bgm/"},

	/*
	 * Sound effects.
	 */
	{name: "cling", type: "audio", src: "data/sfx/"},
	{name: "stomp", type: "audio", src: "data/sfx/"},
	{name: "jump",  type: "audio", src: "data/sfx/"}
];
