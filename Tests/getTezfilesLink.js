const puppeteer = require('puppeteer');

module.exports = async link => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setRequestInterception(true);

	page.on('console', msg => {
		console.log(`${msg.args()}`);
	});

	page.on('request', request => {
		if (request.url().match('bondagecoexist.com'.length || request.url().match('exoclick.com') || request.url().match('yqmxfz.com') || request.url().match('biptolyla.com'))) {
			request.abort();
		} else {
			request.continue();
		}
	});

	await page.goto(link, { waitUntil: 'load' });
	await page.waitForSelector('.getblock');
	await page.evaluate(() => {
		const getblockspans = document.querySelectorAll('.getblock span');
		getblockspans.forEach(el => {
			if (el.offsetParent && el.getAttribute('data-fo') == 'tezfiles.com') {
				el.click();
			} else {
				el.remove();
			}
		});
	});
	await page.waitForSelector('.getblock a');
	const links = await page.evaluate(() => {
		const [...linksArr] = document.querySelectorAll('.getblock a');
		return linksArr.map(el => el.href);
	});
	await browser.close();
	return links;
};
