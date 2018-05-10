//=========================================================================
// Game_2
//=========================================================================
function Game_2() 
{
	this.word_group_1 = document.getElementById('word_group_1');        
	this.word_group_2 = document.getElementById('word_group_2'); 
	
	this.Init_angular_vars = function (_words_from_json, _groups_from_json, _ok_words, _err_words)
	{  
		words_from_json = _words_from_json;
		groups_from_json = _groups_from_json;

		ok_words = _ok_words;
		err_words = _err_words;
	}
	
	//vars loaded when canvas is ready
	this.Init_vars_canvas_that_need_ready = function ()
	{  
		force_input = Math.round(width * 0.5);
		range_input = Math.round(width * 0.2);

		font_size   = init_height / font_size_multiplier;
	}
	
	//initialize the game components
	this.Start = function ()
	{	
		text_rasterizer = new Text_rasterizer();	

		rae = (words_from_json[0].palabra.indexOf("_") != -1) ? true : false;

		imgs_words = text_rasterizer.Rasterize_array_texts(words_from_json, font_size, 'Trebuchet MS', "#3399D0", true,
														   "white", "#D7E9F5", true, 15, "white", true, "#ffda2a", rae );

		goal_1 = new Goal_game_2 (new Vector_2D(0,  height / 4), width / 5.3, height / 2,
										groups_from_json[0].valor, new Vector_2D(force_input, force_input), 
										false, game.word_group_1, groups_from_json[0].descripcion);


		goal_2 = new Goal_game_2 (new Vector_2D(width/1.24, height / 4), width / 5.3, height / 2, 
										groups_from_json[1].valor, new Vector_2D(-force_input, force_input), 
										true, game.word_group_2, groups_from_json[1].descripcion);													   
		   
		game_field = new Game_field_game_2(goal_1, goal_2);
		game_field.Add_resize_listener();								   

		words = [];  
		
		for (var i = 0; i < words_from_json.length; i++) 
		{
			if(game_field.Is_valid_position(i))
			{
				words.push(new Word_game_2(game_field.Get_valid_position(i) , imgs_words[i], game_field, words_from_json[i].opcion, i));
				words[i].Add_resize_listener();
			}
		}

		for (var i = 0; i < 5; i++) 
		{
			puff_animations.push(new Animation(SPRITES.PUFF, 5));
			puff_animations[i].Add_resize_listener();
		}
	
		game.Resize_vars();
		
		game_util.Add_input_listener(game.Input_actions);
	}
	
	this.Update = function (dt) 
	{
		for (var i = 0; i < words.length; i++) 
		{	
			//update it´s position
			words[i].Update(dt);
		}
		for (var i = 0; i < words.length; i++) 
		{	
			//Check collisions with other words
			for (var j = (i + 1); j < words.length; j++) 
			{
				words[i].Check_collision(words[j]);
			}	
			
			if(!words[i].is_in_collision)
			{
				words[i].Save_position();
			}
		}

		for (var i = 0; i < puff_animations.length; i++) 
		{
			puff_animations[i].Update(dt);
		}

		game_field.Update(dt);		
	}
	
	//main loop to render the game world
	this.Render = function() 
	{
		ctx.clearRect(0, 0, width, height);

		game_field.Render();

		for (var i = 0; i < words.length; i++) 
		{
			words[i].Render();
		}

		for (var i = 0; i < puff_animations.length; i++) 
		{
			puff_animations[i].Render();
		}
	}
	
	//process the player's inputs inside the canvas
	this.Input_actions = function (position)
	{
		if(!game_is_end)
		{
			for (var i = 0; i < words.length; i++) 
			{
				words[i].Move(position, range_input, force_input);	
			}

			for (var i = 0; i < puff_animations.length; i++) 
			{
				if(!puff_animations[i].enabled)
				{
					puff_animations[i].Play(position);
					break;
				}
			}
		}
	}
	
	this.Show_answers = function ()
	{  
		game_is_end = true;

		for (var i = 0; i < words.length; i++) 
		{	
			if(!words[i].disable)
			{
				if(words[i].group == goal_1.group_of_words_belong)
				{
					goal_1.Get_correct_word(words[i]);
				}
				else
				{
					goal_2.Get_correct_word(words[i]);
				}
			}
		}
	}
	
	this.Resize_vars = function ()
	{  
		//input vars
		force_input = Math.round(width * 0.5);
		range_input = Math.round(width * 0.2);
		
		//hud vars
		this.word_group_1.style.width  = (width / 5)  + "px";	
		this.word_group_2.style.width  = (width / 5)  + "px";
	}
	
	this.Reset_global_vars = function ()
	{  
		canvas_util  = new Canvas_util();	
		math_util    = new Math_util();
		dom_util     = new Dom_util();
		game_manager = new Game_manager();
		game_util    = new Game_util();
		render       = new Render();	
		
		canvas = dom_util.Get('canvas');
		canvas.height = canvas.offsetHeight;
		canvas.width = canvas.height;
		ctx = canvas.getContext('2d');
		fps = 60;                     
		step = 1 / fps;                  
		height = canvas.width;
		width = canvas.height;
		scale = 1;
		init_height = 0;	
		
		game_is_end = false;
		
		images_name = "sprites";
		route_images = "images/";
		//var route_images = "../../images/Exercises/model25/";
		sprites = null;
		
		scale_words_size_multiplier = 0.5;
		scale_words_size = scale_words_size_multiplier;	
		font_size = 0;
		font_size_multiplier = 18;

		font_color = "146eff";
		font = "Arial";

		imgs_words = [];
		imgs_words_rae = [];
		words = [];

		//input vars
		force_input = null;
		range_input = null;
		input_move = null;

		//game filed of canvas
		game_field = null;

		//rasterizer of text
		text_rasterizer = null;

		//is rae needed
		rae = false;

		//puff animations on click
		puff_animations = [];		

		//Angular JSON words and groups
		words_from_json = [];						   
		groups_from_json = [];	
	
		ok_words = [];
		err_words = [];
	}
}