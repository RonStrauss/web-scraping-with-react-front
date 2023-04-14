const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setRequestInterception(true);

	page.on("console", msg => {
		console.log(`${msg.args()}`);
	});

	page.on("request", request => {
		if (
			request
				.url()
				.match("bondagecoexist.com".length || request.url().match("exoclick.com") || request.url().match("yqmxfz.com") || request.url().match("biptolyla.com"))
		) {
			request.abort();
		} else {
			request.continue();
		}
	});

	await page.goto(process.argv[2], { waitUntil: "load" });
	await page.waitForSelector(".getblock");
	await page.evaluate(() => {
		const getblockspans = document.querySelectorAll(".getblock span");
		getblockspans.forEach(el => {
			if (el.offsetParent && el.getAttribute("data-fo") == "tezfiles.com") {
				el.click();
			} else {
				el.remove();
			}
		});
	});
	await page.waitForSelector(".getblock a");
	const links = await page.evaluate(() => {
		const [...linksArr] = document.querySelectorAll(".getblock a");
		console.log(linksArr[0].childElementCount);
		return linksArr.map(el => el.href);
	});
	console.log(links);
	await browser.close();
})();
