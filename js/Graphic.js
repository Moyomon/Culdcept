


import * as THREE	from 'https://unpkg.com/three@0.160.0/build/three.module.js'
import {View}		from './Inference.js'

export class Canvas extends View{
	constructor(width,height){
		let renderer = new Renderer(width,height)
		super(renderer.domElement)
		this.items		= []
		this.renderer	= renderer
		this.scene		= new THREE.Scene()
		this.camera		= new Camera(50,width,height)
	}
	update(dt){
		for(let v of this.items) v.update(dt)
		this.renderer.render(this.scene,this.camera)
		return this
	}
	var(v){
		switch(true){
			case v instanceof Model		:this.varModel(v)	;break
			case v instanceof THREE.Mesh:this.scene.add(v)	;break
			default						:super.var(v)
		}
		return this
	}
	varModel(model){
		this.items.push(model)
		this.scene.add(model.mesh)
		return this
	}
	remove(model){
		model.mesh && this.scene.remove(model.mesh)
		let index = this.items.indexOf(model)
		if(index!==-1) this.items.splice(index,1)
		model.dispose()
		return this
	}
}

class Renderer extends THREE.WebGLRenderer{
	constructor(width,height){
		super({alpha:true})
		this.setSize(width,height,false)
	}
}

class Camera extends THREE.PerspectiveCamera{
	constructor(fov,width,height){
		super(fov,width/height,0.1,5000)
		this.position.set(0,0,(height/2)/Math.tan((fov/2)*(Math.PI/180)))
	}
}

export class Model{
	constructor(...a){
		this.mesh = new THREE.Mesh()
		this.add(...a)
	}
	update(){}
	add(...a){
		for(let v of a) switch(true){
			case Array.isArray(v)					:this.varArray(v)		;break
			case v instanceof THREE.BufferGeometry	:this.mesh.geometry = v	;break
			case v instanceof THREE.Material		:this.mesh.material = v	;break
		}
		return this
	}
	varArray(a){
		this.mesh.material = a.map(v=>{
			if(v instanceof THREE.Material) return v
			return new THREE.MeshBasicMaterial(v)
		})
		return this
	}
	dispose(){
		this.mesh.geometry && this.mesh.geometry.dispose()
		let a = this.mesh.material
		for(let m of Array.isArray(a)?a:[a]){
			for(let k in m) {
				if(m[k] && typeof m[k].dispose==='function') m[k].dispose()
			}
			m.dispose()
		}
		return this
	}
}


