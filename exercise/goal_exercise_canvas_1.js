//=========================================================================
// Goal
//=========================================================================

function Goal_exercise_canvas_1 (_position, _width, _height, _group_of_words_belong, _velocity_wrong_words, _is_right, _div_txt, _txt)
{

//--position and size vars--------------------

	this.group_of_words_belong = _group_of_words_belong;

	var position = _position;
	var position_scaled = new Vector_2D(position.x, position.y);
	


	var width  = _width;
	var height = _height;

	var width_scaled = width;
	var height_scaled = height;

	var vertices = [new Vector_2D(0, 0), new Vector_2D(0, 0), new Vector_2D(0, 0), new Vector_2D(0, 0)];

//--queue vars--------------------

	var queue_correct_words = [];
	var num_words_in_queue_correct = 0;
	var correct_word_processing;
	
	var queue_wrong_words = [];
	var num_words_in_queue_wrong = 0;
	var wrong_word_processing;
	
//--move word to list of correct words vars--------------------

	var is_processing  = false;

	var step_duration = 16;
	var move_duration = 0;

	var time = 0;

	var initial_position;
	var final_position = new Vector_2D(0, 0);
	var n_pos = 0;

	var interval_wrong;
	var interval_correct;

//--positions to place the correct words---------------

	var positions_words = [];		
	var is_right = _is_right;

//--vars to move outside worng words---------------

	var velocity_wrong_words = _velocity_wrong_words;
	var velocity_set_to_word = new Vector_2D(0, 0);

//--vars to animation of words---------------

	var div_txt = _div_txt;
		div_txt.innerHTML = _txt;

	var multiplier = (_txt.length < 5) ? 1.5 : 1;

	var animation_interval;
	var animation_duration = 500;
	var life_time = 0;

	var frame_duration = 16;	
	var time_anim      = 0;

	var max_font_size    = parseInt(window.getComputedStyle(div_txt, null).getPropertyValue("font-size"), 10) * multiplier;

	var min_font_size    = max_font_size * 0.95;
	var desire_font_size = min_font_size;
	var prev_font_size   = max_font_size;

	div_txt.style.fontSize = max_font_size + "px";

	var max_font_size_scaled = max_font_size;
	var min_font_size_scaled = min_font_size;
	var current_font_size;

	var animation_word = false;
	var steps_anim_word;

	var font_size_word_anim = max_font_size * 1.1;
	var font_size_word_anim_scaled = font_size_word_anim;

	var def_color     = ["0","0","0"];
	var wrong_color   = ["235",  "0",  "0"];
	var correct_color = ["6",  "218", "76"];

	var desire_color;
	var prev_color;

//--UPDATE, CHECK IF THERE IS A NEW WORD IN THE QUEUE TO START THE SECOND STEPS-----------------------------	

	this.Update = function (dt) 
	{
		if(!animation_word && !is_processing)
		{
			if(num_words_in_queue_correct > 0)
			{
				Process_correct_word();
			}
			else if(num_words_in_queue_wrong > 0)
			{
				Process_wrong_word();
			}
		}
	}

//--SECOND STEP OF PROCESSING A NEW WORD IF IT'S WORNG-----------------------------	

	var Process_wrong_word = function () 
	{	
		is_processing = true;

		wrong_word_processing = queue_wrong_words.shift();
		num_words_in_queue_wrong--;

		if(!game_is_end)
			err_words.push(wrong_word_processing.id);
		
		velocity_set_to_word.Copy(velocity_wrong_words);
		
		if(wrong_word_processing.Get_position_scaled().y > (height / 2))
		{
			velocity_set_to_word.y = -1 * velocity_set_to_word.y;
		}
			
		wrong_word_processing.Set_velocity(velocity_set_to_word);

		interval_wrong = setInterval(Check_wrong_word_is_out, 500);
		
		if(!game_is_end)
			Start_animation_word(false);
	}
	
	var Check_wrong_word_is_out = function () 
	{	
		if(wrong_word_processing.Is_stop())
		{
			var word_vertices = wrong_word_processing.Get_vertices();

			if(math_util.Check_collision_rectangle_vertices(vertices, word_vertices))
			{
				wrong_word_processing.Set_velocity(velocity_set_to_word);
			}
			else
			{
				clearInterval(interval_wrong);
				
				wrong_word_processing.is_interactible = true;

				wrong_word_processing = null;
				interval_wrong = null;

				is_processing = false;
			}
		}
	}

//--SECOND STEP OF PROCESSING A NEW WORD IF IT'S CORRECT-----------------------------	

	var Process_correct_word = function () 
	{	
			is_processing = true;

			correct_word_processing = queue_correct_words.shift();
			num_words_in_queue_correct--;

			correct_word_processing.disable = true;


			if(!game_is_end)
				ok_words.push(correct_word_processing.id);
			
			initial_position = correct_word_processing.Get_position();
			
			final_position.Copy(positions_words[n_pos]);
			
			if(is_right)
				final_position.x -= correct_word_processing.Get_width();
			
			//in the worst case, if there is no free positions to place the new word
			if(n_pos < (positions_words.length - 1))	
				n_pos++;
			else
				n_pos = 0;
				
			move_duration = (150 * math_util.Get_distance_two_points(initial_position, final_position)) / (width * 0.3);
			time = 0;
			
			interval_correct = setInterval(Move_word_to_position, step_duration);

			if(!game_is_end)
				Start_animation_word(true);
	}
	
	var Move_word_to_position = function () 
	{
		if(time < move_duration)
		{
			time += step_duration;
			
			var next_pos = math_util.Lerp_vector_2D(initial_position, final_position, time / move_duration);
			correct_word_processing.Set_position(next_pos);		
		}
		else
		{
			if(rae)			
			correct_word_processing.Change_to_rae();	

			clearInterval(interval_correct);

			correct_word_processing.Set_position(final_position);	

			correct_word_processing = null;		
			interval_correct = null;	

			is_processing = false;
		}
	}

//--FIRST STEP OF PROCESSING A NEW WORD-----------------------------

	this.Get_correct_word = function (word) 
	{
		word.is_interactible = false;
		word.collision_enabled = false;

		// we place the word in a queue before processing it
		queue_correct_words.push(word);
		num_words_in_queue_correct++;

		word_picked = null;
	}

	var Get_wrong_word = function () 
	{
		word_picked.is_interactible = false;
		word_picked.collision_enabled = false;
		word_picked.Increas_decel(2);

		queue_wrong_words.push(word_picked);
		num_words_in_queue_wrong++;

		word_picked = null;
	}

//--CHECK COLLISION OF WORD WITH GOAL-----------------------------

	this.Is_in_goal = function (other_vertices) 
	{	
		if(vertices[0].x < other_vertices[1].x && vertices[1].x > other_vertices[0].x && 
			vertices[0].y < other_vertices[1].y && vertices[1].y > other_vertices[0].y)
		 {	
			 if(this.group_of_words_belong == word_picked.group)
			 {
				 this.Get_correct_word(word_picked);
			 }
			 else
			 {
				 Get_wrong_word();
			 }
		 }
	}

//--RESIZE FUNCTIONS-----------------------------

	this.Resize = function ()
	{			
		position_scaled.Set(position.x * scale, position.y * scale);

		width_scaled  = width * scale;
		height_scaled = height * scale;

		vertices[0].Set(position_scaled.x, position_scaled.y);
		vertices[1].Set(position_scaled.x + width_scaled, position_scaled.y + height_scaled);
		vertices[2].Set(position_scaled.x + width_scaled, position_scaled.y);
		vertices[3].Set(position_scaled.x, position_scaled.y + height_scaled);

		max_font_size_scaled       = max_font_size       * scale;
		min_font_size_scaled       = min_font_size       * scale;	
		font_size_word_anim_scaled = font_size_word_anim * scale;

		Reset_animation();
	}

	this.Add_resize_listener = function ()
	{	
		this.Resize();
		canvas_util.Add_to_resize_listener(this);
	}

//--ANIMATION FUNCTIONS-----------------------------

	var Animation = function ()
	{			
		current_font_size = parseInt(div_txt.style.fontSize, 10);

		life_time += frame_duration;
		time_anim = life_time / animation_duration;

		if(time_anim < 1)
		{
			div_txt.style.fontSize = math_util.Interpolate(prev_font_size, desire_font_size, time_anim) + "px";

			if(animation_word)
			{
				div_txt.style.color = math_util.Lerp_color(prev_color, desire_color, time_anim);
			}
		}
		else
		{ 	
			if(!animation_word)
			{
				div_txt.style.fontSize = desire_font_size + "px";
				life_time = 0;

				prev_font_size = desire_font_size;
				desire_font_size = (desire_font_size == max_font_size_scaled) ? min_font_size_scaled : max_font_size_scaled;
			}
			else
			{
				if(steps_anim_word != 0)
				{					
					div_txt.style.color = "rgb(" + def_color[0] + ", " + def_color[1] + ", " + def_color[2] + ")";
					
					animation_word = false;
					Reset_animation();
				}
				else
				{
					prev_color = desire_color;
					desire_color = def_color;

					desire_font_size = max_font_size_scaled;
					prev_font_size = font_size_word_anim_scaled;

					life_time = 0;				
					steps_anim_word++;
				}
			}
		}
	}

	this.Start_animation = function ()
	{	
		animation_interval = setInterval(Animation, frame_duration);
	}

	var Start_animation_word = function (is_correct_word)
	{	
		life_time = 0;
		steps_anim_word = 0;	

		desire_font_size = font_size_word_anim_scaled;
		prev_font_size = max_font_size_scaled;

		desire_color = (is_correct_word) ? correct_color : wrong_color;
		prev_color = def_color;

		animation_word = true;
	}

	var Reset_animation = function ()
	{	
		if(animation_word)
		{
			animation_word = false;
			div_txt.style.fontSize = max_font_size_scaled + "px";
			div_txt.style.color = "rgb(" + def_color[0] + ", " + def_color[1] + ", " + def_color[2] + ")";
		}

		div_txt.style.fontSize = max_font_size_scaled + "px";
		life_time = 0;

		prev_font_size = max_font_size_scaled;
		desire_font_size = min_font_size_scaled;
	}
		
	this.Set_positions_words = function (_positions_words)
	{	
		positions_words = _positions_words;
	}
}
