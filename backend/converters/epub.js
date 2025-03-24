const fs = require('fs'); 

function convert( filename, pages ){
console.log(pages)
	if (filename.endsWith('.pdf')) {
		let data = pages.map( p => "<img src='/"+filename+'-'+p+".jpg'/>").join('<br>')
		// could have a richer datastructure with e.g. p.number for the page number and p.x and p.y for CSS absolute positioning
		// probably need to apk add zip then zip the result
		const outputFile = './public/saved/epub/'+filename+'.epub' 
		fs.writeFileSync(outputFile, data); 
	}
}

module.exports.convert = convert
