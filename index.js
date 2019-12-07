(function() {
	'use strict';

	if ('indexedDB' in window) {
		let openRequest = window.indexedDB.open('exerciseDB', 1);

		openRequest.onupgradeneeded = function(event) {
			let db = event.target.result,
			objectStore = db.createObjectStore('friends');

			objectStore.transaction.oncomplete = function(event) {
				let transaction = db.transaction('friends', 'readwrite'),
				objectStore = transaction.objectStore('friends'),
				friends = [{email: 'bob@bob.com', name: 'Bob'}, {email: 'jack@jack.com', name: 'Jack'},
				{email: 'pete@pete.com', name: 'Pete'}, {email: 'jane@jane.com', name: 'Jane'}, 
				{email: 'polly@polly.com', name: 'Polly'}];

				for (let x in friends) {
					objectStore.add(friends[x], x);
				}
			}
		}

		openRequest.onsuccess = function(event) {
			let db = event.target.result,
				transaction = db.transaction('friends', 'readonly'),
				objectStore = transaction.objectStore('friends'),
				getRequest = objectStore.getAll();

			getRequest.onsuccess = function() {
				let friends = getRequest.result,
					friendsList = $('.friends');

				displayFriendsList(friends, friendsList);
			}
		}

		openRequest.onerror = function(event) {
			console.log('error', event.target.errorCode);
		}
	}

	function displayFriendsList(friends = [], list) {
		friends.forEach((friend) => {
			list.append(`<li>${friend.name} - ${friend.email}`);
		});
	}
}()); 