import { $, $$ } from '/selectorUtils.js'
import { auth, authApp } from '/firebase.js'

$("#sign-up-button").addEventListener('click', async ()=>{
	try {
		const userCredential = await auth.createUserWithEmailAndPassword(
			authApp,
			$("#sign-up-email").value,
			$("#sign-up-password").value
		)
		if ([...URL.parse(window.location.href).searchParams].includes(["close", "true"])) {
			window.close()
		}
		if (!window.closed) {
			window.open("/calendar", "_self")
		}
	} catch (err) {
		alert(err.code)
		alert(err.message)
	}
})

$("#sign-in-button").addEventListener('click', async ()=>{
	try {
		const userCredential = await auth.signInWithEmailAndPassword(
			authApp,
			$("#sign-in-email").value,
			$("#sign-in-password").value
		)
		if ([...URL.parse(window.location.href).searchParams].includes(["close", "true"])) {
			window.close()
		}
		if (!window.closed) {
			window.open("/calendar", "_self")
		}
	} catch (err) {
		alert(err.code)
		alert(err.message)
	}
})


