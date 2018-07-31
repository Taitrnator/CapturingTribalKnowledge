{Symbol} = require "symbols/Symbol"
{Pointer} = require "Pointer"

flow = new FlowComponent()

flow.showNext(Main_View)

#scroll component
scroll = new ScrollComponent
	parent: Main_View.content
	y: Align.bottom
	x: Align.left
	width: ScrollParent.width
	height: ScrollParent.height
	scrollHorizontal: false
	scrollVertical: true
	backgroundColor: "transparent"
	
scroll.content.backgroundColor = "transparent"

#Operations
class Operation extends Layer
	constructor: (@options={}) ->
		@options.collapseTemplate ?= Operation001_collapsed.copy()
		@options.expandTemplate ?= Op30_content.copy()
		@options.arrow ?= Arrow.copy()
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
		
		@options.arrow.props = 
			parent: @.options.collapseTemplate
			x: Align.right
			y: Align.center
			
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
			
		@options.arrow.animate
			time: 0.25
			rotatation: 180
			
		#recalc sib height
		for sib in @.siblings
			if sib.y > @.y
				sib.animate
					y: sib.y + distance
	
		@.options.expanded = !@.options.expanded
		
# 		@.height = @.height + @.options.expandTemplate.height
# 		print(@.height)
				
Ops = [
		{collapse: Operation001_collapsed}, 
		{collapse: Operation009_collapsed}, 
		{collapse: Operation20_collapsed}, 
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
		@options.defaultButton ?= marking_default.copy()
		@options.activeButton ?= marking_active.copy()
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
		@options.reference ?= reference_pintlehook.copy()
		@options.topbar ?= tip_topbar.copy()
		@options.content ?= content_resistance.copy()
		@options.bottombar ?= tip_bar.copy()
		@options.history ?= tip_history1.copy()
		_.defaults @options,
			animationOptions: {time: 0.25}
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
		reference: reference_pathfinder,
		topbar: tip_topbar.copy(),
		content: content_pathfinder.copy(),
		history: history_pathfinder.copy(),
		bottombar: tip_bar.copy()
		},
		{
		reference: reference_pintlehook.copy(),
		topbar: tip_topbar.copy(),
		content: content_resistance.copy(),
		history: tip_history1.copy(),
		bottombar: tip_bar.copy()
		}
		{
		reference: reference_airhoses,
		topbar: tip_topbar.copy(),
		content: content_airhoses.copy(),
		history: history_airhoses.copy(),
		bottombar: tip_bar.copy()
		}
		]

tipList = []
findTip = (tipname) ->
	for i in tipList
		if i.name == tipname
			return i

displayTip = (tipname) ->
	for item in SidebarParent.children
		SidebarParent.removeChild(item)
		item.opacity = 0
	active = findTip(tipname).content
	active.props =
		parent: SidebarParent
		x: Align.left
		y: Align.top
		opacity: 1

for obj, i in tips
	tip = new Tip
		reference: obj.reference
		topbar: obj.topbar
		content: obj.content
		bottombar: obj.bottombar
		history: obj.history
		
	button = new Marker
		parent: obj.bottombar
		x: Align.left(-20)
		y: Align.top
		
	obj.topbar.onTap ->
		displayTip("profile_1")
		
	item  = { name: "tip_#{i}", content: tip }
	tipList.push(item)
	
profile1 = new Tip
	reference: profile_reference
	topbar: profile_topbar
	content: profile_content
	bottombar: profile_bottombar
	history: profile_history

profileitem  = { name: "profile_1", content: profile1 }
tipList.push(profileitem)

# Tip Interactions
displayTip("tip_0")

Info.onTap ->
	displayTip("tip_0")
	
Pintle_Hook_1.onTap (evt, layer) ->
	yval = Pointer.screen(evt, layer).y
	indicator.animate
		time: 0.25
		y: yval
	displayTip("tip_1")

Air_Hoses.onTap ->
	displayTip("tip_2")




#Closeout
CloseWAD = () -> 
		scroll.destroy()
		flow.showNext(Closeout_View)
		pageComp = PageComponent.wrap(CloseoutContainer)
		pageComp.scrollVertical = false
		pageComp.scrollHorizontal = false

		pages = [Q1, Q2, Q3, Q4, Q5, Closeout_Done]

		for i in pages 
			pageComp.addPage(i, "bottom")
	
		pageComp.snapToPage(Q1)
		
		#Flows
		answers = [Yes1, Yes2, Yes3, No1, No2, No3, A1, B1, C1, D1, A2, B2, C2, D2, E2]

		for i in [Yes1, No1]
			i.onTap ->
				pageComp.snapToPage(Q2)
		
		for i in [A1, B1, C1, D1]
			i.onTap ->
				pageComp.snapToPage(Q3)

		for i in [A2, B2, C2, D2, E2]
			i.onTap ->
				pageComp.snapToPage(Q4)

		for i in [Yes2, No2]
			i.onTap ->
				pageComp.snapToPage(Q5)

		for i in [Yes3, No3]
			i.onTap ->
				pageComp.snapToPage(Closeout_Done)
		
# 		Finish.onTap ->
# 			MainView()


CloseOut.onTap ->
	CloseWAD()
	

