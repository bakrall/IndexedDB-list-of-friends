//https://dev.to/andyhaskell/build-a-basic-web-app-with-indexeddb-38ef

(function() {
	'use strict';

	if ('indexedDB' in window) {
		let db;

		//indexedDB.open returns a request for a database becasue IndexedDB is asynchronous
		let openRequest = indexedDB.open('exerciseDB', 1);

		//only in 'onupgradeneeded' we can create object stores
		openRequest.onupgradeneeded = function(event) {
			//set db variable to hold the database
			db = event.target.result;
			let friends = db.createObjectStore('friends', {autoincrement: true});
		}

		//'onsuccess' fires after 'onupgradeneeded' completes and it also fires if we refresh the page and open the database again
		openRequest.onsuccess = function(event) {
			db = event.target.result;

			let transaction = db.transaction(['friends'], 'readwrite');
			let store = transaction.objectStore('friends');
			let getData = store.getAll();

			addFriend(db, 'Bob', 'bob@bob.com');
			addFriend(db, 'Jack', 'jack@jack.com');
			addFriend(db, 'Pete', 'pete@pete.com');

			getData.onsuccess = function(event) {
				let friendsArray = event.target.result;
				let friendsList = $('.friends');

				displayFriendsList(friendsArray, friendsList);
			}
		}

		openRequest.onerror = function(event) {
			console.log('error', event.target.errorCode);
		}

		function addFriend(db, name, email) {
			//start a database transaction
			let	transaction = db.transaction(['friends'], 'readwrite');
			//get the friends object store
			let store = transaction.objectStore('friends');
			let friend = {name: name, email: email};
			store.add(friend, name); //name is the key
		}

		function displayFriendsList(friendsArray = [], list) {
			friendsArray.forEach((friend) => {
				list.append(`<li>${friend.name} - ${friend.email}`);
			});
		}
	}
}()); 