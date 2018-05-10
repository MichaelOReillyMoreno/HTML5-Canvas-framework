
//=========================================================================
// GAME helpers
//=========================================================================

function Game_util()
{
	this.input_position = new Vector_2D(0, 0);
	var is_in_input = false;
	
	var INPUT = { TOUCH: 0, MOUSE: 1, NONE: 2}	
	var input_type  = INPUT.NONE;	

	
	this.Run = function (options) 
	{
		this.Load_images(options.images, function(images) 
		{
			options.ready(images); // tell caller to initialize itself because images are loaded and we're ready to rumble'

			var canvas = options.canvas, // canvas Render target is provided by caller
			Update = options.Update,     // method to Update game logic is provided by caller
			Render = options.Render,     // method to Render the game is provided by caller
			step   = options.step,       // fixed frame step (1/fps) is specified by caller
			now    = null,
			last   = math_util.Timestamp(),
			dt     = 0,
			gdt    = 0;

			function frame() 
			{
				now = math_util.Timestamp();
				dt  = Math.min(1, (now - last) / 1000);
				gdt = gdt + dt;

				while (gdt > step) 
				{
					gdt = gdt - step;
					Update(step);
				}

				Render();
				last = now;
				requestAnimationFrame(frame, canvas);
			}
			frame(); 
		});
	}
	
  //---------------------------------------------------------------------------

	this.Load_images = function (names, callback) 
	{ 
		var result = [];
		var count  = names.length;

		var onload = function() 
		{
			if (--count == 0)
				callback(result);
		};

		for(var n = 0 ; n < names.length ; n++) 
		{
			var name = names[n];
			result[n] = document.createElement('img');
			dom_util.On(result[n], 'load', onload);
			result[n].src = route_images + name + ".png";
		}
	}

  //---------------------------------------------------------------------------
  
    this.Drag_and_drop = function (callback_input_down, callback_input_up) 
	{	
		this.Add_input_listener(callback_input_down);
		this.Add_input_up_listener(callback_input_up);
		this.Add_mouse_move_listener();
		this.Add_touch_move_listener();
	}
	
    this.Add_input_listener = function (callback) 
	{	
		this.Add_touch_listener(callback);
		this.Add_mouse_down_listener(callback);
	}
	
	this.Add_input_up_listener = function (callback) 
	{	
		this.Add_mouse_up_listener(callback);
		this.Add_touchs_end_listener(callback);
	}

  //---------------------------------------------------------------------------

    this.Add_mouse_down_listener = function (callback)
    {	
		canvas.addEventListener('mousedown', function(evt) 
		{ 
			if(!is_in_input)
			{		
				is_in_input = true;
				input_type  = INPUT.MOUSE;	

				var rect = canvas.getBoundingClientRect();
				
				game_util.input_position.Set(evt.clientX - rect.left, evt.clientY - rect.top);
				callback(game_util.input_position);
				
				setTimeout(function() {is_in_input = false;}, 200);
			}
		}, 
		  false );	
	}
	
	this.Add_mouse_up_listener = function (callback)
    {	
		canvas.addEventListener('mouseup ', function() 
		{ 
			input_type  = INPUT.NONE;
			callback();
		}, 
		  false );	
		  
		canvas.addEventListener('click', function() 
		{ 
			input_type  = INPUT.NONE;		
			callback();
		}, 
		  false );	
	}
	
    this.Add_mouse_move_listener = function ()
    {	
		canvas.addEventListener('mousemove', function(evt) 
		{
			if(input_type == INPUT.MOUSE)
			{		
				var rect = canvas.getBoundingClientRect();
				game_util.input_position.Set(evt.clientX - rect.left, evt.clientY - rect.top);
			}
		}, 
		  false );	
	}

  //---------------------------------------------------------------------------

  	this.Add_touch_listener = function (callback)
	{
		canvas.addEventListener('touchstart', function(evt) 
		{ 
			if(!is_in_input)
			{
				evt.preventDefault();
				
				is_in_input = true;
				input_type  = INPUT.TOUCH;	
				
				var rect = canvas.getBoundingClientRect();
	
				var touches = evt.changedTouches;
	
				if(touches.length > 0) 
				{
					game_util.input_position.Set(touches[0].clientX - rect.left, touches[0].clientY - rect.top);
					callback(game_util.input_position);
				}

				setTimeout(function() {is_in_input = false;}, 200);
			}
		}, 
		  false );			
	}
  
	this.Add_touchs_listener = function (callback)
	{
		canvas.addEventListener('touchstart', function(evt) 
		{ 
			if(!is_in_input)
			{
				evt.preventDefault();
				
				is_in_input = true;
				input_type  = INPUT.TOUCH;	
				
				var rect = canvas.getBoundingClientRect();
	
				var touches = evt.changedTouches;
	
				for (var i = 0; i < touches.length; i++) 
				{
					callback(new Vector_2D(touches[i].clientX - rect.left, touches[i].clientY - rect.top));
				}

				setTimeout(function() {is_in_input = false;}, 200);
			}
		}, 
		  false );			
	}
	
	this.Add_touchs_end_listener = function (callback)
	{
		canvas.addEventListener('touchend', function(evt) 
		{ 
			input_type  = INPUT.NONE;
			callback();
		}, 
		  false );	

		canvas.addEventListener('touchcancel', function(evt) 
		{ 
			input_type  = INPUT.NONE;
			callback();
		}, 
		  false );			  
	}
	
	this.Add_touch_move_listener = function ()
    {	
		canvas.addEventListener('touchmove', function(evt) 
		{
			if(input_type == INPUT.TOUCH)
			{		
				var rect = canvas.getBoundingClientRect();
	
				var touches = evt.changedTouches;
	
				if(touches.length > 0) 
				{
					game_util.input_position.Set(touches[0].clientX - rect.left, touches[0].clientY - rect.top);
				}
			}
		}, 
		  false );	
	}
  //---------------------------------------------------------------------------
	this.Detect_browser = function (callback)
	{ 
		if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
		{
			return 'Opera';
		}
		else if(navigator.userAgent.indexOf("Chrome") != -1 )
		{
			return 'Chrome';
		}
		else if(navigator.userAgent.indexOf("Safari") != -1)
		{
			return 'Safari';
		}
		else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
		{
			return 'Firefox';
		}
		else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
		{
			return 'IE'; 
		}  
		else 
		{
			return 'unknown';
		}
	}
	
	this.Array_move = function (arr, old_index, new_index)
	{ 
		if (new_index >= arr.length) 
		{
			var k = new_index - arr.length + 1;
			while (k--) 
			{
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	}
}

window.print = function (txt) 
{
    console.log(txt);
};