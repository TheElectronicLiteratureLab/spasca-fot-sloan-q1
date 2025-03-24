const {execSync} = require('child_process')

function convert( filename ){
	if (filename.endsWith('.ogg')) {
		//execSync( 'convert '+filename+' '+filename+'.jpg', {cwd:'public'})
		execSync( 'ffmpeg -i '+filename+' -ar 16000 -y /tmp/audio_for_tts.wav; LD_LIBRARY_PATH=/usr/app/stt/whisper.cpp/build/bin/ /usr/app/stt/whisper.cpp/build/bin/whisper-cli -f /tmp/audio_for_tts.wav -osrt -m /usr/app/stt/whisper.cpp/models/ggml-base.en.bin; mv /tmp/audio_for_tts.wav.srt '+filename+'.srt', {cwd:'public'})
		fetch('https://ntfy.benetou.fr/convertedwebdav', { method: 'POST', body: JSON.stringify({source: filename, extension: '.srt' }) })
		// could also update a file of conversions to keep track of provenance
	}
}

module.exports.convert = convert
