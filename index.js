//https://dev.to/andyhaskell/build-a-basic-web-app-with-indexeddb-38ef

(function() {
	'use strict';

	if ('indexedDB' in window) {
		let db;
		const submitButton = $('.submit');

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

			addFriend(db, 'Bob', 'bob@bob.com');
			addFriend(db, 'Jack', 'jack@jack.com');
			addFriend(db, 'Pete', 'pete@pete.com');
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

			transaction.oncomplete = function() { 
				getAndDisplayFriends(db); 
			}

			transaction.onerror = function(event) {
				console.log('error adding friend ' + event.target.errorCode);
			}
		}

		function getAndDisplayFriends(db) {
			let transaction = db.transaction(['friends'], 'readonly');
			let store = transaction.objectStore('friends');
			let friendsList = $('.friends');

			//create a cursor request to get all items in the store, which we collect in allFriends array
			let req = store.openCursor();
			let allFriends = [];

			req.onsuccess = function(event) {
				let cursor = event.target.result;

				if (cursor != null) {
					allFriends.push(cursor.value);
					cursor.continue();
				} else {
					//if we have a null cursor, it means we've gotten all the items in the store
					displayFriends(allFriends, friendsList);
				}
			}

			req.onerror = function(event) {
				alert('error in cursor request ' + event.target.errorCode);
			}
		}

		function displayFriends(friendsArray = [], list) {
			//empty the list before pulling friends from database - otherwise they will be displayed multiple times
			list.empty();
			friendsArray.forEach((friend) => {
				list.append(`<li>${friend.name} - ${friend.email}`);
			});
		}

		function getFriendData() {
			const friendName = $('#friend-name').val(),
				friendEmail = $('#friend-email').val();

			addFriend(db, friendName, friendEmail);
		}

		function bindUiEvents() {
			submitButton.on('click', (event) => {
				event.preventDefault();
				getFriendData();
			});
		}

		bindUiEvents();
	}
}()); 