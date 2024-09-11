import { $, $$ } from '/selectorUtils.js'

document.addEventListener("mousemove", (e)=>{
	$("#tooltip").style.top = `${e.clientY + 5}px`
	$("#tooltip").style.left = `${e.clientX + 5}px`
})

document.addEventListener("mouseover", (e)=>{
	$("#tooltip").style.top = `${e.clientY + 5}px`
	$("#tooltip").style.left = `${e.clientX + 5}px`
})

function updateTooltip() {
	$("#tooltip").style.display = ""
	const hovering = $$("*:hover")[$$("*:hover").length - 1]
	if (!hovering) {
		console.log("not hovering")
		requestAnimationFrame(updateTooltip)
		return
	}
	if (!hovering.dataset) {
		console.log("no dataset")
		requestAnimationFrame(updateTooltip)
		return
	}
	if (hovering.dataset.title) {
		$("#tooltip").style.display = "block"
		$("#tooltip > h1").innerText = hovering.dataset.title
	}
	if (hovering.dataset.desc) {
		$("#tooltip").style.display = "block"
		$("#tooltip > p").innerText = hovering.dataset.desc
	}

	requestAnimationFrame(updateTooltip)
}

requestAnimationFrame(updateTooltip)
