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
	// baseURL is the root url of the website
	const urls = [];
	const dom = new JSDOM(htmlBody);
	const aElements = dom.window.document.querySelectorAll("a");
	for (const aElement of aElements) {
		if (aElement.href.slice(0, 1) === "/") {
			try {
				urls.push(new URL(aElement.href, baseURL).href);
			} catch (err) {
				console.error(err.message);
			}
		} else {
			try {
				urls.push(new URL(aElement.href).href);
			} catch (err) {
				console.error(err.message);
			}
		}
	}
	return urls;

	// this function retursn an un normalized array of urls found within the htmlBody
};

const crawlPage = async function (url) {
	try {
		const response = await fetch(url);
		if (response.status >= 400) {
			console.error(
				`Failed to fetch ${url} due to status code: ${response.status}`
			);
			return;
		}
		if (!response.headers.get("content-type").includes("text/html")) {
			console.error("invalid header type, expected text/html");
			return;
		}
		console.log(await response.text());
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage,
};
