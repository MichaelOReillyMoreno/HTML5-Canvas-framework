//=========================================================================
// Game_2
//=========================================================================

//HACER LA FUNCION DE RESOLVER
//Que ENVIE AL RESOLVER DE UNA EN UNA
//sacar listas de html se van a multiplicar todo el rato
//comprobar colisiones caja futuras
//que el de 3 cajas sea todo trigger
function exercise_canvas_2() 
{
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

		for (var i = 0; i < boxes_atribs.length; i++) 
		{
			boxes_atribs[i].pos.x *= width;
			boxes_atribs[i].pos.y *= height;
			boxes_atribs[i].dir_force.Multiply_float(force_input);
		}

		for (var i = 0; i < init_positions_words.length; i++) 
		{
			init_positions_words[i].position.x *= width;
			init_positions_words[i].position.y *= height;
			init_positions_words[i].position.is_free = true;
		}
	}
	
	//initialize the game components
	this.Start = function ()
	{	
		text_rasterizer = new Text_rasterizer();	

		rae = (words_from_json[0].palabra.indexOf("_") != -1) ? true : false;

		imgs_words = text_rasterizer.Rasterize_array_texts(words_from_json, font_size, 'Trebuchet MS', "#3399D0", true,
														   "white", "#D7E9F5", true, 15, "white", true, "#ffda2a", rae );									
		   
		game_field = new Game_field_canvas_2(init_positions_words);
		game_field.Add_resize_listener();

		for (var i = 0; i < boxes_atribs.length; i++) 
		{
			boxes.push(new Box_exercise_canvas_2(boxes_atribs[i], groups_from_json[i].valor, groups_from_json[i].descripcion));
			
			boxes[i].Start();						
			boxes[i].Add_resize_listener();
			boxes[i].Start_animation();	
		}
		
		for (var i = 0; i < words_from_json.length; i++) 
		{
			if(game_field.Are_there_free_positions())
			{
				words.push(new Word_exercise_canvas_1(game_field.Get_valid_position() , imgs_words[i], game_field, words_from_json[i].opcion, i));
				words[i].Add_resize_listener();
			}
		}
		
		game_util.Drag_and_drop(game.Input_actions, game.Input_up_actions);
	}
	
	this.Update = function (dt) 
	{	
		if(word_picked && !word_picked.is_in_collision)
		{
			var mouse_point = game_util.input_position;

			var next_vertices = word_picked.Get_next_vertices(mouse_point);
			var word_will_collide = false;

			for (var i = 0; i < boxes.length; i++) 
			{
				word_will_collide = boxes[i].Is_valid_position(next_vertices);

				if(word_will_collide)break;
			}
			if(!word_will_collide)
				word_picked.Set_centre_word_in_position(mouse_point);	
		}
	

		for (var i = 0; i < words.length; i++) 
		{	
			words[i].Update(dt);
		}	

		for (var i = 0; i < boxes.length; i++) 
		{
			for (var j = 0; j < words.length; j++) 
			{	
				boxes[i].Check_collisions(words[j]);
			}	
		}

		if(word_picked)
		{
			var is_in_trigger = false;

			for (var i = 0; i < boxes.length; i++) 
			{
				is_in_trigger = boxes[i].Check_trigger();
				if(is_in_trigger)break;
			}

			if(!is_in_trigger)
			{
				if(!word_picked.is_in_collision)
				{
					word_picked.Save_position();
				}
			}
		}

		for (var i = 0; i < boxes.length; i++) 
		{	
			boxes[i].Update(dt);
		}	
	}
	
	//main loop to render the game world
	this.Render = function() 
	{
		ctx.clearRect(0, 0, width, height);
		
		for (var i = 0; i < boxes.length; i++) 
		{
			boxes[i].Render_back();
		}
		
		for (var i = 0; i < words.length; i++) 
		{
			words[i].Render();
		}
		
		for (var i = 0; i < boxes.length; i++) 
		{
			boxes[i].Render();
		}
	}
	
	//process the player's inputs inside the canvas
	this.Input_actions = function (position)
	{
		if(!game_is_end)
		{
			for (var i = 0; i < words.length; i++) 
			{
				if(words[i].Pick(position))
				{					
					game_util.Array_move(words, i, words.length - 1);	
					word_picked = words[words.length - 1];
					break;	
				}
			}
		}
	}
	
	//process the player's inputs up inside the canvas
	this.Input_up_actions = function (position)
	{
		if(word_picked != null)
		{
			word_picked = null;
		}
	}
	
	this.Show_answers = function ()
	{  
		game_is_end = true;

		for (var i = 0; i < words.length; i++) 
		{	
			if(!words[i].disable)
			{
				for (var j = 0; j < boxes.length; j++) 
				{
					if(words[i].group == boxes[j].group_of_words_belong)
					{
						boxes[j].Get_correct_word(words[i]);
					}
				}
			}
		}
	}
	
	this.Resize_vars = function ()
	{  

	}
	
	this.Reset_global_vars = function ()
	{  
		canvas_util  = new Canvas_util();
		game_manager = new Game_manager();
		game_util    = new Game_util();
		render       = new Render();
		
		//canvas vars
		canvas = dom_util.Get('canvas');
		canvas.height = canvas.offsetHeight;
		canvas.width = canvas.height;

		ctx = canvas.getContext('2d'); // ...and its drawing context
		fps = 60;                      // how many 'Update' frames per second
		step = 1 / fps;                   // how long is each frame (in seconds)
		height = canvas.width;
		width = canvas.height;
		scale = 1;
		init_height = 0;
		
		game_is_end = false;

		//spritesheet
		images_name = "sprites";
		route_images = "images_2/";
		//route_images = "../../images/Exercises/model27/";
		sprites = null;
		
		//General var for all the games end
		
		//font vars
		scale_words_size_multiplier = 0.5;
		scale_words_size = scale_words_size_multiplier;
		
	    font_size = 0;
		font_size_multiplier = 18;

		font_color = "146eff";
		font = "Arial";

		imgs_words = [];
		imgs_words_rae = [];
		words = [];
		boxes = [];
		
		//game filed of canvas
		game_field = null;
		
		word_picked = null;

		//rasterizer of text
		text_rasterizer = null;

		//is rae needed
		rae = false;	

		//configuration boxes
		boxes_atribs;

		//Angular JSON words and groups
		words_from_json = [];						   
		groups_from_json = [];	
	
		ok_words = [];
		err_words = [];
	}
}