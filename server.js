const { load } = require('cheerio');
const express = require('express');
const axios = require('axios').default;
const path = require('node:path');
const Listr = require('listr');
const http = require('node:http');
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server, {
	cors: {
		origin: '*',
	},
});

const fsP = require('fs/promises');
const fs = require('fs');
const { default: getTezfilesLink } = require('./Tests/getTezfilesLink');

app.use(require('cors')());

io.on('connection', (socket) => {
	console.log('new connection');
});

io.emit('started', `Started downloading !`);

app.get('/scrape-page', async (req, res) => {
	try {
		const data = await getPage(req.query.url, req.query.page);
		res.send(data);
	} catch (error) {
		console.log(error);
		res.status(500).send({ msg: 'Something went wrong!', err: error });
	}
});

app.get('/scrape-single', async (req, res) => {
	try {
		const data = await getSingle(req.query.url);
		res.send(data);
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: 'Something went wrong!', err });
	}
});

app.get('/download-from-this-link', async (req, res) => {
	try {
		if (!req.query.url || !req.query.filename || !req.query.site) return res.send({ err: true, msg: 'No link provided!' });
		res.send();
		if (req.query.site == 'streamtape') {
			const url = await getStreamtapeLink(req.query.url);
			await downloadThisVideoStream(url, req.query.filename);
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shouldn't have happened...` });
	}
});

app.get('/scrape-streamtape', async (req, res) => {
	try {
		if (!req.query.url) return res.send({ err: true, msg: 'No link provided!' });
		const url = await getStreamtapeLink(req.query.url);
		res.redirect(url);
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shouldn't have happened...` });
	}
});

app.get('/test', async (req, res) => {
	try {
		const axiosRes = await axios.get(req.query.url);
		await fsP.writeFile('html-sample.html', axiosRes.data);
		res.send('All Done!');
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: 'Something went wrong!', err });
	}
});

app.get('/get-tezfiles-link', async (req, res) => {
	try {
		const link = await require('./Tests/getTezfilesLink')(req.query.link);
		res.send(link);
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: 'Something went wrong!', err });
	}
});

app.get('/download', function (req, res) {
	const file = `${__dirname}/app-debug.apk`;
	res.download(file); // Set disposition and send it.
});

// async function getVideo() {}

server.listen(1000, () => {
	console.log('running 1000\nhttp://localhost:1000');
});

const searchInString = (string, key) => string.search(key);

async function downloadThisVideoStream(url, filename) {
	const tasks = [
		{
			title: 'Downloading',
			task: async () => {
				if (!fs.existsSync('./media')) {
					fs.mkdirSync('./media');
				}
				const filePath = path.resolve(__dirname, 'media', filename.replaceAll('/', '-'));

				const response = await axios.get(url, { responseType: 'stream' });

				io.emit('started', `Started downloading ${filename}!`);

				response.data.pipe(fs.createWriteStream(filePath));

				return new Promise((resolve, reject) => {
					response.data.on('end', () => {
						io.emit('finished', `Finished downloading ${filename}!`);
						resolve();
					});

					response.data.on('error', (err) => {
						reject(err);
					});
				});
			},
		},
	];
	try {
		await new Listr(tasks).run();
		console.log('Downloaded file!');
	} catch (err) {
		console.log('Something failed :(');
	}
}

async function getStreamtapeLink(url) {
	const res = await axios.get(url, {
		headers: {
			Origin: 'https://streamtape.com',
			Referer: 'https://streamtape.com/',
		},
	});
	const $ = load(res.data);
	let linkAddendum = '&stream=1';
	const tokenIndex = $('#norobotlink').siblings().text().lastIndexOf('token') + 6;
	const siblings = $('#norobotlink')
		.siblings()
		.text()
		.slice(tokenIndex, tokenIndex + 12);
	const finalLink = 'https://' + $('#norobotlink').text().slice(1, -12) + siblings + linkAddendum;
	return finalLink;
}
async function getPage(url, page) {
	const endResponse = [];
	try {
		url = url[-1] == '/' ? url.slice(0, url.length - 2) : url;
		const res = await axios.get(page ? `${url}/page/${page}` : url);
		const $ = load(res.data);
		$('article').each((i, data) => {
			//skip if first article in first page
			// if (!i && !page) {
			// } else {
				endResponse.push({
					title: $(data.children[1].childNodes[3]).text(),
					link: data.children[1].childNodes[3].children[0].attribs.href,
					img: data?.children?.[4]?.children?.[1]?.children?.[0]?.attribs?.src,
				});
			// }
		});
		return endResponse;
	} catch (err) {
		console.log(err);
		throw Error(err);
	}
}

async function getSingle(url) {
	try {
		const endResponse = {};
		const encodedURI = encodeURI(url);
		const res = await axios.get(encodedURI);
		const searchStreamtape = searchInString(res.data, `https://streamtape.com/v/`);
		const searchVidoza = searchInString(res.data, `https://vidoza.net/`);
		if (searchStreamtape > -1) {
			const narrowSearchLinkString = res.data.slice(searchStreamtape, searchStreamtape + 70);
			const searchLinkLength = searchInString(narrowSearchLinkString, "'");
			const link = res.data.slice(searchStreamtape, searchStreamtape + searchLinkLength);
			const streamtapeRes = await axios.get(link);
			const $ = load(streamtapeRes.data);
			endResponse.streamtape = { img: $('#mainvideo').attr().poster, url: link };
		}
		if (searchVidoza > -1) {
			const link = res.data.slice(searchVidoza, searchVidoza + 36);
			const controller = new AbortController();
			setTimeout(() => {
				controller.abort();
			}, 10000);
			const searchVidozaRes = await axios.get(link, { signal: controller.signal });
			const $ = load(searchVidozaRes.data);
			endResponse.vidoza = { video: $('#player>source').attr('src') };
			const searchPoster = searchInString(searchVidozaRes.data, 'poster:');
			if (searchPoster > -1) {
				const narrowSearchPosterString = searchVidozaRes.data.slice(searchPoster, searchPoster + 200);
				const searchPosterJpg = searchInString(narrowSearchPosterString, 'jpg');
				endResponse.vidoza.poster = narrowSearchPosterString.slice(9, searchPosterJpg + 3);
			}
		}
		return Object.keys(endResponse).length ? endResponse : { msg: 'Nothing to scrape, sorry!', isFoundAnyLinks: false };
	} catch (err) {
		throw 'Something failed, sorry!\n' + err;
	}
}
