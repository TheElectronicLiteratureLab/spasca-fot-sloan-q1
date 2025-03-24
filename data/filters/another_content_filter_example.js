function filterSVGImage( contentFilename ){
        let file = filesWithMetadata[contentFilename]
        if (!file) return

        let contentType = file.contentType

        if ( contentType.includes("image") && contentFilename.endsWith(".svg")) {
                console.log('it is an SVG image', contentFilename)
        }
        applyNextFilter( contentFilename )
}

sequentialFilters.push( filterSVGImage )
