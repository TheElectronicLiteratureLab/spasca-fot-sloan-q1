function filterTextModifications( contentFilename ){
        let file = filesWithMetadata[contentFilename]
        if (!file) return

        let contentType = file.contentType

        if ( contentType.includes("text") && contentFilename.endsWith("_modifications.txt")) {
                console.log('it is an modification scheme', contentFilename)
                console.log('try to pass it to parametersViaURL(data)')
		fetch( contentFilename ).then( r => r.text() ).then( txt => {
			const data = new URLSearchParams(txt)
			parametersViaURL(data)
		})
        }
        applyNextFilter( contentFilename )
}

sequentialFilters.push( filterTextModifications )
