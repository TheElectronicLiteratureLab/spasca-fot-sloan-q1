const {execSync} = require('child_process')

function convert( filename ){
	if (filename.endsWith('.pdf')) {
		execSync( 'cp ../../'+filename+' . && pdftohtml -xml '+filename,{cwd:'public/saved/pdfxml'})
		fetch('https://ntfy.benetou.fr/convertedwebdav', { method: 'POST', body: JSON.stringify({source: filename, extension: '.xml' }) })
		// could also update a file of conversions to keep track of provenance
	}
}

module.exports.convert = convert
