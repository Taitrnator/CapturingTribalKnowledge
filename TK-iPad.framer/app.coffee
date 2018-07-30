{Symbol} = require "symbols/Symbol"
#scroll component



scroll = new ScrollComponent
	parent: ScrollParent
	width: ScrollParent.width
	height: ScrollParent.height
	scrollHorizontal: false
	scrollVertical: true
	backgroundColor: "#eee"
	x: Align.center
	y: Align.center


#Operations
OperationList = [{op: Operation30, buyoffOrder: 1, opOrder: 1},
				{op: Operation40, buyoffOrder: 3, opOrder: 2},  
				{op: Operation50, buyoffOrder: 2, opOrder: 3}]

opList = []	
sortBuyoff = (a, b) ->
	return a.buyoffOrder - b.buyoffOrder

toggleExpand = (layer, distance) ->
	distance = if layer.expanded is false then distance else -distance
	layer.animate
		height: layer.height + distance
		
	#recalc sib height
	for sib in layer.siblings
		if sib.y > layer.y
			sib.animate
				y: sib.y + distance
	
	layer.expanded = !layer.expanded
		
	scroll.updateContent()

collapseHeight = 50

generateList = (array) ->
	rows = []
	
	for row, i in array
		row.op.maxHeight = row.op.height
		row.op.props = 
			parent: scroll.content
			x: 10
			clip: true
			y: 10 + (collapseHeight * i)
			height: 50
			animationOptions: {time: 0.25}
	
		row.op.expanded = false
		
		row.op.onClick -> 
			toggleExpand(@, @.maxHeight)
			
		rows.push(row)
	
	scroll.updateContent()	
	return rows

#initial list
opList = generateList(OperationList)

Resort.onTap ->
	opList.sort(sortBuyoff)
	generateList(opList)
	
	

Pintle_Hook.onTap -> 
	print('bar')