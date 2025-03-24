function filterTextModifications( contentFilename ){
        let file = filesWithMetadata[contentFilename]
        if (!file) return

        let contentType = file.contentType

        if ( contentType.includes("subrip") && contentFilename.endsWith(".srt")) {
                console.log('it is an modification scheme', contentFilename)
                console.log('try to pass it to parametersViaURL(data)')
		fetch( contentFilename ).then( r => r.text() ).then( txt => {
			console.log(txt.split(/$\n/).map(l=>{
				let subItem = l.split('\n')
				let timings = subItem[1].split(' --> ')
				return { id:Number(subItem[0]), timingStart:timings[0], timingEnd:timings[1], text:subItem[2] }
			} ))
		})
        }
        applyNextFilter( contentFilename )
}

sequentialFilters.push( filterTextModifications )
