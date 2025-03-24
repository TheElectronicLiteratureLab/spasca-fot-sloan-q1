// inspired by http://expressjs.com/en/guide/using-middleware.html

function filterImage( contentFilename ){
	let file = filesWithMetadata[contentFilename]
	if (!file) return

	let contentType = file.contentType

	if ( contentType.includes("image") ) {
		console.log('normal image', contentFilename)
		let fullPath = contentFilename
		let el = document.createElement("a-image")
		AFRAME.scenes[0].appendChild(el)
		el.setAttribute("position", "0 "+(Math.random()+1)+" -1")
		el.setAttribute("src", fullPath)
		el.setAttribute("target", "")
		el.id = fullPath.replaceAll('.','')
		el.filename = fullPath
	}
	applyNextFilter( contentFilename )
}

sequentialFilters.push( filterImage )

function filterGlbOrGltf( contentFilename ){
	let file = filesWithMetadata[contentFilename]
	if (!file) return

	let contentType = file.contentType

	if ( contentType.includes("model/gl") && (contentFilename.endsWith('gltf') || contentFilename.endsWith('glb') ) ) {
		let el = document.createElement("a-gltf-model")
		AFRAME.scenes[0].appendChild(el)
		el.setAttribute("src", contentFilename)
		el.setAttribute("target", "")
	}
	applyNextFilter( contentFilename )
}

sequentialFilters.push( filterGlbOrGltf )
