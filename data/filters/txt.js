function filterTextModifications( contentFilename ){

        let idFromFilename = contentFilename.replaceAll('.','') // has to remove from proper CSS ID

        let file = filesWithMetadata[contentFilename]
        if (!file) return

        let contentType = file.contentType

        if ( contentType.includes("text") && contentFilename.endsWith(".txt")) {
		fetch( contentFilename ).then( r => r.text() ).then( txt => {
			let el = addNewNote( txt )
			el.id = idFromFilename
		})
        }
        applyNextFilter( contentFilename )
}

sequentialFilters.push( filterTextModifications )
