const { JSDOM, ResourceLoader } = require("jsdom");

const normalizeURL = function (url) {
	const URLobj = new URL(url);
	let path = `${URLobj.hostname}${URLobj.pathname}`;
	if (path.length > 0 && path.endsWith("/")) {
		path = path.slice(0, -1);
	}
	return path;
};

const getURLsFromHTML = function (htmlBody, baseURL) {
	const urls = [];
	const dom = new JSDOM(htmlBody);
	const aElements = dom.window.document.querySelectorAll("a");
	for (const aElement of aElements) {
		if (aElement.href.slice(0, 1) === "/") {
			//relative url
			try {
				const urlObj = new URL(`${baseURL}${aElement.href}`);
				urls.push(`${baseURL}${aElement.href}`);
			} catch (err) {
				console.error(`error with relative url ${aElement.href}`);
			}
			//absolute url
		} else {
			try {
				const urlObj = new URL(aElement.href);
				urls.push(aElement.href);
			} catch (err) {
				console.error(`error with absolute url ${aElement.href}`);
			}
		}
	}
	return urls;

	// this function retursn an un normalized array of urls found within the htmlBody
};

const crawlPage = async function (baseURL, currentURL = baseURL, pages = {}) {
	const baseURLobj = new URL(baseURL);
	const currentURLobj = new URL(currentURL);
	if (baseURLobj.hostname !== currentURLobj.hostname) {
		console.error(
			`hostname mismatch: ${baseURLobj.hostname} !== ${currentURLobj.hostname}`
		);
		return pages;
	}
	// normalize the url
	const normalizedCurrentURL = normalizeURL(currentURL);
	// page counter
	if (pages[normalizedCurrentURL] > 0) {
		pages[normalizedCurrentURL]++;
		return pages;
	}
	pages[normalizedCurrentURL] = 1;
	console.log(`crawling ${currentURL}`);
	try {
		const response = await fetch(currentURL);
		//404 error handling
		if (response.status > 399) {
			console.log(
				`Failed to fetch ${currentURL} due to status code: ${response.status}`
			);
			return pages;
		}
		// content type validation
		const contentType = response.headers.get("content-type");
		if (!contentType.includes("text/html")) {
			console.log(`skipping ${currentURL} due to content type ${contentType}`);
			return pages;
		}
		const htmlBody = await response.text();
		const urls = getURLsFromHTML(htmlBody, baseURL);
		for (const url of urls) {
			pages = await crawlPage(baseURL, url, pages);
		}
	} catch (err) {
		console.error(`error in fetch: ${err.message} on ${currentURL}`);
		return pages;
	}
	return pages;
};

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage,
};
