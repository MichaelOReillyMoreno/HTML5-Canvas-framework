//=========================================================================
// DOM utils
//=========================================================================

function Dom_util () 
{

	this.Get = function (id)                          { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); }
	this.Set = function (id, html)                    { this.Get(id).innerHTML = html;                                                            }
	this.On = function (ele, type, fn, capture)       {if(ele) this.Get(ele).addEventListener(type, fn, capture);                                        }
	this.Un = function (ele, type, fn, capture)       { this.Get(ele).removeEventListener(type, fn, capture);                                     }
	this.Show = function (ele, type)                  { this.Get(ele).style.display = (type || 'block');                                          }
	this.Blur = function (ev)                         { ev.target.blur();                                                                             }	
	this.Add_class_name = function (ele, name)        { this.Toggle_class_name(ele, name, true);                                                  }
	this.Remove_class_name = function (ele, name)     { this.Toggle_class_name(ele, name, false);                                                 }
	this.Toggle_class_name = function (ele, name, on) 
	{
		ele = this.get(ele);
		var classes = ele.className.split(' ');
		var n = classes.indexOf(name);
		on = (typeof on == 'undefined') ? (n < 0) : on;
		if (on && (n < 0))
		classes.push(name);
		else if (!on && (n >= 0))
		classes.splice(n, 1);
		ele.className = classes.join(' ');
  }
}