//=========================================================================
// word
//=========================================================================

function Game_field_canvas_2 (_init_positions_words)
{
	
//start postions of the words---------------

	var init_positions_words = _init_positions_words;

	var init_positions_free = init_positions_words.length;

//limits of the filed-----------------------

	        // 0 LEFT 1 RIGHT 2 TOP 3 BOTTOM
	var limits = [0, width,   0,  height];
	var limits_scaled = limits.slice();

//--COLLISIONS FUNCTIONS-----------------------------

	this.Check_collisions = function (vertices) 
	{
		if((vertices[0].x < limits_scaled[0]) || (vertices[1].x > limits_scaled[1]) || (vertices[2].y < limits_scaled[2]) || (vertices[3].y > limits_scaled[3]))
		{
			return true;
		}
		else	
			return false;
	}

//--ASSIGN POSTITIONS TO WORDS FUNCTIONS---------

	this.Are_there_free_positions = function () 
	{
		if (init_positions_free > 0) 
			return true; 
		else 
			return false;
	}

	this.Get_valid_position = function () 
	{	
		if(init_positions_free > 5)
		{
			var num_pos = Math.floor(Math.random() * init_positions_words.length);
			
			while(!init_positions_words[num_pos].is_free)
			{
				num_pos = Math.floor(Math.random() * init_positions_words.length);
			}
			
			init_positions_words[num_pos].is_free = false;
			init_positions_free --;
			
			return init_positions_words[num_pos].position;
		}
		else
		{
			for(var i = 0; i < init_positions_words.length; i++)
			{
				if(init_positions_words[i].is_free)
				{
					init_positions_words[i].is_free = false;
					init_positions_free --;	
					
					return init_positions_words[i].position;			
				}
			}
		}
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