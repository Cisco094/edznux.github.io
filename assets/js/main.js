/**
* Gestion des onglets
* @name : tab id of current element
*/
var Onglet = function(name){
	/**
	* Public attribute
	*/
	// self is reference to the current state of "this"
	var self = this;
	this.self = self;

	this.name = name;
	this.purename = name.replace(/#/, "");
	this.el = document.querySelector(name);
	this.getMainEl = document.getElementById("pos-"+this.purename);

	/*
	* Click to goto page => TODO smooth scroll ?
	*/
	this.el.addEventListener('click',function(){
		window.scrollTo(0,self.getMainEl.offsetTop);
	});

	/*
	* Listen for scroll or page load (init) 
	* slide by calling select or deselect method
	* only if page show > 1.2 * scroll
	*/
	window.addEventListener('scroll',scrollHandler);
	window.addEventListener('load',scrollHandler);

	/*
	* private function
	*/
	function scrollHandler(){
		var scrollTop = window.scrollY;
		var smooth = (scrollTop * 1.2);
		if(smooth >= self.getMainEl.offsetTop &&
		   smooth <= self.getMainEl.getBoxQuads()[0].bounds.height + self.getMainEl.offsetTop){
		
			self.select();
		}else{
			self.deselect();
		}
	}

	/*
	* public method
	*/
	this.animate = function(){
		console.log(self.el);
		self.el.addEventListener("click",function(){
			self.el.classList.toggle('onglet-deep');
		});
	};
	
	this.select = function(){
		self.el.classList.add('onglet-select');
	};
	
	this.deselect = function(){
		self.el.classList.remove('onglet-select');
	};

	this.setBounds = function(next_el){
		// self.el.offsetTop;
		// document.querySelector(next_el).offsetTop;
	};
};


//store into array all tabs available
var tabList = [];
var accueil = new Onglet('#accueil');
var informations = new Onglet('#informations');
var projets = new Onglet('#projets');
var cv = new Onglet('#cv');
var contacts = new Onglet('#contacts');;var DEFAULT_RANDOM_DECAL = 40;
var DEFAULT_RANDOM_VELOCITY = 1;
var MAX_MOVE_X = 15;
var MAX_MOVE_Y = 15;
var SPEED_MULTIPLIER = 0.4;

var Point = function(x,y,vx,vy,size,sx,sy){
	if(!sx){
		sx = SPEED_MULTIPLIER;
	}
	if(!sy){
		sy = SPEED_MULTIPLIER;
	}

	this.x = x;
	this.y = y;
	this.origin_x = x;
	this.origin_y = y;
	this.velocity_x = vx;
	this.velocity_y = vy;
	this.speed_x = sx;
	this.speed_y = sy;
	this.size = size;
	this.links = [];
	this.step = 0;
};

var Grid = function(canvasId,size){
	var self = this;
	this.self = self;
	this.canvas = document.getElementById(canvasId);

	this.ctx = this.canvas.getContext("2d");
	
	this.gridsize_x = 0;
	this.gridsize_y = 0;
	this.size = size;

	this.init = function(){
		console.log("Start init");
		self.gridsize_x = Math.floor(window.innerWidth / self.size);
		self.gridsize_y = Math.floor(window.innerHeight / self.size);
		
		self.bleedsize_x =  window.innerWidth - (self.gridsize_x * size);
		self.bleedsize_y =  window.innerHeight - (self.gridsize_y * size);
		
		canvas.width  = window.innerWidth - (self.bleedsize_x*size);
		canvas.height = window.innerHeight - (self.bleedsize_y*size);

		self.ctx.strokeStyle = "#ffd997";
		self.ctx.lineWidth = 1.51;
	};

	this.points = [];
	this.randomDecal = function(max){
		if(!max){
			max = DEFAULT_RANDOM_DECAL;
		}
		r = (Math.random()*max)-max/2;
		return r;
	};

	this.randomVelocity = function(max){
		if(!max){
			max = DEFAULT_RANDOM_VELOCITY;
		}

		r = (Math.random()*max)-max/2;
		return r;
	};

	this.generateGrid = function(n){
		if(!n){
			n = self.size;
		}
		console.log('Generate grid with '+ n +' entities');
		var p,x,y;

		for(var i = 0; i < n; i ++){
			self.points[i] = [];
			for(var j = 0; j < n; j++){
				p = new Point(self.gridsize_x*i+self.randomDecal(), self.gridsize_y*j+self.randomDecal(), self.randomVelocity(), self.randomVelocity(), 2);
				self.points[i][j] = p;
			}
		}
		self.createLinks();
		console.log('Generation finished');
	};

	this.drawPoints = function(){
		
		var points_lx = this.points.length;
		// get length of y axis, 0 because all line are equal;
		var points_ly = this.points[0].length;

		for(var i = 0; i < points_lx; i++){
			for(var j = 0; j < points_lx; j++){
				self.ctx.beginPath();
				self.ctx.arc(self.points[i][j].x, self.points[i][j].y, self.points[i][j].size,0,2*Math.PI);
				self.ctx.stroke();
			}
		}
	};

	this.createLinks = function(){
		var points_lx = this.points.length;
		var points_ly = this.points[0].length;

		for(var i = 0; i < points_lx - 1; i++){
			for(var j = 0; j < points_lx - 1; j++){
				self.points[i][j].links.push(self.points[i+1][j]);
				self.points[i][j].links.push(self.points[i][j+1]);
				self.points[i][j].links.push(self.points[i+1][j+1]);
			}
		}
	};

	this.drawLine = function(){
		var points_lx = this.points.length;
		// get length of y axis, 0 because all line are equal;
		var points_ly = this.points[0].length;
		for(var i = 0; i < points_lx - 1; i++){
			for(var j = 0; j < points_lx - 1; j++){
				// this is bullshit.
				self.ctx.beginPath();
				self.ctx.moveTo(self.points[i][j].x, self.points[i][j].y);
				
				self.ctx.lineTo(self.points[i][j].links[0].x, self.points[i][j].links[0].y);
				self.ctx.moveTo(self.points[i][j].x, self.points[i][j].y);
				self.ctx.lineTo(self.points[i][j].links[1].x, self.points[i][j].links[1].y);

				self.ctx.moveTo(self.points[i][j].x, self.points[i][j].y);
				self.ctx.lineTo(self.points[i][j].links[2].x, self.points[i][j].links[2].y);
				self.ctx.stroke();
			}
		}
	};

	this.movePoint = function(i,j){
		//not working ! 
		//TODO : looking if point' pos are inbound of max move
		// x sup
		if(self.points[i][j].x >= self.points[i][j].origin_x + MAX_MOVE_X){
			self.points[i][j].x -= Math.abs(self.points[i][j].velocity_x) * self.points[i][j].speed_x;
		}else{
			self.points[i][j].x += Math.abs(self.points[i][j].velocity_x) * self.points[i][j].speed_x;
		}

		// y sup
		if(self.points[i][j].y >= self.points[i][j].origin_y + MAX_MOVE_Y){
			self.points[i][j].y -= Math.abs(self.points[i][j].velocity_y) * self.points[i][j].speed_y;
		}else{
			self.points[i][j].y += Math.abs(self.points[i][j].velocity_y) * self.points[i][j].speed_y;
		}

		//x inf
		if(self.points[i][j].x <= self.points[i][j].origin_x - MAX_MOVE_X){
			self.points[i][j].x += Math.abs(self.points[i][j].velocity_x) * self.points[i][j].speed_x;
		}else{
			self.points[i][j].x += Math.abs(self.points[i][j].velocity_x) * self.points[i][j].speed_x;
		}

		//y inf
		if(self.points[i][j].y <= self.points[i][j].origin_y - MAX_MOVE_Y){
			self.points[i][j].y += Math.abs(self.points[i][j].velocity_y) * self.points[i][j].speed_y;
		}else{
			self.points[i][j].y += Math.abs(self.points[i][j].velocity_y) * self.points[i][j].speed_y;
		}
	};

	this.annimate = function(){
		self.ctx.clearRect(0,0,canvas.width,canvas.height);
		var points_lx = self.points.length;
		var points_ly = self.points[0].length;

		for (var i = 0; i < points_lx; i++) {
			for (var j = 0; j < points_ly; j++) {
				self.movePoint(i,j);
			}
		}
		self.drawPoints();
		self.drawLine();
	};
};

var t,c;
function start(){
	c = new Grid("canvas",17);

	c.init();
	c.generateGrid();
	// c.drawPoints();
	// c.drawLine();

	t = setInterval(function(){
		c.annimate();
	},55);
}

function reset(){
	delete c;
	c = "";
	clearInterval(t);
	start();
}

window.addEventListener('load',start);
window.addEventListener('resize',start);