

class Tween{
	constructor(duration=1){
		this.time = 0
		this.duration = duration
	}
	enter(){}
	update(){}
	exit(){}
	leap(a,b,t){return a+(b-a)*t}
	dispatch(detail){
		//let e = new CustomEvent('action',{detail,bubbles:true})
		let e = new CustomEvent('action',{detail})
		document.body.dispatchEvent(e)
	}
	get value(){return Math.min(this.time/this.duration,1)}
}

export class Draw extends Tween{
	constructor(){super(0.75)}
	enter(mesh){
		mesh.position.x = -1920
		mesh.position.y = 0
	}
	update(mesh){
		let t = this.value
		let e = 1 - Math.pow(1-t,2)
		let eIn = t*t
		mesh.position.x = this.leap(-960,-405,e)+Math.sin(e*Math.PI)*300
		mesh.position.y = this.leap(0,115,e)
		mesh.rotation.x = this.leap(Math.PI/3,0,e)
		mesh.rotation.y = this.leap(-Math.PI/2,0,e)
		mesh.scale.setScalar(this.leap(0.5,1,e))
		if(t==1) this.entity.change(new Dialog())
	}
	exit(mesh){
		mesh.rotation.x = 0
	}
}

class Dialog extends Tween{
	enter(){this.dispatch({type:'DIALOG'})}
}

export class Select extends Tween{
	constructor(){super(30/60)}
	enter(mesh){
		this.begin	= this.entity.position
		this.end	= {x:-960+550/2+280,y:115}
	}
	update(mesh){
		let t = this.value
		let e = 1 - Math.pow(1-t,2)
		mesh.position.x = this.leap(this.begin.x,this.end.x,e)+Math.sin(e*Math.PI)*300
		mesh.position.y = this.leap(this.begin.y,this.end.y,e)
		mesh.rotation.y = this.leap(0,-Math.PI,e)
		mesh.scale.setScalar(this.leap(200/550,1,e))
		if(t===1) this.entity.change(new SelectTurn())
	}
}

class SelectTurn extends Tween{
	constructor(){super(10/60)}
	update(mesh){
		let t = this.value
		let e = t*t
		mesh.rotation.y = this.leap(Math.PI,0,e)
		if(t===1) this.entity.change(new Dialog())
	}
}

export class Summon extends Tween{
	constructor(){super(30/60)}
	enter(mesh){
		this.time	= 0
		this.begin	= {...mesh.position}
		this.end	= {x:0,y:0}
	}
	update(mesh){
		let t = this.value
		let e = 1 - Math.pow(1-t,2)
		mesh.position.x = this.leap(this.begin.x,this.end.x,e)
		mesh.position.y = this.leap(this.begin.y,this.end.y,e)+Math.sin(e*Math.PI)*300
		mesh.scale.setScalar(this.leap(1,0,e))
		if(t===1) this.entity.change(new Complete())
	}
	exit(mesh){this.dispatch({type:'DONE'})}
}

class Complete extends Tween{
	constructor(d=0.1){super(d)}
	update(){this.value===1 && this.entity.change()}
	exit(mesh){this.dispatch({type:'TWEEN_COMPLETE'})}
}

export class Discard extends Tween{
	constructor(){super(30/60)}
	enter(mesh){
		this.time	= 0
		this.begin	= {...mesh.position}
		this.end	= {x:0,y:-1920}
		this.rotation = {x:this.random(),y:this.random(),z:this.random()}
	}
	random(){return Math.PI*(1-2*Math.random())}
	update(mesh){
		let t = this.value
		let e = t*t
		let out = 1 - Math.pow(1-t,2)
		mesh.position.x = this.leap(this.begin.x,this.end.x,e)
		mesh.position.y = this.leap(this.begin.y,this.end.y,e)+Math.sin(out*Math.PI)*300
		mesh.rotation.x = this.leap(0,this.rotation.x,e)
		mesh.rotation.z = this.leap(0,this.rotation.z,e)
		mesh.rotation.y = this.leap(0,this.rotation.y,e)
		if(t===1) this.entity.change(new Complete())
	}
	exit(mesh){this.dispatch({type:'DONE'})}
}

export class Cancel extends Tween{
	constructor(){super(0.5)}
	enter(mesh){
		this.time		= 0
		this.begin		= {...mesh.position,ry:mesh.rotation.y}
		this.end		= this.entity.position
	}
	update(mesh){
		let t = this.value
		let e = 1 - Math.pow(1-t,2)
		mesh.position.x = this.leap(this.begin.x,this.end.x,e)
		mesh.position.y = this.leap(this.begin.y,this.end.y,e)
		mesh.rotation.y = this.leap(this.begin.ry,0,e)
		mesh.scale.setScalar(this.leap(1,200/550,e))
		if(t===1) this.entity.change(new Complete())
	}
	exit(mesh){this.dispatch({type:'DONE'})}
}

export class AddToHand extends Tween{
	constructor(cancel){super(0.75)}
	enter(mesh){
		this.time		= 0
		this.begin		= {...mesh.position,ry:Math.PI*2}
		this.end		= this.entity.position
	}
	update(mesh){
		let t = this.value
		let e = 1 - Math.pow(1-t,2)
		mesh.position.x = this.leap(this.begin.x,this.end.x,e)
		mesh.position.y = this.leap(this.begin.y,this.end.y,e)
		mesh.rotation.y = this.leap(this.begin.ry,0,e)
		mesh.scale.setScalar(this.leap(1,200/550,e))
		if(t===1) this.entity.change(new Complete())
	}
	exit(mesh){this.dispatch({type:'DONE'})}
}


