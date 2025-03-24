FROM node:20-alpine
# probably a bad start here as a lot of packages are large so no benefit
	# could restart from Debian instead

RUN apk add ghostscript # tested for .pdf via convert
RUN apk add qpdf # to save as new PDF
RUN apk add font-noto # montage from imagemagick requires some fonts
RUN apk add imagemagick # tested for .jpg and .pdf
RUN apk add ffmpeg # for ogg tts (could probably find smaller...)
RUN apk add poppler-utils # for pdftohtml getting XML and images out with positions

WORKDIR /usr/app
COPY ./stt/whisper.cpp/ /usr/app
COPY ./ /usr/app

RUN npm install
# for now cheating with ./node_modules already there

EXPOSE 3000

# Set up a default command
CMD [ "node","." ]
