const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');

const app = express();

app.use(require('cors')());

app.get('/scrape', async (req, res) => {
	try {
		const data = await getTitles(req.query.url);
		res.send(data);
	} catch (error) {
        console.log(error)
		res.status(500).send({ msg: 'Something went wrong!', err: error });
	}
});

async function getTitles(url) {
	const endResponse = [];
	try {
		const res = await axios.get(url);
		const $ = cheerio.load(res.data);
		$('article').each((i, data) => {
			//skip if first article
			if (!i) {
			} else {
				endResponse.push({
					title: $(data.children[1].childNodes[3]).text(),
					link: data.children[1].childNodes[3].children[0].attribs.href,
					img: data.children[4].children[1].children[0].attribs.src,
				});
			}
		});
		// for (const [i, e] of new Array(50).entries()) {
		// 	await request('https://newshemalesvideos.com/page/' + (i + 2), (err, res, html) => {
		// 		if (!err && res.statusCode == 200) {
		// 			const $ = cheerio.load(html);
		// 			$('article').each((i, data) => {
		// 				//skip if first article
		// 				if (!i) {
		// 				} else {
		// 					endResponse += `<div style="display: flex;flex-direction: column;align-items: center;"><h2><a target="_blank" href=${
		// 						data.children[1].childNodes[3].children[0].attribs.href
		// 					}>${$(data.children[1].childNodes[3]).text()}</a></h2><a target="_blank" href=${
		// 						data.children[1].childNodes[3].children[0].attribs.href
		// 					}><img src=${data.children[4].children[1].children[0].attribs.src}></a></div>`;
		// 				}
		// 			});
		// 		} else {
		// 		}
		// 	});
		// }
		return endResponse;
	} catch (err) {
        console.log(err)
		throw Error(err);
	}
}

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
