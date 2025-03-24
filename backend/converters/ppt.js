const {execSync} = require('child_process')

function convert( filename ){
	if (filename.endsWith('.ppt')) {
		execSync( 'soffice '+filename+' '+filename+'.jpg', {cwd:'public'})
		fetch('https://ntfy.benetou.fr/convertedwebdav', { method: 'POST', body: JSON.stringify({source: filename, extension: '.jpg' }) })
		// could also update a file of conversions to keep track of provenance
	}
}

module.exports.convert = convert
