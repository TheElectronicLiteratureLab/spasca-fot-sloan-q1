const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000

const converters = ['convert' ]

app.get('/fileswithmetadata', (req, res) => {
  // should be sorted by modified date, see mtimeMs from fs.statSync(path)
  let files = []
  let raw = fs.readdirSync('public')
  raw.map( f => files.push( {name: f, metadata: fs.statSync(path.join('public',f)) }) )
  res.json( files )
  // consider also https://github.com/LinusU/fs-xattr
})

app.get('/files', (req, res) => {
  res.json( fs.readdirSync('public') )
  // should be sorted by modified date, see mtimeMs from fs.statSync(path)
})

app.get('/', (req, res) => {
  res.redirect('/index.html')
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`open https://companion.benetou.fr on your WebXR device`)
});


app.get('/save-as-new-html/:filename/:pages', (req, res) => {
	pages = req.params.pages
	filename = req.params.filename // unsafe, can rewrite other files
	if (filename.startsWith('/') || filename.includes('..') || !filename.endsWith('.pdf')) return
	try{ JSON.parse(pages) } catch { console.log('not json, file NOT saved!'); res.json('failed saved, not proper JSON!'); return }
	pages = JSON.parse(pages)
	console.log('savedLayout', pages)
	//let savedFilename = Date.now()+'.resorted.pdf'
	require('./converters/html_from_pdf_with_image_urls.js').convert(filename, pages)
	res.json('saved/html/'+filename+'montage.jpg')
	//res.json(savedFilename)
})

app.get('/save-as-new-montage/:filename/:pages', (req, res) => {
	pages = req.params.pages
	filename = req.params.filename // unsafe, can rewrite other files
	if (filename.startsWith('/') || filename.includes('..') || !filename.endsWith('.pdf')) return
	try{ JSON.parse(pages) } catch { console.log('not json, file NOT saved!'); res.json('failed saved, not proper JSON!'); return }
	pages = JSON.parse(pages)
	console.log('savedLayout', pages)
	//let savedFilename = Date.now()+'.resorted.pdf'
	require('./converters/montage.js').convert(filename, pages)
	res.json('saved/montage/'+filename+'montage.jpg')
	//res.json(savedFilename)
})

app.get('/save-as-new-pdf/:filename/:pages', (req, res) => {
	pages = req.params.pages
	filename = req.params.filename // unsafe, can rewrite other files
	if (filename.startsWith('/') || filename.includes('..') || !filename.endsWith('.pdf')) return
	try{ JSON.parse(pages) } catch { console.log('not json, file NOT saved!'); res.json('failed saved, not proper JSON!'); return }
	pages = JSON.parse(pages)
	console.log('savedLayout', pages)
	//let savedFilename = Date.now()+'.resorted.pdf'
	require('./converters/resortedpdf.js').convert(filename, pages)
	res.json('saved/pdf/'+filename)
	//res.json(savedFilename)
})

let savedLayout

app.get('/save-layout/:layout', (req, res) => {
	savedLayout = req.params.layout
	// unsafe, assume JSON but could be anything
	try{ JSON.parse(savedLayout) } catch { console.log('not json, file NOT saved!'); res.json('failed saved, not proper JSON!'); return }
	console.log('savedLayout', savedLayout)
	// could be saved to disk, thus to file, too
	let savedFilename = Date.now()+'.layout.json'
	fs.writeFileSync('./public/'+savedFilename, savedLayout)
		// might be better to save in a dedicated directory in ./public
	res.json(savedFilename)
})

let newFiles = []
fs.watch('public', (eventType, filename) => {
  console.log(`event type is: ${eventType}`); // rename can also be deleting...
	// could consequently check if the file still exists, if not, had been deleted
  if (filename) {

    console.log(`filename provided: ${filename}`)
	 if (eventType == "rename"){
		console.log("fs exists?", fs.existsSync('./public/'+filename)) // false despite existing
		if (!fs.existsSync('./public/'+filename)) {
		    console.log(`${filename} deleted`)
		} else {
			// done on uploads because there might be temporary files that "accumuldates" until done then renamed
			sequentialConverters( filename )
		}
	 }
	 if (eventType == "change"){
	    if (newFiles.includes(filename)){
		 console.log( 'skip, not a new file') 
		} else {
		 // sendEventsToAll({filename,eventType}) former SSE way
		 // fetch('https://ntfy.benetou.fr/fswatch', { method: 'POST', body: JSON.stringify({filename, eventType}) })
		 console.log('new file', filename, '_________________________________________')
		 if ( !filename.includes('.live') ) {
			 newFiles.push(filename)
		  // bypass on convention, e.g. live in the filename
		  	// alternatively could be a dedicated subdirectory
		  } else { console.log('live file, no future ignoring') }
			sequentialConverters( filename )
		}
	}
  } else {
    console.log('filename not provided');
  }
});

function sequentialConverters( filename ){
	require('./converters/pdf.js').convert(filename)
	require('./converters/pdf_json.js').convert(filename)
	require('./converters/ogg_tts.js').convert(filename)
	require('./converters/pdf_xml.js').convert(filename)
}
