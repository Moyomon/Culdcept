


import {SVG,Rect}	from '../js/SVG.js'

class Dialog extends SVG{
	constructor(x,y,w,h){
		super().position(x,y)
		let border = {fill:'transparent',stroke:'#ccf',stroke_width:4}
		let p = 6
		this.add(
			new SVG('rect',{fill:'#101050c0'}).rect(0,0,w,h),
			new SVG('rect',border).rect(p,p,w-p*2,h-p*2),
		)
	}
}

export const Member = Dialog

export class Status extends Dialog{
	constructor(card){
		super(100,-480,560,680).class('Detail')
		this.add(
			new Use('Culdcept-Status-ST',	35,	192),
			new Use('Culdcept-Status-HP',	213,192),
			new Use('Culdcept-Status-MHP',	391,192),
			new Use('Culdcept-Status-Cost',	35,	270),
			new Use(card.data.elementIcon,	425,110),
			new Use(card.data.typeIcon,		485,110),
			new DialogText('カードのなまえ',75),
			new DialogText('クリーチャー',75).row(1),
			new StatusValue(card.data.strength,1,2),
			new StatusValue(card.data.hitPoint,2,2),
			new StatusValue(card.data.hitPoint,3,2),
			new StatusValue(card.data.cost,1,3),
			new DialogText('カードID：',75).row(4.5),
			new DialogText(card.data.id,75).row(5.5),
		)
	}
}

class StatusValue extends SVG{
	constructor(s,x,y){
		super('text Number',s,{fill:'#fff',text_anchor:'end'})
		this.add({font_size:65,x:178*x-12,y:55+78*y})
	}
}

export class Guide extends Dialog{
	constructor(s){
		let rows = s.split("\n").map((s,i)=>new DialogText(s,70).row(i))
		let h = rows.length*70
		super(-660,-100-h/2,Math.max(...rows.map(v=>v.width)),40+h)
		this.add(rows)
	}
}

export class Draw extends Dialog{
	constructor(s){
		let text = new DialogText(s,70)
		let w = text.width
		super(-w/2,330,w,110)
		this.add(text)
	}
}

export class Confirm extends Dialog{
	constructor(s){
		let text = new DialogText(s,70)
		let w = text.width
		super(-w/2,220,w,250).class('Confirmation')
		let rect = new Rect(20,90,w-40,70)
		this.add(
			new Button({type:'DIALOG_OK'},rect),
			new Button({type:'DIALOG_CANCEL'},rect,{y:160}),
			new DialogText(s,70),
			new DialogText('はい',70).row(1),
			new DialogText('いいえ',70).row(2),
		)
	}
}

class DialogText extends SVG{
	constructor(s,h){
		super('text',s).add({fill:'white'})
		this.text = s
		this.height = h
		let font_size = Math.round(h/1.4)
		let x = 20 + Math.round((h-font_size)*0.3)
		let y = 20 + Math.round(h*0.45)
		this.add({x,y,font_size})
		this.x = x
		this.fontSize = font_size
	}
	get width(){
		return Math.round(this.fontSize*this.text.length+this.x*2)
	}
	row(i){return this.add({dy:Math.round(this.height*i)})}
}

class Button extends SVG{
	constructor(event,...a){
		super('rect Button',{fill:'transparent'},...a).data(event)
	}
}

class Use extends SVG{
	constructor(id,x,y){super('use',{href:'#'+id,x,y})}
}


