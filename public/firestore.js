import { firestore, firestoreApp } from '/firebase.js'

const firestoreDb = firestoreApp

export async function queryCollection(collectionName, ...queryArgs) {
	try {
		const collectionRef = firestore.collection(firestoreDb, collectionName)
		const data = []
		const q = firestore.query(collectionRef, ...queryArgs)

		const docSnap = await firestore.getDocs(q)

		docSnap.forEach(doc=>{
			data.push({
				id: doc.id,
				...doc.data()
			})
		})
		return data
	} catch (err) {
		console.log(err)
		return err
	}
}

export async function readDoc(collectionName, docName) {
	try {
		const docRef = firestore.doc(firestoreDb, collectionName, docName)
		const docData = await firestore.getDoc(docRef)

		if (!docData.exists()) {
			return null
		}

		const data = {
			id: docData.id,
			...docData.data()
		}
		return data
	} catch (err) {
		console.log(err)
		return err
	}
}

export async function writeDoc(collectionName, documentId, data) {
	try {
		const document = firestore.doc(firestoreDb, collectionName, documentId)
		await firestore.setDoc(document, data)
		return true
	} catch (err) {
		console.log(err)
		return err
	}
}

async function _updateDoc(collectionName, documentId, data) {
	try {
		const document = firestore.doc(firestoreDb, collectionName, documentId)
		await firestore.updateDoc(document, data)
		return true
	} catch (err) {
		console.log(err)
		return err
	}
}

export { _updateDoc as updateDoc }