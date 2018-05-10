//=========================================================================
// Text Rasterizer
//=========================================================================

function Text_rasterizer ()
{
	//auxilar canvas to rasterize text
	var context;
	var parse_canvas;
	
	//size canvas texts
	var width_aux_canvas = 0;
	var height_aux_canvas = 0;
	
	//each browser toDataURL() is slightly different, we need to make corrections
	var y_correct_on_browser = 0;
	var browser = game_util.Detect_browser();
	var init_pos_mult = 0;

	var width_line = 0;
	var radius_corners = 0.19;
	
	var rae;

	//Rasterize an array of texts
	this.Rasterize_array_texts = function(words_from_json, font_size, font, color, has_background, bg_color_1, bg_color_2, 
										 has_border_1, border_proportional, border_color_1, has_border_2, border_color_2, _rae) 
	{
		var imgs = new Array(words_from_json.length);
		rae = _rae;
		
		//we create the auxiliar canvas to rasterize
		parse_canvas = document.createElement("canvas"); 
		parse_canvas.id = 'parse_canvas';
		canvas.parentElement.appendChild(parse_canvas);
		context = parse_canvas.getContext('2d');
		context.font = font_size + 'px ' + font;
		
		//we set the height of the text and the corrections
		height_aux_canvas = font_size * 1.8;
		
		y_correct_on_browser = height_aux_canvas / 18;
		
		if( browser == "Firefox")
		{
			y_correct_on_browser += height_aux_canvas / 12;
		}

		for (var i = 0; i < imgs.length; i++) 
		{
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);

			imgs[i] = {word: null, rae: null};

			this.create_img(imgs[i], words_from_json[i],font_size, font, color, has_background, bg_color_1, bg_color_2,
							has_border_1, border_proportional, border_color_1, has_border_2, border_color_2);
		}
		
		parse_canvas.outerHTML = "";
		return imgs;
	}

	this.create_img = function (img, txt, font_size, fontface, color, has_background, bg_color_1, bg_color_2 ,
								 has_border_1, border_proportional , border_color_1, has_border_2, border_color_2)
	{
		this.Set_width(txt);

		parse_canvas.width = width_aux_canvas;
		parse_canvas.height = height_aux_canvas;
		
		context.textBaseline ='top';
		context.font = font_size +'px ' + fontface;
		
		this.Text_decoration(has_background, bg_color_1, bg_color_2 , has_border_1, 
							 border_proportional , border_color_1, has_border_2, border_color_2);
		
		context.fillStyle = color;
		context.fillText(txt.palabra,context.measureText(txt.palabra).width * init_pos_mult, y_correct_on_browser + (height_aux_canvas * 0.08));

		//we create the word image
		img.word = new Image();
		img.word.src = parse_canvas.toDataURL("image/png");
		img.word.style.height = height_aux_canvas + "px";
		img.word.style.width = width_aux_canvas + "px";

		if(rae)
		{
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);

			this.Text_decoration(has_background, bg_color_1, bg_color_2 , has_border_1, 
								 border_proportional , border_color_1, has_border_2, border_color_2);
								 
			context.fillStyle = color;
			context.fillText(txt.rae,context.measureText(txt.rae).width * init_pos_mult, y_correct_on_browser + (height_aux_canvas * 0.08));

			//we create the rae image
			img.rae = new Image();
			img.rae.src = parse_canvas.toDataURL("image/png");
			img.rae.style.height = height_aux_canvas + "px";
			img.rae.style.width = width_aux_canvas + "px";			 
		}
	}

	this.Text_decoration = function(has_background, bg_color_1, bg_color_2 , has_border_1,
								    border_proportional , border_color_1, has_border_2, border_color_2)
	{
		//if we want, we can  create a background to the text
		if(has_background)
		{
			//we create the background
			var my_gradient = context.createLinearGradient(0,0,0,height_aux_canvas);
			
			my_gradient.addColorStop(0, bg_color_1);
			my_gradient.addColorStop(1, bg_color_2);
			
			context.beginPath();
			context.fillStyle = my_gradient;
			//context.fillRect(0, 0, width_aux_canvas, height_aux_canvas);
			render.Rounded_corners_rectangle(context, 0,0,width_aux_canvas,height_aux_canvas, height_aux_canvas * radius_corners * 1.5);
		}

		width_line = height_aux_canvas / border_proportional;

		if(has_border_1)
		{	

			render.Rounded_corners_rectangle(context, width_line * 0.5, width_line * 0.5,
											parse_canvas.width - width_line, parse_canvas.height - width_line, 
											height_aux_canvas * radius_corners * 1.2, true, width_line, border_color_1);
		}

		if(has_border_2)
		{	
			render.Rounded_corners_rectangle(context, width_line * 1.5, width_line * 1.5, 
											parse_canvas.width - (width_line * 3), parse_canvas.height - (width_line * 3), 
											height_aux_canvas * radius_corners, true, height_aux_canvas / border_proportional, border_color_2);
		}
	}
	
	this.Set_width = function(txt)
	{
		if(txt.palabra.length > 10)
		{
			width_aux_canvas = context.measureText(txt.palabra).width * 1.2;
			init_pos_mult = 0.1;
		}
		else if(txt.palabra.length > 6)
		{
			width_aux_canvas = context.measureText(txt.palabra).width * 1.4;
			init_pos_mult = 0.2;
		}
		else if(txt.palabra.length > 3)
		{
			width_aux_canvas = context.measureText(txt.palabra).width * 1.6;
			init_pos_mult = 0.35;
		}
		else
		{
			width_aux_canvas = context.measureText(txt.palabra).width * 1.75;
			init_pos_mult = 0.4;
		}
	}
}