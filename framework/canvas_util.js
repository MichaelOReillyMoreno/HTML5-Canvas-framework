//=========================================================================
// HUD funtions
//=========================================================================

function Canvas_util () 
{
	var resize_elements = [];

	this.Resize = function() 
	{
		canvas.height = canvas.offsetHeight;
		canvas.width  = canvas.height;
		
		height = canvas.height; 
		width = canvas.width;
		
		scale = canvas.offsetHeight / init_height;
		scale_words_size = scale * scale_words_size_multiplier;

		game.Resize_vars();
	}

	this.Resize_Interval = function() 
	{
		if(canvas.offsetHeight != height)
		{
			this.Resize();

			for(var i = 0; i < resize_elements.length; i++)
			{
				resize_elements[i].Resize();
			}
		}
	}	

	this.Add_to_resize_listener = function(resize_function) 
	{	
		resize_elements.push(resize_function);
	}

    this.Add_resize_listener = function (time_interval)
    {
        setInterval(this.Resize_Interval.bind(this), time_interval);
    }
}
