/* potential improvements

event on state switch, e.g. thumb up to thumb down or whatever to thumb down
	but NOT thumb down to thumb down
sustained state, e.g. thumb down to thumb down for N seconds
extend proximityBetweenJointsCheck to any object3D or from 1 object3D to a class of entities (which themselves are object3D)
generalize showGestureDebug to any joint, not just thumb-tip of right hand

*/

targetGesture = {"microgesture":{"type":"glyph","action":"Extension","context":["Contact","Air"],"parameters":{"pressure":{"start":null,"end":null,"type":"no_end"},"amplitude":{"start":null,"end":null,"type":"no_end"},"time":{"start":null,"end":null,"leftType":"none","rightType":"bigger"}},"actuator":[["thumb"]],"phalanx":[]}}
// supports both hands

const fingersNames = ["index-finger", "middle-finger", "ring-finger", "pinky-finger","thumb"]
const tips = fingersNames.map( f => f+"-tip" )
const thumbParts = ["metacarpal", "phalanx-proximal", "phalanx-distal"] // no phalanx-intermediate for thumb
const fingerParts = thumbParts.concat(["phalanx-intermediate"])
const fingers = tips.concat( thumbParts.map( f => fingersNames.at(-1)+"-"+f ), fingerParts.flatMap( fp => fingersNames.slice(0,4).map( fn => fn+"-"+fp) ) )
const allJointsNames = ["wrist"].concat( fingers ) // also has wrist, no fingers
// console.log( allJointsNames.sort() )

function shortVec3(v){ return {x:v.x.toFixed(3), y:v.y.toFixed(3), z:v.z.toFixed(3)} } ;

// assumes joints, could be generalized to any Object3D
function proximityBetweenJointsCheck(joints){
	const thresholdDistance = .008
	// contacts even while hands resting
	// 2cm : 8
	// 1cm : 4
	// 9mm : 2
	// 8mm : 0 ... but also prevents some contacts, e.g. finger tips accross fingers
		// consequently would have to identify which contacts take place at rest
			// might be from within same finger and thus potentially to filter out when "next" to each other joint
				// e.g. finger tip could physiologically touch own metacarpal but no phalanx
					// BUT it can for the same finger on the other hand

	let contacts = []
	
	let combinations = joints.flatMap( (v, i) => joints.slice(i+1).map( w => [v, w] ))
		// from https://stackoverflow.com/a/43241287/1442164

	combinations.map( j => {
		let rt = j[0].position
		let lt = j[1].position
		//console.log( 'checking: ', rt, lt )
		let dist = rt.distanceTo(lt) 
		if ( dist < thresholdDistance ) {
			contacts.push( {dist: dist.toFixed(3), a:j[0].name, ah: j[0].parent.parent.el.id, b:j[1].name, bh: j[1].parent.parent.el.id } )
			// assumes a bone, could check first on type, otherwise can have different behavior
			// could add the timestamp and position value at that moment
		}
	})

	return contacts
	// getting up to 45 contacts checking 5 finger tips on each hand, which is correct for C10,2
}

// could also attach the value then show next to the joint
let debugValue = {}

function addDebbugGraph(){
	el = document.createElement("a-box")
	el.id = "debuggraph"
	el.setAttribute("scale", "1 .3 .01")
	el.setAttribute("position", "0 1.4 -1")
	AFRAME.scenes[0].appendChild(el)
}

// used an array of points, e.g. pos.x over time, thus every 50ms xTimeSeries.push(pos.x)
function drawPoints(points){
	if (debugValue.length<10) return
	let canvas = document.createElement('canvas');
	canvas.width = 1000;
	canvas.height = 100 * Object.values( points).length

	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// might want to append (and thus track status) in in order to show the result live
		// or "just" take the last 10 elements of array
		// middle should be 0... as we can go negative on that axis
	//points.slice(-10).map( (p,n) => {
	let verticalOffsetSize = 50
	Object.values( points).map( (v,i) => {
		ctx.beginPath()
		ctx.moveTo(0, 0)
		let values = v
		if (v.length > 100) values = v.slice(-100)
		ctx.strokeStyle = "black";
		values.map( (p,n) => {
			let value = Math.floor( 100-1+p*100 )
			ctx.lineTo(n*10, value+i*verticalOffsetSize)
			ctx.moveTo(n*10, value+i*verticalOffsetSize)
			if (value>100-10 && value<100+10) {
				console.log('customgesture', value)
				AFRAME.scenes[0].emit('customgesture')
				ctx.strokeStyle = "green";
			}
			
		})
		ctx.stroke()
	})
	ctx.beginPath()
	ctx.moveTo(0, 100-10)
	ctx.lineTo(canvas.width, 100-10)
	ctx.moveTo(0, 100+10)
	ctx.lineTo(canvas.width, 100+10)
	ctx.strokeStyle = "red";
	ctx.stroke()
	let el = document.getElementById("debuggraph")
	el.setAttribute("src", canvas.toDataURL() ) // somehow works on other canvas...
	// el.object3D.children[0].material.needsUpdate = true
	//console.log( el.src ) // works but does not update
	return el
}

// should be a component instead...
setTimeout( _ => {
	const myScene = AFRAME.scenes[0].object3D
	/*
	setInterval( i => {
		if (!myScene.getObjectByName("l_handMeshNode") ) return
		const wrist = myScene.getObjectByName("r_handMeshNode").parent.getObjectByName("wrist")
		let sum = Math.abs(wrist.rotation.y) + Math.abs(wrist.rotation.y) + Math.abs(wrist.rotation.z) 
		console.log( sum )
		if ( sum < .3 ) cubetest.setAttribute("position") = wrist.position // doesn't look good, cube on wrist is moving quite a bit too
		// could check if all joints have close to 0 rotation on ...
			// are roughly on the same y-plane of the wrist (facing up or down)
	}, 500 )
	*/
	/*
	gestureThumbEndingAnyContact = setInterval( i => {
			if (!myScene.getObjectByName("l_handMeshNode") ) return
			// potential shortcuts :
			const leftHandJoints = myScene.getObjectByName("l_handMeshNode").parent.children.filter( e => e.type == "Bone")
			const rightHandJoints = myScene.getObjectByName("r_handMeshNode").parent.children.filter( e => e.type == "Bone")
			const allHandsJoints = leftHandJoints.concat( rightHandJoints )

			let posA = myScene.getObjectByName("r_handMeshNode").parent.getObjectByName("thumb-tip").position
			let contactPointsToThumbA = leftHandJoints
			.concat( rightHandJoints[0].parent.children.filter( e => e.name != 'thumb-tip' ) ) // right hand except thumb tip
			.map( e => e.position.distanceTo(posA) ).filter( d => d < .02 ) // threshold of 2cm distance (must be bigger than thumb-tip to previous join position)
											// relatively compact description and maybe relatively computively cheap
			let pos = myScene.getObjectByName("l_handMeshNode").parent.getObjectByName("thumb-tip").position
			let contactPointsToThumb = rightHandJoints
			.concat( leftHandJoints[0].parent.children.filter( e => e.name != 'thumb-tip' ) ) // right hand except thumb tip
			.map( e => e.position.distanceTo(pos) ).filter( d => d < .02 ) // threshold of 2cm distance (must be bigger than thumb-tip to previous join position)
			if (contactPointsToThumb.length+contactPointsToThumbA.length < 1) console.log('no contact'); else console.log('thumb tip in contact with same hand or other hand')
			// on contact could also return the join number/names
	}, 500 )
	*/

	/*
	testAvegageValue = setInterval( i => {
		if (!myScene.getObjectByName("r_handMeshNode") ) return
		let rt = myScene.getObjectByName("r_handMeshNode").parent.getObjectByName("thumb-tip");
		debugValue.x.push( rt.position.x )
		let v = debugValue.x
		const windowSize = 10 // otherwise too long, e.g 100x500ms gives 5s average
		if (v.length > windowSize) {
			values = v.slice(-windowSize)
			let avg  = ( values.reduce( (acc,c) => acc+c )/windowSize) .toFixed(3)
			console.log( avg )
		}
	}, 50 )
	*/

	/*
	showContactPoints = setInterval( i => {

		if (!myScene.getObjectByName("r_handMeshNode") ) return
		let targetJoints = []
		tips.map( t => targetJoints.push( myScene.getObjectByName("r_handMeshNode").parent.getObjectByName(t) ) )
		tips.map( t => targetJoints.push( myScene.getObjectByName("l_handMeshNode").parent.getObjectByName(t) ) )
			// tips only
		let contacts = proximityBetweenJointsCheck(targetJoints) 
		if (contacts.length) {
			console.log( "contacts:", contacts )
			// {dist: dist.toFixed(3), a:j[0].name, ah: j[0].parent.parent.el.id, b:j[1].name, bh: j[1].parent.parent.el.id }
			contacts.map( c => {
				// show value or even just a temporary object there
				let a = document.getElementById(c.ah).object3D.getObjectByName(c.a)
				let b = document.getElementById(c.bh).object3D.getObjectByName(c.b)
				const geometry = new THREE.BoxGeometry( .01, .01, .01 )
				const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
				const cube = new THREE.Mesh( geometry, material )
				a.add( cube )

			})
		}
	})
	*/

	/*
	showGestureDistanceDebugJoints = setInterval( i => {

		if (!myScene.getObjectByName("r_handMeshNode") ) return
		let targetJoints = []
		tips.map( t => targetJoints.push( myScene.getObjectByName("r_handMeshNode").parent.getObjectByName(t) ) )
		tips.map( t => targetJoints.push( myScene.getObjectByName("l_handMeshNode").parent.getObjectByName(t) ) )
			// console.log( targetJoints ) looks fine
		//console.log( "contacts:", proximityBetweenJointsCheck(targetJoints)
			// tips only
		let targetJointsFull = []
		allJointsNames.map( t => targetJointsFull.push( myScene.getObjectByName("r_handMeshNode").parent.getObjectByName(t) ) )
		allJointsNames.map( t => targetJointsFull.push( myScene.getObjectByName("l_handMeshNode").parent.getObjectByName(t) ) )
		let contacts = proximityBetweenJointsCheck(targetJointsFull) 
		if (contacts.length) console.log( "contacts:", contacts )
	})
	*/

	/*
	showGestureDistanceDebug = setInterval( i => {
		if (!myScene.getObjectByName("r_handMeshNode") ) return
		let rt = myScene.getObjectByName("r_handMeshNode").parent.getObjectByName("thumb-tip").position
		let lt = myScene.getObjectByName("l_handMeshNode").parent.getObjectByName("thumb-tip").position
		if ( rt.distanceTo(lt) < .1 )
			console.log( 'lt close to rt')
		else
			console.log( rt.distanceTo(lt) ) 
	})
	*/

	/*
	showGestureDebug = setInterval( i => {
		if (!myScene.getObjectByName("r_handMeshNode") ) return
		let rt = myScene.getObjectByName("r_handMeshNode").parent.getObjectByName("thumb-tip");
		//console.log( shortVec3( rt.position ), shortVec3( rt.rotation ) )
		// could do for the 2x25 values... but then becomes unreadible, hence why showing sparklines could help
			// can be done on HUD

		if (!debugValue.x){
			debugValue.x = []
			debugValue.y = []
			debugValue.z = []

			debugValue.a = []
			debugValue.b = []
			debugValue.c = []
		}

		debugValue.x.push( rt.position.x )
		debugValue.y.push( rt.position.y )
		debugValue.z.push( rt.position.z )

		debugValue.a.push( rt.rotation.x )
		debugValue.b.push( rt.rotation.y )
		debugValue.c.push( rt.rotation.z )

		let el = document.getElementById("debuggraph")
		if (!el) addDebbugGraph()
		drawPoints( debugValue )
	}, 50 )
	*/
}, 1000)
// waiting for the scene to be loaded, could be component proper too...
