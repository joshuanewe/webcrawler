const { exit } = require("process");
const { getURLsFromHTML, normalizeURL, crawlPage } = require("./crawl");

async function main() {
	const args = process.argv.slice(2);
	if (args.length !== 1) {
		console.log("Invalid number of arguments. Usage: node main.js <url>");
		exit(1);
	}

	const url = args[0];
	console.log(`Crawling ${url}...`);
	const pages = await crawlPage(url);
	for (const page of Object.entries(pages)) {
		console.log(page);
	}
}
main();
