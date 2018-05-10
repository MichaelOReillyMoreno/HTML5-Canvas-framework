//=========================================================================
// BOX
//=========================================================================

function Box_exercise_canvas_2 (_atribs, _group_of_words_belong, _txt)
{

//--position and size vars--------------------

this.group_of_words_belong = _group_of_words_belong;

var position = _atribs.pos;
var position_scaled = new Vector_2D(position.x, position.y);

var rotation = _atribs.rotation;

var img = SPRITES.BOX;
var img_back = SPRITES.BACK_BOX;

var width  = SPRITES.BOX.w * _atribs.scale;
var height = SPRITES.BOX.h * _atribs.scale;

var width_scaled = width;
var height_scaled = height;

var vertices_collision = [new Vector_2D(0, 0), new Vector_2D(0, 0), new Vector_2D(0, 0), new Vector_2D(0, 0)];
var vertices_trigger   = [new Vector_2D(0, 0), new Vector_2D(0, 0), new Vector_2D(0, 0), new Vector_2D(0, 0)];

//expand the collider in a direction 
//-x, x, -y, y
var coll_mult = _atribs.coll_mult;
var trig_mult = _atribs.trig_mult;
	
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
var final_position = new Vector_2D(position.x * 1.01, (position.y + height / 2));

var interval_wrong;
var interval_correct;

//--vars to move outside worng words---------------

var velocity_wrong_words = _atribs.dir_force;

//--vars to animation of words---------------

	var animation_interval;
	var animation_duration = 500;
	var life_time = 0;

	var frame_duration = 33;	
	var time_anim      = 0;

	var max_font_size;

	var min_font_size;
	var desire_font_size;
	var prev_font_size;

	var max_font_size_scaled
	var min_font_size_scaled;
	var current_font_size;
		
	var animation_word = false;
	var steps_anim_word;

	var font_size_word_anim;
	var font_size_word_anim_scaled;

	var def_color     = ["0","0","0"];
	var wrong_color   = ["235",  "0",  "0"];
	var correct_color = ["6",  "218", "76"];

	var desire_color;
	var prev_color;
	
	var txt = _txt;
	var txt_lines;
	
	var txt_color =  "rgb(" + def_color[0] + ", " + def_color[1] + ", " + def_color[2] + ")";;
	var txt_font = current_font_size + "px " + font;
	
	this.Start = function ()
	{
		max_font_size = width * 0.12;
		
		if(txt.indexOf(" ") == -1 || txt.length < 9)
		{
			if(txt.length < 3) max_font_size *= 1.5;
			
			txt_lines = [{line: txt, position : new Vector_2D(position.x, position.y), position_scaled : new Vector_2D(0, 0)}];
		}
		else
		{
			var part_1 = txt.slice(0, txt.indexOf(" "));
			var part_2 = txt.slice(txt.indexOf(" "), txt.length);
			
			txt_lines = [{line: part_1, position : new Vector_2D(position.x, position.y), position_scaled : new Vector_2D(0, 0)}, 
						 {line: part_2, position : new Vector_2D(position.x, position.y), position_scaled : new Vector_2D(0, 0)}];
		}
		
		Get_position_texts();

		min_font_size    = max_font_size * 0.9;
		desire_font_size = min_font_size;
		prev_font_size   = max_font_size;

		max_font_size_scaled = max_font_size;
		min_font_size_scaled = min_font_size;
		current_font_size = max_font_size;
			
		font_size_word_anim = max_font_size * 1.1;
		font_size_word_anim_scaled = font_size_word_anim;
	}	
	
	var Get_position_texts = function () 
	{
		ctx.font = max_font_size + "px " + font
				
		for(var i = 0; i < txt_lines.length; i++)
		{
			txt_lines[i].position.x += (width - ctx.measureText(txt_lines[i].line).width) * 0.5;
			
			if(txt_lines.length > 1)
				txt_lines[i].position.y += (height + ctx.measureText("H").width) * 0.5;
			else
			{
				txt_lines[i].position.y += (rotation > 0) ? (height + ctx.measureText("H").width) * 0.4 : (height + ctx.measureText("H").width) * 0.55;
			}


			txt_lines[i].position.y += (ctx.measureText("H").width * 1.2) * i;

			
			txt_lines[i].position_scaled.x = txt_lines[i].position.x;
			txt_lines[i].position_scaled.y = txt_lines[i].position.y;
		}
	}
	
//--RENDER
	this.Render = function () 
	{
		render.Sprite_rotate(ctx, sprites, img, 0, position_scaled.x, position_scaled.y, width_scaled, height_scaled, rotation);

		ctx.font = txt_font;
		ctx.fillStyle = txt_color;
		
		for(var i = 0; i < txt_lines.length; i++)
			ctx.fillText(txt_lines[i].line, txt_lines[i].position_scaled.x, txt_lines[i].position_scaled.y);
		
		ctx.fill();
	}
	
	this.Render_back = function () 
	{
		render.Sprite_rotate(ctx, sprites, img_back, 0, position_scaled.x, position_scaled.y, width_scaled, height_scaled, rotation);
	}

//--RESIZE FUNCTIONS-----------------------------

	this.Resize = function ()
	{			
		position_scaled.Set(position.x * scale, position.y * scale);

		width_scaled  = width * scale;
		height_scaled = height * scale;

		for(var i = 0; i < txt_lines.length; i++)
		{		
			txt_lines[i].position_scaled.Set(txt_lines[i].position.x * scale, txt_lines[i].position.y * scale);
		}

		vertices_collision[0].Set((position_scaled.x                  * coll_mult[0]),(position_scaled.y                  * coll_mult[2]));
		vertices_collision[1].Set((position_scaled.x + width_scaled)  * coll_mult[1], (position_scaled.y + height_scaled) * coll_mult[3]);
		vertices_collision[2].Set((position_scaled.x + width_scaled)  * coll_mult[1], (position_scaled.y                  * coll_mult[2]));
		vertices_collision[3].Set(position_scaled.x                   * coll_mult[0], (position_scaled.y + height_scaled) * coll_mult[3]);

		vertices_trigger[0].Set((position_scaled.x                  * trig_mult[0]),(position_scaled.y                  * trig_mult[2]));
		vertices_trigger[1].Set((position_scaled.x + width_scaled)  * trig_mult[1], (position_scaled.y + height_scaled) * trig_mult[3]);
		vertices_trigger[2].Set((position_scaled.x + width_scaled)  * trig_mult[1], (position_scaled.y                  * trig_mult[2]));
		vertices_trigger[3].Set(position_scaled.x                   * trig_mult[0], (position_scaled.y + height_scaled) * trig_mult[3]);

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
	
	wrong_word_processing.Set_velocity(velocity_wrong_words);

	interval_wrong = setInterval(Check_wrong_word_is_out, 500);
	
	if(!game_is_end)
		Start_animation_word(false);
}

var Check_wrong_word_is_out = function () 
{	
	if(wrong_word_processing.Is_stop())
	{
		var word_vertices = wrong_word_processing.Get_vertices();

		if(math_util.Check_collision_rectangle_vertices(vertices_collision, word_vertices) ||
			math_util.Check_collision_rectangle_vertices(vertices_trigger, word_vertices))
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

		var percent = time / move_duration;

		var next_pos = math_util.Lerp_vector_2D(initial_position, final_position, percent);
		correct_word_processing.Set_position(next_pos);	
		
		if((percent > 0.8 && !game_is_end) || (percent > 0.88))
			correct_word_processing.can_render = false;
	}
	else
	{
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
	word_picked = null;
	word.is_interactible = false;
	word.collision_enabled = false;
	
	if(rae)	
		word.Change_to_rae();	

	word_picked = null;
	
	setTimeout(function() 
	{
		// we place the word in a queue before processing it
		queue_correct_words.push(word);
		num_words_in_queue_correct++;
	}, 500);
}

var Get_wrong_word = function () 
{
	word_picked.is_interactible = false;
	word_picked.collision_enabled = false;

	queue_wrong_words.push(word_picked);
	num_words_in_queue_wrong++;

	word_picked = null;
}

//--CHECK COLLISION OF WORD WITH GOAL-----------------------------

	this.Check_collisions = function (word) 
	{	
		var word_vertices = word.Get_vertices();

		if(math_util.Check_collision_rectangle_vertices(vertices_collision, word_vertices))
		 {	
			 var word_pos = word.Get_position();

			 var correction = new Vector_2D ((position.x < word_pos.x) ? 5 : -5, 0);

			 word.Return_prev_position(correction);
			 word.is_in_collision = true;
		 }
	}

	this.Check_trigger = function () 
	{	
		if(math_util.Check_collision_rectangle_vertices(vertices_trigger, word_picked.Get_vertices()))
		 {
			if(this.group_of_words_belong == word_picked.group)
			{
				this.Get_correct_word(word_picked);
			}
			else
			{
				Get_wrong_word();
			}	

			return true;
		 }
		 return false;
	}

	this.Is_valid_position = function (next_vertices) 
	{	
		for (var i = 0; i < 4; i++) 
		{
			if(math_util.Check_point_inside_rectangle(vertices_collision, next_vertices[i]))
				return true;
		}
			return false;
	}

//--ANIMATION FUNCTIONS-----------------------------

	var Animation = function ()
	{			
		life_time += frame_duration;
		time_anim = life_time / animation_duration;

		if(time_anim < 1)
		{
			current_font_size = math_util.Interpolate(prev_font_size, desire_font_size, time_anim);
			txt_font = current_font_size + "px " + font;

			if(animation_word)
			{
				txt_color = math_util.Lerp_color(prev_color, desire_color, time_anim);
			}
		}
		else
		{ 	
			if(!animation_word)
			{
				current_font_size = desire_font_size;
				life_time = 0;

				prev_font_size = desire_font_size;
				desire_font_size = (desire_font_size == max_font_size_scaled) ? min_font_size_scaled : max_font_size_scaled;
			}
			else
			{
				if(steps_anim_word != 0)
				{					
					txt_color = "rgb(" + def_color[0] + ", " + def_color[1] + ", " + def_color[2] + ")";
					
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
			txt_font = max_font_size_scaled + "px " + font;
			txt_color =  "rgb(" + def_color[0] + ", " + def_color[1] + ", " + def_color[2] + ")";
		}

		life_time = 0;

		prev_font_size = max_font_size_scaled;
		desire_font_size = min_font_size_scaled;
	}
}