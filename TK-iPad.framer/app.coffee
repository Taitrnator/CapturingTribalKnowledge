{Symbol} = require "symbols/Symbol"
{Pointer} = require "Pointer"

flow = new FlowComponent()
flow.showNext(Test_List_View)

#scroll component
scroll = new ScrollComponent
	wrap: ScrollParent
	y: 400
	scrollHorizontal: false
	scrollVertical: true
	backgroundColor: "transparent"
	clip: true

#Operations
class Operation extends Layer
	constructor: (@options={}) ->
		@options.collapseTemplate ?= Operation001_collapsed
		@options.expandTemplate ?= Op30_content
		@options.y ?= 50 
		@.options.expanded ?= false
		_.defaults @options,
			animationOptions: {time: 0.25}
			parent: scroll
			backgroundColor: "transparent"
			height: 50
			width: ScrollParent.width
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
		@.animate 
			time: 0.25
			height: @.height + distance
		#recalc sib height
		for sib in @.siblings
			if sib.y > @.y
				sib.animate
					y: sib.y + distance
	
		@.options.expanded = !@.options.expanded
		
# 		@.height = @.height + @.options.expandTemplate.height
# 		print(@.height)
				
Ops = [
		{collapse: Operation001_collapsed, expand: Op30_content}, 
		{collapse: Operation009_collapsed, expand: Op30_content}, 
		{collapse: Operation20_collapsed, expand: Op30_content}, 
		{collapse: Operation30_collapsed, expand: Op30_content}, 
		{collapse: Operation40_collapsed, expand: Op40_content}, 
		{collapse: Operation50_collapsed, expand: Op50_content}
		]
		
y = 50

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

#Marker Button
class Marker extends Layer 
	constructor: (@options={}) ->
		@options.defaultButton ?= marking_default
		@options.activeButton ?= marking_active
		@options.marked ?= false
		_.defaults @options,
			backgroundColor: "transparent"
			height: 36
			clip: true
		super @options
		
		@options.defaultButton.props = 
			parent: @
			animationOptions: {time: 0.5, curve: Spring}
			x: Align.center
			y: Align.center
			
		@options.activeButton.props = 
			parent: @
			animationOptions: {time: 0.5, curve: Spring}
			x: Align.center
			y: Align.center(36)
		
		@options.activeButton.onTap @ToggleButton
		@options.defaultButton.onTap @ToggleButton
	
	ToggleButton: =>
		A = B = 0
		if @options.marked is false then A = -36 else B = 36
		@options.defaultButton.animate
			y: Align.center(A)
		@options.activeButton.animate
			y: Align.center(B)
		@options.marked = !@options.marked	


#Tip
class Tip extends Layer 
	constructor: (@options={}) ->
		@options.reference ?= reference_pintlehook
		@options.topbar ?= tip_topbar
		@options.bottombar ?= tip_bar
		@options.content ?= content_resistance
		@options.history ?= tip_history1
		_.defaults @options,
			opacity: 0
			backgroundColor: "transparent"
		super @options
		
		@options.reference.props = 
			parent: @
			x: Align.left
			y: Align.top
			
		@options.topbar.props = 
			parent: @
			animationOptions: {time: 0.5, curve: Spring}
			x: Align.left
			y: @options.reference.height
		
		@options.content.props =
			parent: @
			animationOptions: {time: 0.5, curve: Spring}
			x: Align.left(15)
			y: @options.reference.height + @options.topbar.height
			
		@options.bottombar.props =
			parent: @
			animationOptions: {time: 0.5, curve: Spring}
			x: Align.left(15)
			y: @options.reference.height + @options.topbar.height + @options.content.height + 30
		
		@options.history.props = 
			parent: @
			animationOptions: {time: 0.5, curve: Spring}
			x: Align.left(15)
			y: @options.reference.height + @options.topbar.height + @options.content.height + @options.bottombar.height + 45

tips = [
		{
		reference: reference_pintlehook,
		content: content_resistance,
		history: tip_history1
		bottombar: tip_bar
		},
		{
		reference: reference_pathfinder,
		content: content_pathfinder,
		history: history_pathfinder
		bottombar: tip_bar
		}]

tipList = []
findTip = (tipname) ->
	for i in tipList
		if i.name == tipname
			return i

displayTip = (tipname) ->
# 	for item in SidebarParent.children
# 		SidebarParent.removeChild(item)
	
	print("finding #{tipname}")
	active = findTip(tipname).content
	active.props =
		parent: SidebarParent
		x: Align.left
		y: Align.top
		opacity: 1

for obj, i in tips
	tip = new Tip
		reference: obj.reference
		content: obj.content
		bottombar: obj.bottombar
		history: obj.history
		
	button = new Marker
		parent: obj.bottombar
		x: Align.left(-20)
		y: Align.top
		
	item  = { name: "tip_#{i}", content: tip }
	tipList.push(item)
	print(tipList)
	
displayTip("tip_0")

Pintle_Hook_1.onTap (evt, layer) ->
	yval = Pointer.screen(evt, layer).y
	indicator.animate
		time: 0.25
		y: yval
		
	displayTip("tip_1")



