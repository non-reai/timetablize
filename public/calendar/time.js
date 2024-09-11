import { $, $$ } from '../selectorUtils.js'

let interval = 30

setInterval(() => {
	const date = new Date()
	$$(".current-time").forEach((element) => {
		element.innerText = date.toLocaleTimeString();
	});
	$$(".current-date").forEach((element) => {
		element.innerText = date.toLocaleDateString("en-us", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	});

	// $$("#calendar-time > p").forEach((element, index)=>{
	// 	const dateAdjusted = new Date(Math.floor(Date.now()/(1000*60*60*2)) * (1000*60*60*2) + (interval * 1000 * 60) * (index - 2))
	// 	//Math.floor(Date.now()/(1000*60*60*4)) * (1000*60*60*4) means only change every 4 hours
	// 	//future me we can do an absolute system where user can scroll through schedule and it lists all 24 hours
	// 	dateAdjusted.setMinutes((interval * index) % 60)
	// 	element.innerText = dateAdjusted.toLocaleTimeString([], {
	// 		hour: '2-digit', minute: '2-digit'
	// 	}) + " -"
	// })

	
});

