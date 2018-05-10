//=========================================================================
// word
//=========================================================================

function Word_game_2 (_position, _imgs, _game_field, _group, _id)
{
//--general vars-----------
	
	var imgs = _imgs;
	var img = imgs.word;

	var game_field = _game_field;
	
	this.disable = false;
	this.is_interactible = true;
	this.collision_enabled = true;

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

	var collisions_filed;
	var mass = 0;	
	var friction = 0.7;

	this.is_in_collision  = false;			  			  

//--UPDATE AND RENDER FUNCTIONS-----------------------------

	this.Render = function () 
	{
		render.Image(ctx, img, width_scaled, height_scaled, position_scaled.x, position_scaled.y);
	}

	this.Update = function (dt) 
	{
		if(!this.disable)
		{
			this.is_in_collision = false;
			
			position.Add(Math.round(velocity.x * dt * 10) / 10, Math.round(velocity.y * dt * 10) / 10);
			position_scaled.Set(position.x * scale, position.y * scale);
			
			this.Update_vertices();


			collisions_filed = game_field.Check_collisions(vertices);

			if(collisions_filed)
			{
				this.Return_prev_position(new Vector_2D(0, 0));
				this.Set_velocity(new Vector_2D((velocity.x / 2) * collisions_filed[0], (velocity.y / 2) * collisions_filed[1]));
			}

			if(velocity.x != 0 || velocity.y != 0)
			{
				Decel_velocity(dt);
			}

			if(Math.abs(velocity.x) < 15 && Math.abs(velocity.y) < 15)
			{
				Stop();
			}
				
			if(this.is_interactible)
			{
				game_field.Is_in_goals(this, vertices);
			}
		}
		else
		{
			position_scaled.Set(position.x * scale, position.y * scale);
		}
	}

	this.Update_vertices = function () 
	{
		vertices[0].Set(position_scaled.x, position_scaled.y);
		vertices[1].Set(position_scaled.x + width_scaled, position_scaled.y + height_scaled);
		vertices[2].Set(position_scaled.x + width_scaled, position_scaled.y);
		vertices[3].Set(position_scaled.x, position_scaled.y + height_scaled);
	}

//--MOVEMENT FUNCTIONS-----------------------------

	this.Move = function (input_position, range, force)
	{
		if(this.is_interactible)
		{
			var centre = this.Get_centre();
			var distance = math_util.Get_distance_two_points(input_position, centre);
	
			if(distance < range)
			{
				var explosive_force = math_util.Add_explosion_force(input_position, range, distance, centre, force);
				this.Set_velocity(new Vector_2D(velocity.x + explosive_force.x, velocity.y + explosive_force.y));
			}
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

	this.Check_collision = function (other_word)
	{
		if(this.collision_enabled && other_word.collision_enabled)
		{
			var other_vertices = other_word.Get_vertices();
			var other_vel = other_word.Get_velocity();
			var other_mass = other_word.Get_mass();
			
			if(math_util.Check_collision_rectangle_vertices(vertices, other_vertices))
			   {	
					this.is_in_collision = true;	
					other_word.is_in_collision = true;	
	
					//we calculate the new velocity of this word
					var new_vel = new Vector_2D (((velocity.x * (mass - other_mass)) + (2 * other_mass * other_vel.x)) / (mass + other_mass),
												 ((velocity.y * (mass - other_mass)) + (2 * other_mass * other_vel.y)) / (mass + other_mass));
	
					//we calculate the new velocity of the other word
					var other_new_vel = new Vector_2D (((other_vel.x * (other_mass - mass)) + (2 * mass * velocity.x)) / (mass + other_mass),
													   ((other_vel.y * (other_mass - mass)) + (2 * mass * velocity.y)) / (mass + other_mass));
	
					//we make a correction of one pixel in oposite directions 
					var correction = new Vector_2D ((this.prev_position.x > other_word.prev_position.x) ? 1 : -1,
													(this.prev_position.y > other_word.prev_position.y) ? 1 : -1);
	
					var other_correction = new Vector_2D (-1 * correction.x, -1 * correction.y);
	
					this.Return_prev_position(correction);
					this.Set_velocity(new_vel);
	
					other_word.Return_prev_position(other_correction);
					other_word.Set_velocity(other_new_vel);
				}
		}
	}

	this.Return_prev_position = function (correction)
	{	
		position.Set(this.prev_position.x + correction.x, this.prev_position.y + correction.y);
		position_scaled.Set(position.x * scale, position.y * scale);
	}
	
	this.Save_position = function ()
	{	
		this.prev_position.Copy(position);
	}

	this.Get_centre = function ()
	{	
		return math_util.Get_centre(position_scaled, width_scaled, height_scaled);
	}
	
//--RESIZE FUNCTIONS-----------------------------

	this.Resize = function ()
	{	
		width_scaled  = img.width  * scale_words_size;
		height_scaled = img.height * scale_words_size;

		mass = width_scaled / width;
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

	this.Get_velocity = function ()
	{
		return velocity;
	}
	
	this.Get_vertices = function () 
	{
		return vertices;
	}
	
	this.Get_mass = function () 
	{
		return mass;
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