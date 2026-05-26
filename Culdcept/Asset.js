


import {SVG,Rect}	from '../js/SVG.js'
import {SVGLoader}	from '../js/SVGLoader.js'

export class Loader extends SVG{
	constructor(done){
		super('def Asset')
		new SVGLoader('Culdcept.svg',images=>{
			this.add(images.map(v=>v.getSymbol()))
			this.images			= images
			this.items			= images.filter(v=>v.id.startsWith('Culdcept-C'))
			this.elementFrames	= this.getImages('Culdcept-ElementFrame')
			this.elementIcons	= this.getImages('Culdcept-ElementIcon')
			this.typeIcons		= this.getImages('Culdcept-TypeIcon')
			this.back			= images.find(v=>v.id==='Culdcept-B01')
			done(this)
		})
	}
	getImages(prefix){
		let a = this.images.filter(v=>v.id.startsWith(prefix))
		a.forEach(v=>v.key = v.id.split('-').pop())
		return a
	}
	random(items){
		let a = items||this.items
		return a[Math.floor(Math.random()*a.length)]
	}
	getCreatures(){return this.items.map(v=>new Creature(v,this))}
}

export class Creature{
	static element	= {N:'Neutral',F:'Fire',W:'Water',E:'Earth',A:'Air'}
	static type		= {H:'Human',A:'Animal',D:'Dragon',P:'Plant',U:'Undead'}
	constructor(image,asset){
		let s			= image.id.slice(-2)
		this.id			= image.id
		this.element	= Creature.element[s[0]]
		this.type		= Creature.type[s[1]]
		this.strength	= this.random(10,50)
		this.hitPoint	= this.random(20,60)
		this.cost 		= this.random(30,(this.strength+this.hitPoint)*1.5)
		this.image		= image
		this.frame		= asset.elementFrames.find(v=>v.key===this.element)
		this.back		= asset.back
	}
	random(a,b)			{return Math.floor((a + (b-a)*Math.random())/10)*10}
	get elementFrame()	{return `Culdcept-ElementFrame-${this.element}`}
	get elementIcon()	{return `Culdcept-ElementIcon-${this.element}`}
	get typeIcon()		{return `Culdcept-TypeIcon-${this.type}`}
}


