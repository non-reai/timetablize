export const $ = (query) => {
	return document.querySelector(query);
};
export const $$ = (query) => {
	return [...document.querySelectorAll(query)];
};