


export class Xform extends Array{
	constructor(...a){
		super(0,0,0,0,0,0,1,1,1)// x,y,z, rx,ry,rz, sx,sy,sz
	}
	get position(){return{x:this[0],y:this[1],z:this[2]}}
	set position({x,y,z}){
		if(Number.isFinite(x)) this[0] = x
		if(Number.isFinite(y)) this[1] = y
		if(Number.isFinite(z)) this[2] = z
		this.update()
	}
	get scale(){return this[6]}
	set scale(v){
		if(Number.isFinite(v)) this[6] = this[7] = this[8] = v
		this.update()
	}
	set scaleX(x){
		if(Number.isFinite(x)) this[6] = x
		this.update()
	}
	set scaleY(y){
		if(Number.isFinite(y)) this[7] = y
		this.update()
	}
	toString(){
		let t = this._translate(this[0],this[1],this[2])
		//let r = this._rotate(this[3],this[4],this[5])
		let s = this._scale(this[6],this[7],this[8])
		return t+s
	}
	set(n){
		this.node = n
		return this
	}
	update(){
		this.node && this.node.setAttribute('transform',this.toString())
		return this
	}
	_translate(x,y,z){
		return z===0?`translate(${x},${y})`:`translate(${x},${y},${z})`
	}
	//svgはrotate(rotateZ)のみ
	_rotate(x,y,z){
		let r = ''
		if(x) r+=` rotateX(${x}deg)`
		if(y) r+=` rotateY(${y}deg)`
		if(z) r+=` rotateZ(${z}deg)`
		return r
	}
	_scale(x,y,z){
		if(x===y && x===z) return x===1?'':` scale(${x})`
		return z===1?` scale(${x},${y})`:` scale(${x},${y},${z})`
	}
}


