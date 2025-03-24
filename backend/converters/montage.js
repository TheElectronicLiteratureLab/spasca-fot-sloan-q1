const {execSync} = require('child_process')

function convert( filename, pages ){
console.log(pages)
	if (filename.endsWith('.pdf')) {
		execSync( 'montage -font /usr/share/fonts/noto/NotoSansSymbols-Regular.ttf -geometry +0+0 -tile 5x '+pages.map( p => filename+'-'+p+'.jpg').join(' ')+' ./saved/montages/'+filename+'montage.jpg', {cwd:'public'})
	}
}

module.exports.convert = convert
