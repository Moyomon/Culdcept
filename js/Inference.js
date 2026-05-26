
class Inference{
	var(v){
		if(v==null)	return this
		switch(typeof v){
			case 'boolean'	:return this
			case 'object'	:return this.varObject(v)	
			case 'string'	:return this.varString(v)
			case 'function'	:return this.varFunction(v)
			case 'number'	:return this.varNumber(v)
		}
		console.warn('Unknown type:',v)
		return this
	}
	varObject(v){
		if(v==null)	return this
		let p = Object.getPrototypeOf(v)
		if(p===Object.prototype)	return this.varProperty(v)
		if(p===null)				return this.varProperty(v)
		return this
	}
	varArray(a)		{for(let v of a) this.var(v);return this}
	varProperty(v)	{for(let a of Object.entries(v)) this.varEntry(...a);return this}
	varString()		{return this}	varNumber()	{return this}
	varFunction()	{return this}	varEntry()	{return this}
	add(...a)		{
		for(let v of a) Array.isArray(v)?this.varArray(v):this.var(v)
		return this
	}
}

export class View extends Inference{//v5m
	constructor(...a){
		super()
		let args = this._shorthand(a)
		this.node = args.shift()||this.createElement()
		this.add(...args)
	}
	varObject(v){
		if(v instanceof View) return this.varNode(v.node)
		if(v instanceof Node) return this.varNode(v)
		return super.varObject(v)
	}
	varEntry(k,v){
		if(typeof v==='function') return this.varListener(k,v)
		return this.varAttribute(k,v)
	}
	varFunction(v)		{this.varListener('click',v);return this}
	varNumber(v)		{this.varString(v.toString());return this}
	varString(v)		{this.varNode(document.createTextNode(v));return this}
	varNode(v)			{this.node.appendChild(v);return this}//iOS10
	varListener(k,v)	{this.node.addEventListener(k,v);return this}
	varAttribute(k,v)	{this.node.setAttribute(k,v);return this}

	remove()		{this.node.remove();return this}
	replace(...a)	{this.node.textContent='';return this.add(...a)}
	display(v)		{return this.style({display:v?null:'none'})}
	data(v)			{return v?this._set(this.node.dataset,v):this}
	style(v)		{return v?this._set(this.node.style,v):this}
	class(...a){
		let force = typeof a.slice(-1)[0]==='string'||Boolean(a.pop())
		for(let s of a) s && this.node.classList.toggle(s,force)
		return this
	}
	createElement(s){return document.createElement(s||'div')}
	getElement(s)	{return this.node.querySelector(s)}
	getElements(s)	{return Array.from(this.node.querySelectorAll(s))}
	_set(p,o)		{for(let[k,v] of Object.entries(o)) p[k]=v;return this}
	_shorthand([v,...args]){
		if(v instanceof Element) return [v,...args]
		if(typeof v!=='string')	 return [null,v,...args]
		if(v.startsWith('#'))	 return [document.getElementById(v.slice(1)),...args]
		let tokens = v.trim().replace(/\s+/g,'.').split('.')
		let n = this.createElement(/^[a-z]/.test(tokens[0])?tokens.shift():'')
		for(let name of tokens) name && n.classList.add(name)
		return [n,...args]
	}
	get deploy(){return /^(localhost|\d+\.)/.test(location.hostname)===false}
}

//fallback

if(!Object.fromEntries) Object.fromEntries = a=>{//iOS<12
	let o = {}
	for(let [k,v] of a) o[k] = v
	return o
}

if(!Object.entries) Object.entries = o=>{//iOS<10
	let a = [], has = Object.prototype.hasOwnProperty
	for(let k in o) has.call(o,k) && a.push([k,o[k]])
	return a
}
