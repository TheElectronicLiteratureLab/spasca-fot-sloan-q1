function filterJSONRef( contentFilename ){
        let file = filesWithMetadata[contentFilename]
        if (!file) return

        let contentType = file.contentType

        if ( contentType.includes("json") && contentFilename.endsWith(".json")) {
                console.log('it is a manual reference JSON file', contentFilename)
		fetch( contentFilename ).then( r => r.json() ).then( json => {
			let ref = json["data-objects"]
			ref.map( (r, i) => {
				let el = addNewNote( r["bibtex-data"].title, "0 "+(1+i/20)+" -.5" )
				// should be able to specify a parent
				el.id = r["object-id"] 
				el.classList.add("reference-entry")
				el.data = r
				// could add some new interaction onreleased/onpicked
				el.setAttribute("onpicked", "console.log( selectedElements.at(-1).element.id )")
				// el.setAttribute("onreleased", "console.log( selectedElements.at(-1).element.id )")
				// could also toggle show/hide onreleased in a target area or close enough to something else
					// show what though? all? "quick" layout engine?
				let fullEl = addNewNote( Object.entries( r["bibtex-data"] )
					.filter( e => e[1] )
					.map( e => e.join(": "))
					.join("\n") , "-.1 "+(1+i/20)+" -.5" )
				fullEl.setAttribute("color", "black")
				fullEl.setAttribute("outline-width", "0")
				// filtering out empty values
				fullEl.setAttribute("rotation", "45 0 0")
				fullEl.setAttribute("scale", ".01 .01 .01")
				fullEl.classList.add("reference-entry-card")
				let backgroundEl = document.createElement("a-box")
				backgroundEl.setAttribute("scale", "10 5 .1")
				backgroundEl.setAttribute("position", "4.5 0 -.1")
				fullEl.appendChild( backgroundEl )
				// if ACM and OA might be available via https://dl.acm.org/doi/pdf/DOI
					// could then try to pass as PDF reader argument
						// cf pageAsTextViaXML() and related in index.html
						// note that it'd still need to fetch then upload via WebDAV
				let pdf = r["bibtex-data"]["source-pdf"] 
				let acmoa = r["bibtex-data"]["free-acm-access"] 
				if (pdf && acmoa && pdf.startsWith("https://dl.acm.org")) {
					// could then try to fetch content then upload via WebDAV
							// should skip if already available
					let pdfEl = document.createElement("a-box")
					//pdfEl.setAttribute("scale", ".1 .1 .1")
					pdfEl.setAttribute("position", "-.9 0 0")
					fullEl.appendChild( pdfEl )
					
					let truncated_filename = "3209542.3209570" // hardcoded example
					// should instead try to fetch .xml on saved/pdfxml/ and if 200 then change color
					if (pdf.endsWith( truncated_filename )) {
						pdfEl.setAttribute("color", "green" )
						//pdfEl.setAttribute("value", "jxr console.log('"+truncated_filename+"')" )
							// what should become the target then? the cube?
							// problematic because it becomes movable
						//pdfEl.setAttribute("target", "" )

						// then should add JXR open of target PDF
						
						/*
						window.pageastextviaxmlsrc = "https://companion.benetou.fr/saved/pdfxml/"+truncated_filename+".xml"
						pageAsTextViaXML()
						highlightcommands.setAttribute("visible", true)
						roundedpageborders.setAttribute("visible", true)
						*/

					}
				}
			})
		})
        }
        applyNextFilter( contentFilename )
}

sequentialFilters.push( filterJSONRef )
