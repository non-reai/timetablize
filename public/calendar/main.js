window.onerror = (err)=>{
	alert(err)
}

import { $, $$ } from '/selectorUtils.js'
import { auth, authApp, firestore, firestoreApp } from '/firebase.js'
import { queryCollection, writeDoc } from '/firestore.js'

let currentUser

let interval = 1800

auth.onAuthStateChanged(authApp, (user)=>{	
	if (user == null) {
		window.open("/?close=true", "_blank")
	}
	currentUser = user
	$("#welcome-text").innerText = user.displayName
	$("#welcome-text").classList.remove("loading")
})

while (currentUser == null) {
	await new Promise((res)=>{
		setTimeout(res)
	})
}

function periodToElement(value) {
	console.log(value)
	const startDate = new Date()
	startDate.setHours(0)
	startDate.setMinutes(0)
	startDate.setSeconds(0)

	const periodDiv = document.createElement("div")
	periodDiv.classList.add("period")
	periodDiv.innerText = value.className
	if (value.color) {
		periodDiv.style.backgroundColor = value.color
	}
	periodDiv.dataset.title = value.className
	periodDiv.dataset.desc = `${new Date(startDate.valueOf() + (value.startTime * 1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(startDate.valueOf() + (value.endTime * 1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
	$("#schedule-periods").appendChild(periodDiv)

	// alert(JSON.stringify(value))

	return periodDiv
}

const userDailySchedule = await queryCollection("users/"+currentUser.uid+"/dailySchedule")

const userDailySchedulePeriodElements = userDailySchedule.map(periodToElement)

function secondsToString(x) {
	const hours = Math.floor(x/60/60)
	const minutes = Math.floor(x/60) % 60
	const seconds = Math.ceil(x) % 60
	const str = `${hours}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
	if (str.length > 10) {
		alert(str)
	}
	return str
}

let scheduleLoaded = false

setInterval(()=>{
	const startDate = new Date()
	startDate.setHours(0)
	startDate.setMinutes(0)
	startDate.setSeconds(0)
	const endDate = new Date()
	endDate.setHours(24)
	endDate.setMinutes(0)
	endDate.setSeconds(0)
	
	const seconds = (new Date().valueOf() - startDate.valueOf()) / 1000

	$("#current-time-line").style.top = `${seconds / (interval / 100)}px` //set red line to current time

	let currentPeriod = null
	let nextPeriod = null
	let nextPeriodTime = 1000000

	userDailySchedulePeriodElements.forEach((element, index)=>{
		if (userDailySchedule[index].repeatsWeekly) {
			if (userDailySchedule[index].repeatsWeekly.includes(startDate.getDay())) {
				element.style.display = ""
			} else {
				element.style.display = "none"
				return
			}
		}

		if (userDailySchedule[index].startTime <= seconds) {
			if (userDailySchedule[index].endTime > seconds) {
				currentPeriod = userDailySchedule[index]
			}
		}

		if (userDailySchedule[index].startTime >= seconds) {
			if (userDailySchedule[index].startTime < nextPeriodTime) {
				nextPeriod = userDailySchedule[index]
				nextPeriodTime = userDailySchedule[index].startTime
			}
		}
		
		element.style.top = `${(userDailySchedule[index].startTime) / (interval / 100)}px`
		element.style.height = `calc(${
			(userDailySchedule[index].endTime -userDailySchedule[index].startTime) / (interval / 100)
		}px - 20px)`
	})

	if (scheduleLoaded == false) {
		$("#schedule-wrapper").classList.remove("loading")
		$("#current-period").classList.remove("loading")
		$("#next-period").classList.remove("loading")
		
		$("#current-time-line").scrollIntoView({
			block: "center"
		})
	}

	if (currentPeriod) {
		$("#current-period").style.display = ""
		$("#current-period-text").innerText = currentPeriod.className
		
		$("#current-period-time-remaining").innerText = `Ends in ${secondsToString(currentPeriod.endTime - seconds)} at ${new Date(startDate.valueOf() + (currentPeriod.endTime * 1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
	} else {
		$("#current-period").style.display = "none"
	}

	if (nextPeriod) {
		$("#next-period").style.display = ""
		$("#next-period-text").innerText = nextPeriod.className

		$("#next-period-time-remaining").innerText = `Starts in ${secondsToString(nextPeriod.startTime - seconds)} at ${new Date(startDate.valueOf() + (nextPeriod.startTime * 1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
	} else {
		$("#next-period").style.display = "none"
	}
	scheduleLoaded = true
})

$("#create-period-modal-show-button").addEventListener("click", ()=>{
	$("#create-period-dialog").showModal()
})

$("#create-period-button").addEventListener("click", async ()=>{
	const className = $("#create-period-class-name").value

	const color = $("#create-period-color").value
	
	const startTimeRaw = $("#create-period-start-time").value
	const startTime = (parseInt(startTimeRaw.split(":")[0]) * 3600) + (parseInt(startTimeRaw.split(":")[1]) * 60)
	
	const endTimeRaw = $("#create-period-end-time").value
	const endTime = (parseInt(endTimeRaw.split(":")[0]) * 3600) + (parseInt(endTimeRaw.split(":")[1]) * 60)

	const weekdayRepeats = []
	$$("#create-period-week-repeats > div > input[type=checkbox]").forEach((element)=>{
		if (element.checked) {
			weekdayRepeats.push(parseInt(element.dataset.weekday))
		}
	})

	if (isNaN(startTime) || isNaN(endTime)) {
		alert("No start time or end time set.")
		return
	}

	if (!className) {
		alert("No class name.")
		return
	}

	const period = {
		className: className,
		startTime: startTime,
		endTime: endTime,
		repeatsWeekly: weekdayRepeats,
		color: color,
	}

	await writeDoc("users/"+currentUser.uid+"/dailySchedule", Date.now().toString(), period)

	const element = periodToElement(period)
	userDailySchedulePeriodElements.push(element)
	userDailySchedule.push(period)

	$("#create-period-dialog").close()
})

$("#create-period-dialog").addEventListener("click", (e)=>{
	let rect = e.target.getBoundingClientRect();
	let isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
	rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
	if (!isInDialog) {
		e.target.close();
	}
})

