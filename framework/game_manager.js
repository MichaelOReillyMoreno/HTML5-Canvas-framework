//=========================================================================
// GAME MANAGER
//=========================================================================

function Game_manager() 
{	
	//show correct answers the exercise if the time is out
	this.Show_answers = function ()
	{  
		game.Show_answers();
	}

	this.Stop = function ()
	{  
		game_is_end = true;
	}
	

	this.Load_game = function (var_1, var_2, var_3, var_4, var_5, var_6, var_7, var_8)
	{  
		game.Init_angular_vars(var_1, var_2, var_3, var_4, var_5, var_6, var_7, var_8);
		
		game_util.Run
		({
			canvas: canvas, Render: game.Render, Update: game.Update, step: step,
			images: [images_name],
			ready: function(images)
			{
				sprites = images[0];
				
				canvas.height = canvas.offsetHeight;
				canvas.width = canvas.height;


				height = canvas.width;
				width = canvas.height;

				init_height = canvas.offsetHeight;
				
				game.Init_vars_canvas_that_need_ready();
				
				canvas_util.Add_resize_listener(100);
				
				game.Start();
			}
		});

		if (!window.requestAnimationFrame) 
		{ 
			window.requestAnimationFrame = window.webkitRequestAnimationFrame  || 
											window.mozRequestAnimationFrame    || 
											window.oRequestAnimationFrame      || 
											window.msRequestAnimationFrame     || 
											function(callback, element) 
											{
												window.setTimeout(callback, 1000 / 60);
											}
		}
	}
}