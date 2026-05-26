


import {SVG,Rect}	from '../js/SVG.js'

export class Member extends SVG{}

export class Field extends SVG{
	constructor(){
		super('Field',{opacity:0.2})
		let a = []
		for(let y=-6;y<=6;y++){
			for(let x=-6;x<=6;x++){
				a.push(new SVG('use',{href:'#Culdcept-Grid'},{x:x*256-128,y:y*256}))
			}
		}
		this.add(a)
	}
}

export class Player extends SVG{
	constructor(width=192,height=256,frame=4){
		super('Character').xform().position(-width/2,-height/2-80)
		let id = 'Character-clip'
		this.add(
			new SVG('clipPath',{id},new SVG('rect',{width,height})),
			{clip_path:`url(#${id})`},
			new SVG('use',{href:'#Culdcept-Player',width:width*frame,height},
				new PlayerAnimate(width,frame)
			),
		)
	}
}

class PlayerAnimate extends SVG{
	constructor(width,frame){
		super('animate')
		let a = []
		for(let i=0;i<frame;i++) a.push(-i*width)
		this.add({
			attributeName:'x',values:a.join(';'),dur:'1s',
			calcMode:'discrete',repeatCount:'indefinite',
		})
	}
}

export class Cards extends Array{
	position(x,y){
		this.x = x
		this.y = y
		return this.update()
	}
	add(...cards){
		this.push(...cards)
		return this.update()
	}
	remove(card){
		card.remove()
		let i = this.indexOf(card)
		if(i!==-1) this.splice(i,1)
		return this.update()
	}
	rotate(v){
		this.forEach(card=>card.rotate(v))
		return this
	}
	update(){
		//this.forEach((v,i)=>v.position(this.x+204*i,this.y))
		this.forEach((v,i)=>v.position(this.x+196*i,this.y))
		return this
	}
}

export class Exit extends SVG{
	constructor(x,y){
		super('Card').position(x,y)
		let rect = new Rect(-100,-140,200,280)
		this.add(
			{font_size:50,text_anchor:'middle'},
			new SVG('use',{href:'#Culdcept-Exit'},rect),
			new SVG('text','終了',{x:0,y:-50,stroke:'#fff',stroke_width:8}),
			new SVG('text','終了',{x:0,y:-50}),
			new SVG('rect Button',rect,{fill:'transparent'}).data({type:'EXIT_BUTTON'})
		)
	}
}


