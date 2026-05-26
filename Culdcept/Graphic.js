


import * as THREE	from 'https://unpkg.com/three@0.160.0/build/three.module.js'
import * as Graphic	from '../js/Graphic.js'

export const Canvas	= Graphic.Canvas

export class Member extends Graphic.Model{
	change(state){
		this.state && this.state.exit(this.mesh)
		this.state = state
		if(state==null) return this
		this.state.entity = this
		this.state.enter(this.mesh)
		return this
	}
	update(dt){
		if(this.state==null) return this
		this.state.time += dt
		this.state.update(this.mesh)
		return this
	}
	_negateY({x,y}){return {x,y:-y}}
}

export class Box extends Member{
	constructor(w,h,d){
		super(new THREE.BoxGeometry(w,h,d))
	}
}

export class Texture extends THREE.MeshBasicMaterial{
	constructor(w,h,...a){
		super()
		let images	= a.map(v=>SVGFormat.image(w,h,v.href))
		let data	= SVGFormat.dataUrl(w,h,...images)
		let texture	= new THREE.TextureLoader().load(data)
		texture.colorSpace = THREE.SRGBColorSpace
		this.map = texture
	}
}

export class SVGFormat{
	static xmlns = 'http://www.w3.org/2000/svg'
	static metadata	= 'data:image/svg+xml;charset=utf-8,'
	static image(a,b,c){return `<image width="${a}" height="${b}" href="${c}" />`}
	static dataUrl(...a){return this.metadata+encodeURIComponent(this.svg(...a))}
	static svg(w,h,...a){
		return `<svg xmlns="${this.xmlns}" width="${w}" height="${h}">${a.join('')}</svg>`
	}
}


