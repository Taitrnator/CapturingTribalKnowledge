{Symbol} = require "symbols/Symbol"

#scroll component
scroll = new ScrollComponent
	wrap: ScrollParent
	width: ScrollParent.width
	height: ScrollParent.height
	scrollHorizontal: false
	scrollVertical: true
	backgroundColor: "transparent"
	x: Align.center
	y: Align.center


#Operations
class Operation extends Layer
	constructor: (@options={}) ->
		@options.collapseTemplate ?= op_collapsed
		@options.expandTemplate ?= Op70Content
		@options.y ?= 50 
		@.options.expanded ?= false
		_.defaults @options,
			animationOptions: {time: 0.25}
			parent: scroll
			backgroundColor: "transparent"
			height: 50
			width: scroll.width
			y: @options.y
			clip: true
		super @options

		@options.collapseTemplate.props = 
			parent: @
			x: Align.center
			y: Align.top
			
		@options.expandTemplate.props = 
			parent: @
			x: Align.center
			y: Align.top(50)
			
		@options.collapseTemplate.onTap @ToggleExpand 
		#function
		
	ToggleExpand: => 
		range = @.options.expandTemplate.height + 50
		distance = if @.options.expanded is false then range else -range
		@.height = @.height + distance
		#recalc sib height
		for sib in @.siblings
			if sib.y > @.y
				sib.animate
					y: sib.y + distance
	
		@.options.expanded = !@.options.expanded
		
# 		@.height = @.height + @.options.expandTemplate.height
# 		print(@.height)
				
Ops = [{collapse: Operation30_collapsed, expand: Op30_content}, {collapse: Operation40_collapsed, expand: Op40_content}, {collapse: Operation50_collapsed, expand: Op50_content}]

y = 0

for i in Ops
	Op = new Operation
		collapseTemplate:  i.collapse
		expandTemplate: i.expand
		y: y
	
	y = y + 50
		
	
	
# pageComp = PageComponent.wrap(Questions)
# pageComp.scrollVertical = false
# pageComp.scrollHorizontal = false
# 
# pages = [Q1, Q2, Q3, Q4, Q5, Closeout_Done]
# 
# for i in pages 
# 	pageComp.addPage(i, "bottom")
# 	
# pageComp.snapToPage(Q1)

tipComp = PageComponent.wrap(SidebarParent)
tipComp.scrollVertical = true
tipComp.scrollHorizontal = false

tips = [tip_pathfinder, tip_technician, tip_technician_2, tip_manual, tip_lessonslearned]

for i in tips
# 	mkr = new Marker
# 		parent: i
# 		x: Align.left(5)
# 		y: Align.top(8)
# 	
	tipComp.addPage(i)

tipComp.snapToPage(tip_pathfinder)

Pintle_Hook_1.onTap (evt) ->
	tipComp.snapToPage(tip_technician)

Info.onTap ->
	tipComp.snapToPage(tip_pathfinder)