const { load } = require('cheerio');
const express = require('express');
const axios = require('axios').default;
const path = require('node:path');
const Listr = require('listr');
const http = require('node:http');
const https = require('node:https');

const app = express();

const fsP = require('fs/promises');
const fs = require('fs');

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

app.get('/download-this-link', async (req, res) => {
	try {
		if (!req.query.url) return res.send({ err: true, msg: 'No link provided!' });
		// const data = await downloadFile(req.query.url);
		const data = await downloadThisVideoStream(req.query.url,req.query.filename);
		res.send('Downloading :)');
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shouldn't have happened...` });
	}
});

app.get('/scrape-streamtape', async (req, res) => {
	try {
		const url = await getStreamtapeLink(req.query.url);
		res.send({ link: url });
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

// app.get('/got-test', async (req, res) => {
// 	const url =
// 		'https://cdn.ashemaletube.com/key=HR8dVL+9uAiDZOIOM-LBjQ,end=1654521695/ip=109.66.139.194/speed=361176/buffer=3/initial_buffer=4/2021-06/hq_ec387b4c5787825288459766d96a04de.mp4';

// 	got.stream(url).pipe(createWriteStream('test-vid.mp4'));

// 	res.send('<h2>All done!</h2>');
// });

// async function getVideo() {}

app.listen(1000, () => {
	console.log('running 1000\nhttp://localhost:1000');
});

const searchInString = (string, key) => string.search(key);

async function downloadFile(url, filename) {
	try {
		// const secure = url.slice(0, 4) == 'http' ? http : https;
		// fs.createWriteStream("file.jpg")

		// .createWriteStream('file.jpg');
		const data = await axios.get(url, { responseType: 'stream' });
		const writing = await fsP.writeFile('file.jpg', data);
		// .then(async(res)=>{
		// }).then(()=>{
		// 	console.log("Downloaded File!")
		// })

		// const request = secure.get(url, function (response) {
		// 	response.pipe(file);

		// 	file.on('finish', () => {
		// 		file.close();
		// 		console.log('Download Completed');
		// 	});
		// });
		return Promise.resolve(writing);
	} catch (err) {
		return Promise.reject({ err: 'true', msg: 'GET request failed', errorGiven: err });
	}
}

async function downloadThisVideoStream(url,filename) {
	function one(tasks) {
		tasks.run().then(()=>console.log("Finished!")).catch(process.exit);
	}

	if (process.argv) {
		const tasks = [
			{
				title: 'Downloading',
				task: async () => {
					if (!fs.existsSync("./media")){
						fs.mkdirSync("./media");
					}
					const filePath = path.resolve(__dirname,"media",filename+".mp4");

					const response = await axios({
						method: 'GET',
						url: url,
						responseType: 'stream',
					});

					response.data.pipe(fs.createWriteStream(filePath));

					return new Promise((resolve, reject) => {
						response.data.on('end', () => {
							resolve();
						});

						response.data.on('error', err => {
							reject(err);
						});
					});
				},
			},
		];

		one(new Listr(tasks));
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
