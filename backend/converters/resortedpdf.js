const {execSync} = require('child_process')

function convert( filename, pages ){
console.log(pages)
	if (filename.endsWith('.pdf')) {
		execSync( 'qpdf '+filename+' --pages '+filename+' '+pages.join(',')+' -- ./saved/pdf/'+filename, {cwd:'public'})
	}
}

module.exports.convert = convert
