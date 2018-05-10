//=========================================================================
// word
//=========================================================================

function Game_field_game_2 (_goal_1, _goal_2)
{
	
//start postions of the words---------------

	var init_positions_words = [new Vector_2D(width * 0.5 , height * 0.02),//1
							    new Vector_2D(width * 0.27, height * 0.67),//9
							    new Vector_2D(width * 0.48, height * 0.59),//8
							    new Vector_2D(width * 0.46, height * 0.92),//12
							    new Vector_2D(width * 0.25, height * 0.51),//7
							    new Vector_2D(width * 0.27, height * 0.27),//4
							    new Vector_2D(width * 0.21, height * 0.1),//2
							    new Vector_2D(width * 0.5 , height * 0.74),//10
							    new Vector_2D(width * 0.4 , height * 0.17),//3
							    new Vector_2D(width * 0.23, height * 0.82),//11
							    new Vector_2D(width * 0.37, height * 0.425),//6
							    new Vector_2D(width * 0.4, height * 0.34)];//5
								
//postions of the words on the goal 1---------------

	var positions_words_goal_1 = [new Vector_2D(width * 0.025, height * 0.335),
								  new Vector_2D(width * 0.025, height * 0.393),
								  new Vector_2D(width * 0.025, height * 0.451),
								  new Vector_2D(width * 0.025, height * 0.509),
								  new Vector_2D(width * 0.025, height * 0.567),
								  new Vector_2D(width * 0.025, height * 0.625),
								  new Vector_2D(width * 0.025, height * 0.683)];	

	var positions_words_goal_2 = [new Vector_2D(width * 0.975, height * 0.335),
								  new Vector_2D(width * 0.975, height * 0.393),
								  new Vector_2D(width * 0.975, height * 0.451),
								  new Vector_2D(width * 0.975, height * 0.509),
								  new Vector_2D(width * 0.975, height * 0.567),
								  new Vector_2D(width * 0.975, height * 0.625),
								  new Vector_2D(width * 0.975, height * 0.683)];	
								  	
	var img = SPRITES.BACKGROUND;

//limits of the filed-----------------------

	//           0 LEFT      1 RIGHT         2 TOP   3 BOTTOM    4 LEFT_B    5 RIGHT_B   6 TOP_B         7 BOTTOM_B
	var limits = [width / 5, width / 1.25,   0,       height,     0,          width,     height / 4, height / 1.33];
	var limits_scaled = limits.slice();

//goals of the field-----------------------

	var goal_1 = _goal_1;
	goal_1.Set_positions_words(positions_words_goal_1);
	goal_1.Add_resize_listener();
	goal_1.Start_animation();
	
	var goal_2 = _goal_2;						
	goal_2.Set_positions_words(positions_words_goal_2);
	goal_2.Add_resize_listener();
	goal_2.Start_animation();

//--RENDER AND UPDATE FUNCTIONS-----------------------

	this.Render = function () 
	{
		render.Sprite(ctx, sprites, img, 0, 0, 0, width, height);
	}

	this.Update = function (dt) 
	{
		goal_1.Update(dt);
		goal_2.Update(dt);
	}

//--COLLISIONS FUNCTIONS-----------------------------

	this.Check_collisions = function (vertices) 
	{
		if(vertices[0].x < limits_scaled[0])
		{
			if(vertices[2].y > limits_scaled[6] && vertices[3].y < limits_scaled[7])
			{ 
				if(vertices[0].x < limits_scaled[4])
				{
					return [-1, 1];
				}
			}
			else if(vertices[0].x > limits_scaled[0] * 0.955)
			{
				return [-1, 1];
			}
			else
			{
				return [1, -1];
			}
		}
		else if(vertices[1].x > limits_scaled[1])
		{
			if(vertices[2].y > limits_scaled[6] && vertices[3].y < limits_scaled[7])
			{
				if(vertices[1].x > limits_scaled[5])
				{
					return [-1, 1];
				}
			}
			else if(vertices[1].x < limits_scaled[1] * 1.005)
			{
				return [-1, 1];
			}
			else
			{
				return [1, -1];
			}
		}
		else if(vertices[2].y < limits_scaled[2])
		{
			return [1, -1];
		}
		else if(vertices[3].y > limits_scaled[3])
		{
			return [1, -1];
		}
		
		return null;
	}

//--GOALS FUNCTION-----------------------------

	this.Is_in_goals = function (word, vertices) 
	{
		goal_1.Is_in_goal(word, vertices);
		goal_2.Is_in_goal(word, vertices);
	}

//--ASSIGN POSTITIONS TO WORDS FUNCTIONS---------

	this.Is_valid_position = function (n) 
	{
		if (n < init_positions_words.length) return true; 
		else return false;
	}

	this.Get_valid_position = function (n) 
	{
		return init_positions_words[n];
	}

//--RESIZE FUNCTIONS-----------------------------

	this.Resize = function ()
	{	
		for(var i = 0; i < limits_scaled.length; i++)
			limits_scaled[i] = (limits[i] * scale);
	}

	this.Add_resize_listener = function ()
	{	
		this.Resize();
		canvas_util.Add_to_resize_listener(this);
	}
}