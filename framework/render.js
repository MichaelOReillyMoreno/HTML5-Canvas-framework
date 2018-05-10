//=========================================================================
// canvas Rendering
//=========================================================================

function Render() 
{
	//draw a sprite in a sprite sheet that is scales
	this.Sprite = function(ctx, sprites, sprite, current_frame, destX, destY, width, height) 
	{
		ctx.drawImage(sprites, sprite.x + (current_frame * sprite.w), sprite.y, sprite.w, sprite.h, destX, destY, width, height);
	}

	this.Sprite_rotate = function(ctx, sprites, sprite, current_frame, destX, destY, width, height, rotation) 
	{
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, destX + width / 2, destY + height / 2);
		ctx.rotate(rotation);

		ctx.drawImage(sprites, sprite.x + (current_frame * sprite.w), sprite.y, sprite.w, sprite.h,  -width / 2, -height / 2, width, height);
		
		ctx.restore();
	}
	
	//draw a single iamge that is scaled
	this.Image = function(ctx, img, width, height, x, y)
	{
		ctx.drawImage(img, x, y, width, height);
	}

	this.Text = function(ctx, content, x, y) 
	{
		ctx.fillText(content, x, y);
	}
	
	this.Rounded_corners_rectangle = function(ctx, x, y, width, height, radius, stroke, line_width, border_color) 
	{
      ctx.beginPath();  
      ctx.moveTo(x + radius, y);
	  
      ctx.lineTo(x + width - radius, y);	  
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
	  
      ctx.lineTo(x + width, y + height - radius);	  
	  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);

	  ctx.lineTo(x + radius, y + height);	  
	  ctx.arcTo(x, y + height, x, y + height - radius, radius);
	  
	  ctx.lineTo(x, y  + radius);	
	  ctx.arcTo(x, y, x + radius, y, radius);
	  
	  if(stroke)
	  {
		ctx.strokeStyle = border_color;
		ctx.lineWidth = line_width;
		ctx.stroke();
	  }
	  else ctx.fill();
	}
}