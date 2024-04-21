const { exit } = require("process");
const { getURLsFromHTML, normalizeURL, crawlPage } = require("./crawl");

function main() {
	const args = process.argv.slice(2);
	if (args.length !== 1) {
		console.log("Invalid number of arguments. Usage: node main.js <url>");
		exit(1);
	}

	const url = args[0];
	console.log(`Crawling ${url}...`);
	crawlPage(url);
}
main();
