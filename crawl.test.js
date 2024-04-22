const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl");

test("normalizeURL", () => {
	expect(normalizeURL("http://boot.dev")).toBe("boot.dev");
});
test("normalizeURL", () => {
	expect(normalizeURL("http://example.com/test/")).toBe("example.com/test");
});
test("normalizeURL", () => {
	expect(normalizeURL("http://example.com/test/")).toBe("example.com/test");
});
test("normalizeURL", () => {
	expect(normalizeURL("http://example.com/test/")).toBe("example.com/test");
});
test("normalizeURL", () => {
	expect(normalizeURL("http://example.com/test")).toBe("example.com/test");
});
test("getURLsFromHTML absolute", () => {
	const inputURL = "https://blog.boot.dev";
	const inputBody =
		'<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>';
	const actual = getURLsFromHTML(inputBody, inputURL);
	const expected = ["https://blog.boot.dev/"];
	expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
	const inputURL = "https://blog.boot.dev";
	const inputBody =
		'<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>';
	const actual = getURLsFromHTML(inputBody, inputURL);
	const expected = ["https://blog.boot.dev/path/one"];
	expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
	const inputURL = "https://blog.boot.dev";
	const inputBody =
		'<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>';
	const actual = getURLsFromHTML(inputBody, inputURL);
	const expected = [
		"https://blog.boot.dev/path/one",
		"https://other.com/path/one",
	];
	expect(actual).toEqual(expected);
});

test("getURLsFromHTML handle error", () => {
	const inputURL = "https://blog.boot.dev";
	const inputBody =
		'<html><body><a href="invalid"><span>Boot.dev></span></a></body></html>';
	const actual = getURLsFromHTML(inputBody, inputURL);
	const expected = [];
	expect(actual).toEqual(expected);
});
