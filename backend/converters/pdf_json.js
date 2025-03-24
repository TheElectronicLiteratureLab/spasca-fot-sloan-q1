const {execSync} = require('child_process')

function convert( filename ){
	if (filename.endsWith('.pdf')) {
		execSync( 'node ../extract_as_json.js public/'+filename,{cwd:'public'})
		fetch('https://ntfy.benetou.fr/convertedwebdav', { method: 'POST', body: JSON.stringify({source: filename, extension: '.json' }) })
		// could also update a file of conversions to keep track of provenance
	}
}

module.exports.convert = convert
