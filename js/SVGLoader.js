


import {SVG}	from './SVG.js'

export class SVGLoader{
	constructor(src,resolve){
		this.src = src
		if(resolve) this.then(resolve)
	}
	then(resolve){
		return fetch(this.src).then(r=>r.text()).then(content=>{
			let svg = new DOMParser().parseFromString(content,'image/svg+xml')
			let images = this.parse(svg)
			while(svg.firstChild) svg.removeChild(svg.firstChild)
			content = svg = null
			resolve(images)
		})
	}
	parse(svg){
		if(svg.querySelector('parsererror')) return []
		let s = this.src.split('/').pop().split('.').shift()
		let a = Array.from(svg.querySelectorAll('image[id]'))
		return a.map(n=>{
			let image = new Slice(n,s)
			n.removeAttribute('href')
			n.removeAttribute('xlink:href')
			return image
		})
	}
}

class Slice{
	constructor(n,prefix){
		this.id		= n.getAttribute('id')
		this.href	= this.getHref(n)
		this.width	= Number(n.getAttribute('width'))
		this.height	= Number(n.getAttribute('height'))
		if(prefix)	this.id = prefix+'-'+this.id
	}
	getHref(n){
		let png		= /^data:(image|\w+)\/png;base64,iVBORw/ //Adobe OK
		let href	= n.getAttribute('href')||n.getAttribute('xlink:href')
		if(href && png.test(href)) return href
		return null 
	}
	getSymbol(w,h){
		let width	= w||this.width
		let height	= h||this.height
		let viewBox = `0 0 ${width} ${height}`
		let attribute = {id:this.id,width,height,viewBox,preserveAspectRatio:'none'}
		return new SVG('symbol',attribute,new SVG('image',{href:this.href}))
	}
	getUse(){
		return new SVG('use',{href:'#'+this.id})
	}
	toString(w,h){
		let width	= w||this.width
		let height	= h||this.height
		return `<image href="${this.href}" width="${width}" height="${height}" />`
	}
}


