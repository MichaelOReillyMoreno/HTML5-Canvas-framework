//=========================================================================
// word
//=========================================================================

function Word_exercise_canvas_1 (_position, _imgs, _game_field, _group, _id)
{
//--general vars-----------
	
	var imgs = _imgs;
	var img = imgs.word;

	var game_field = _game_field;
	
	this.disable = false;
	this.is_interactible = true;
	this.collision_enabled = true;
	this.can_render = true;

	this.group = _group;
	
	this.id = _id;

//--position vars-----------

	var position = _position;

	var position_scaled = new Vector_2D(position.x * scale, position.y * scale);
	this.prev_position =  new Vector_2D(position.x, position.y);
	
//--movement vars-----------

	var velocity = new Vector_2D(0, 0);
	var deceleration = new Vector_2D(0, 0);
	
//--size and vertex vars-----------

	var width_scaled = 0;
	var height_scaled = 0;

	var vertices = [new Vector_2D(position.x, position.y), new Vector_2D(position.x + img.width, position.y + img.height),
				    new Vector_2D(position.x + img.width, position.y), new Vector_2D(position.x, position.y + img.height)];
				  
//--physics vars-----------

	this.is_in_collision  = false;			 
	var collisions_filed;
	var friction = 0.7;		  			  

//--UPDATE AND RENDER FUNCTIONS-----------------------------

	this.Render = function () 
	{
		if(this.can_render)
			render.Image(ctx, img, width_scaled, height_scaled, position_scaled.x, position_scaled.y);
	}

	this.Update = function (dt) 
	{
		if(!this.disable)
		{
			this.is_in_collision = false;
			
			position.Add(Math.round(velocity.x * dt * 10) / 10, Math.round(velocity.y * dt * 10) / 10);
			position_scaled.Set(position.x * scale, position.y * scale);
			
			Update_vertices();

			if(game_field.Check_collisions(vertices))
			{
				this.Return_prev_position(new Vector_2D(0, 0));
				this.Set_velocity(new Vector_2D((velocity.x / 2), (velocity.y / 2)));
			}
			else
			{
				this.Save_position();
			}

			if(velocity.x != 0 || velocity.y != 0)
			{
				Decel_velocity(dt);
			}

			if(Math.abs(velocity.x) < 15 && Math.abs(velocity.y) < 15)
			{
				Stop();
			}
		}
		else
		{
			position_scaled.Set(position.x * scale, position.y * scale);
		}
	}

	var Update_vertices = function () 
	{
		vertices[0].Set(position_scaled.x, position_scaled.y);
		vertices[1].Set(position_scaled.x + width_scaled, position_scaled.y + height_scaled);
		vertices[2].Set(position_scaled.x + width_scaled, position_scaled.y);
		vertices[3].Set(position_scaled.x, position_scaled.y + height_scaled);
	}

	this.Get_next_vertices = function (pos) 
	{

		var next_pos = new Vector_2D((pos.x / scale) - ((img.width * scale_words_size_multiplier) / 2), 
									(pos.y / scale) - ((img.height * scale_words_size_multiplier) / 2));

			next_pos.Set(next_pos.x * scale, next_pos.y * scale);


		return [new Vector_2D(next_pos.x, next_pos.y),
			   new Vector_2D(next_pos.x + width_scaled, next_pos.y + height_scaled),
			   new Vector_2D(next_pos.x + width_scaled, next_pos.y),
			   new Vector_2D(next_pos.x, next_pos.y + height_scaled)];		  
	}

//--MOVEMENT FUNCTIONS-----------------------------

	this.Pick = function (input_position)
	{
		if(this.is_interactible && this.Is_stop() && 
		   math_util.Check_point_inside_rectangle(vertices, input_position))
		{
			return true;
		}
	}
	
	this.Set_velocity = function (new_vel)
	{
		velocity.Copy(new_vel);

		deceleration.Set(velocity.x * friction, velocity.y * friction);
	}
	
	var Decel_velocity = function (dt)
	{
		if(Math.abs(velocity.x) > 5)
		{
			velocity.x = math_util.Accelerate(velocity.x, -deceleration.x, dt);
		}

		if(Math.abs(velocity.y) > 5)
		{
			velocity.y = math_util.Accelerate(velocity.y, -deceleration.y, dt);
		}
	}

	this.Increas_decel = function (multiplier)
	{
		deceleration.x = deceleration.x * multiplier;
		deceleration.y = deceleration.y * multiplier;
	}

	this.Is_stop = function ()
	{
		if(velocity.x == 0 && velocity.y == 0) 
			return true; 
		else 
			return false;
	}

	var Stop = function ()
	{
		velocity.Zero();
		deceleration.Zero();
	}
	
//--COLLISION FUNCTIONS-----------------------------

	this.Return_prev_position = function (correction)
	{	
		position.Set(this.prev_position.x + correction.x, this.prev_position.y + correction.y);
		position_scaled.Set(position.x * scale, position.y * scale);
	}
	
	this.Save_position = function ()
	{	
		this.prev_position.Copy(position);
	}
	
//--RESIZE FUNCTIONS-----------------------------

	this.Resize = function ()
	{	
		width_scaled  = img.width  * scale_words_size;
		height_scaled = img.height * scale_words_size;
	}

	this.Add_resize_listener = function ()
	{	
		if (img.complete) 
		{
			this.Resize();
			canvas_util.Add_to_resize_listener(this);
		}
		else
		{
			setTimeout(this.Add_resize_listener.bind(this), 200);
		}
	}
	
//--GETTERS AND SETTERS----------------------------

	this.Get_vertices = function () 
	{
		return vertices;
	}

	this.Get_position = function ()
	{	
		return new Vector_2D(position.x, position.y);
	}
	
	this.Get_position_scaled = function ()
	{	
		return new Vector_2D(position_scaled.x, position_scaled.y);
	}
	
	this.Set_position = function (pos)
	{	
		position.Copy(pos);
		position_scaled.Set(position.x * scale, position.y * scale);
	}
	
	this.Set_centre_word_in_position = function (pos)
	{	
		position.Set((pos.x / scale) - ((img.width * scale_words_size_multiplier) / 2), 
				     (pos.y / scale) - ((img.height * scale_words_size_multiplier) / 2));
					 
		position_scaled.Set(position.x * scale, position.y * scale);

	}
	
	this.Get_width = function ()
	{	
		return img.width * scale_words_size_multiplier;
	}

//--RAE----------------------------

	this.Change_to_rae = function ()
	{	
		img = imgs.rae;
	}
}