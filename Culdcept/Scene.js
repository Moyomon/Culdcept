


import * as Tween	from './Tween.js'
import * as Dialog	from './Dialog.js'

export class Manager{
	constructor(...a){
		this.items = a
		this.state = null
		this.table = {}
		for(let v of a) this.table[v.node.id.toLowerCase()] = v
	}
	change(state){
		this.state && this.state.exit(this)
		this.state = state
		this.state.scene = this
		this.state.enter(this)
		return this
	}
	add(...a){
		for(let v of a){
			if(v==null) continue
			let layer = this.items.find(layer=>layer.match(v))
			layer && layer.add(v)
		}
		return this
	}
	clear(...a){
		let items = this.items
		if(a.length) items = a.map(s=>this.table[s]).filter(Boolean)
		for(let v of items) v.clear()
		return this
	}
	event(...a){
		this.state && this.state.dispatch(Object.assign({},...a))
		return this
	}
	property(p){
		for(let [k,v] of Object.entries(p)) this[k] = v
		return this
	}
}

class State{
	constructor(...a){
		this.event = {}
		this.add(...a)
	}
	enter(){return this}
	exit(){return this}
	dispatch(e){
		console.log(e)
		if(e.id) e.card = this.scene.hand.get(e.id)
		this.event[e.type] && this.event[e.type](e)
		return this
	}
	add(...a){
		Object.assign(this.event,...a)
		return this
	}
}

export class Phase extends State{
	constructor(...a){
		super().add({TWEEN_COMPLETE:e=>{
			this.scene.clear('graphic')
		}},...a)
	}
	openWindow(dialog){
		this.scene.add(new Dialog.Status(this.card),dialog)
		return this
	}
	closeWindow(tween){
		this.scene.clear('modal','stage')
		this.card = null
		this.entity.change(tween)
		return this
	}
	previewCard(label,card){
		this.scene.clear('modal')
		this.scene.add(label,card && new Dialog.Status(card))
		return this
	}
	action(tween){
		this.scene.clear('modal','stage')
		this.scene.hand.remove(this.card)
		this.card = null
		this.entity.change(tween)
		return this
	}
	next(phase){
		this.entity = null
		this.scene.change(phase)
		return this
	}
}


