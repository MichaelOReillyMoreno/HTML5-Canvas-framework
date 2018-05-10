//=========================================================================
// word
//=========================================================================

function Animation (_img, _num_frames)
{
	this.enabled = false;

	var img = _img;

	var width_scaled = img.w;
	var height_scaled = img.h;

	var position;

	var num_frames = _num_frames;
	var current_frame = 0;

	var time = 0;
	var duration_frame = 0.05;

	this.Render = function () 
	{
		if(this.enabled)
		{
			render.Sprite(ctx, sprites, img, current_frame, position.x, position.y, width_scaled, height_scaled);
		}
	}

	this.Update = function (dt) 
	{
		if(this.enabled)
		{
			time += dt;

			if(time >= duration_frame)
			{
				time = 0;	

				if(current_frame < num_frames)
				{
					current_frame++;
				}
				else
				{
					this.enabled = false;
					current_frame = 0;
					position = null;
				}
			}
		}
	}

	this.Play = function (_position)
	{
		position = new Vector_2D(_position.x - (width_scaled * 0.5), _position.y - (height_scaled * 0.5));
		this.enabled = true;
	}

	this.Resize = function ()
	{	
		width_scaled  = img.w  * scale;
		height_scaled = img.h  * scale;
	}

	this.Add_resize_listener = function ()
	{	
		canvas_util.Add_to_resize_listener(this);
	}
}