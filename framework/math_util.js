//=========================================================================
// general purpose helpers (mostly math)
//=========================================================================
function Vector_2D (x, y)
{
	this.x = x;
	this.y = y;

	this.Normalize = function () 
	{
		var v = Math.sqrt((this.x * this.x) + (this.y * this.y));

		this.x = this.x / v;
		this.y = this.y / v;
	}

	this.Set = function (x, y) 
	{
		this.x = x;
		this.y = y;
	}

	this.Add = function (add_x, add_y) 
	{
		this.x += add_x;
		this.y += add_y;
	}
	
	this.Copy = function (v) 
	{
		this.x = v.x;
		this.y = v.y;
	}
	
	this.Multiply_float = function (f) 
	{
		this.x = this.x * f;
		this.y = this.y * f;
	}
	
	this.Zero = function () 
	{
		this.x = 0;
		this.y = 0;
	}

	this.To_string = function () 
	{
		return "X : " + this.x + " Y : " + this.y;
	}
}

function Math_util() 
{

	this.Timestamp = function ()                              { return new Date().getTime();                                                                             }
	this.ToInt = function (obj, def)                          { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return this.ToInt(def, 0);     }
	this.ToFloat = function (obj, def)                        { if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return this.ToFloat(def, 0.0); }
	this.Limit = function (value, min, max)                   { return Math.max(min, Math.min(value, max));                                                              }
	this.Random_int = function (min, max)                     { return Math.round(this.Interpolate(min, max, Math.random()));                                            }
	this.Random_float = function (min, max)                   { return this.Interpolate(min, max, Math.random());                                                        }
	this.Random_choice = function (options)                   { return options[this.Random_int(0, options.length-1)];                                                    }
	this.Random_choice_between = function (options, min, max) { return options[this.Random_int(min, max)];                                                               }
	this.Percent_remaining = function (n, total)              { return (n%total)/total;                                                                                  }
	this.Accelerate = function (v, accel, dt)                 { return v + (accel * dt);                                                                                 }
	this.Interpolate = function (a,b,percent)                 { return a + (b-a)*percent                                                                                 }
	this.Get_distance_two_points = function (point1, point2)  { return Math.sqrt( Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2) );             }   
	this.Get_centre = function (position, width, height)      {	return new Vector_2D(position.x + (width   * 0.5), position.y + (height  * 0.5));                        }
	this.Get_direction = function (point1, point2)            {	return new Vector_2D(point1.x - point2.x, point1.y - point2.y);                                          }		

	this.Increase = function (start, increment, max) //increas a var between two limits
	{
		var result = start + increment;
		while (result >= max)
		  result -= max;
		while (result < 0)
		  result += max;
		return result;
	}

	this.Lerp = function (v0, v1, t) 
	{
		return Math.floor((1 - t) * v0 + t * v1);
	}

	this.Lerp_color = function (initial_color, final_color, t)
	{
			return "rgb(" + this.Lerp(initial_color[0], final_color[0], t) + ", " + this.Lerp(initial_color[1], final_color[1], t) +
				 ", " + this.Lerp(initial_color[2], final_color[2], t) + ")";
	}
	
	this.Lerp_vector_2D = function (v1, v2, t)
	{
			return new Vector_2D(this.Lerp(v1.x, v2.x, t), this.Lerp(v1.y, v2.y, t));
	}


	this.Add_explosion_force = function (origin, range, distance, position, force)
	{
		var force_distance = (1 - (distance / range)) * force;

		var direction = this.Get_direction(position, origin);	
		direction.Normalize();

		return new Vector_2D(direction.x * force_distance, direction.y * force_distance);   
	}
	
	this.Check_collision_rectangle_vertices = function (vertices, other_vertices)
	{
		if(vertices[0].x < other_vertices[1].x && vertices[1].x > other_vertices[0].x && 
		   vertices[0].y < other_vertices[1].y && vertices[1].y > other_vertices[0].y)
		   return true;
		else
		   return false;
	}
	
	this.Check_point_inside_rectangle = function (vertices, point)
	{
		if(vertices[0].x < point.x && vertices[1].x > point.x && 
		   vertices[0].y < point.y && vertices[1].y > point.y)
		   return true;
		else
		   return false;
	}
}