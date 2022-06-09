const { load } = require('cheerio');
const express = require('express');
const axios = require('axios');

const app = express();

const fs = require('fs/promises');

app.use(require('cors')());

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

app.get('/test', async (req, res) => {
	try {
		const axiosRes = await axios.get(req.query.url);
		await fs.writeFile('html-sample.html', axiosRes.data);
		res.send('All Done!');
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: 'Something went wrong!', err });
	}
});

// app.get('/video', async (req, res) => {
// 	let endResponse = '';
// 	await request('https://streamtape.com/v/Al9eYDdWGVC49d', (err, res, html) => {
// 		if (!err && res.statusCode == 200) {
// 			const $ = cheerio.load(html);
// 			$('.plyr-container');
// 		}
// 	});
// });

// app.get('/got-test', async (req, res) => {
// 	const url =
// 		'https://cdn.ashemaletube.com/key=HR8dVL+9uAiDZOIOM-LBjQ,end=1654521695/ip=109.66.139.194/speed=361176/buffer=3/initial_buffer=4/2021-06/hq_ec387b4c5787825288459766d96a04de.mp4';

// 	got.stream(url).pipe(createWriteStream('test-vid.mp4'));

// 	res.send('<h2>All done!</h2>');
// });

// async function getVideo() {}

app.listen(1000, () => {
	console.log('runnin 1000\nhttp://localhost:1000');
});

const searchInString = (string, key) => string.search(key);

async function getPage(url, page) {
	const endResponse = [];
	try {
		url = url[-1] == '/' ? url.slice(0, url.length - 2) : url;
		const res = await axios.get(page ? `${url}/page/${page}` : url);
		const $ = load(res.data);
		$('article').each((i, data) => {
			//skip if first article in first page
			if (!i && !page) {
			} else {
				endResponse.push({
					title: $(data.children[1].childNodes[3]).text(),
					link: data.children[1].childNodes[3].children[0].attribs.href,
					img: data.children[4].children[1].children[0].attribs.src,
				});
			}
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
		const res = await axios.get(url);
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
			const searchVidozaRes = await axios.get(link);
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
