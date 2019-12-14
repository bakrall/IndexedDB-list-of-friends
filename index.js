//https://dev.to/andyhaskell/build-a-basic-web-app-with-indexeddb-38ef

(function() {
	'use strict';

	if ('indexedDB' in window) {
		let db;

		//indexedDB.open returns a request for a database becasue IndexedDB is asynchronous
		let openRequest = indexedDB.open('exerciseDB', 1);

		openRequest.onupgradeneeded = function(event) {
			//set db variable to hold the database
			db = event.target.result;
			let friends = db.createObjectStore('friends', {autoincrement: true});
		}

		openRequest.onsuccess = function(event) {
			db = event.target.result;

			addFriends();
		}

		openRequest.onerror = function(event) {
			console.log('error', event.target.errorCode);
		}

		function addFriends() {
			//start a database transaction
			let	transaction = db.transaction(['friends'], 'readwrite');
			//get the friends object store
			let store = transaction.objectStore('friends');
			let friends = [{email: 'bob@bob.com', name: 'Bob'}, {email: 'jack@jack.com', name: 'Jack'},
				{email: 'pete@pete.com', name: 'Pete'}, {email: 'jane@jane.com', name: 'Jane'}, 
				{email: 'polly@polly.com', name: 'Polly'}];
			let friendsList = $('.friends');

			for (var x in friends) {
				store.add(friends[x], x);
			}

			displayFriendsList(friends, friendsList);
		}

		function displayFriendsList(friends = [], list) {
			friends.forEach((friend) => {
				list.append(`<li>${friend.name} - ${friend.email}`);
			});
		}
	}
}()); 