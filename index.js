(function() {
	'use strict';

	if ('indexedDB' in window) {
		var openRequest = window.indexedDB.open('exerciseDB', 1);

		openRequest.onsuccess = function(event) {
			var db = event.target.result;
		}

		openRequest.onerror = function(event) {
			console.log('error', event.target.errorCode);
		}

		openRequest.onupgradeneeded = function(event) {
			var db = event.target.result,
			objectStore = db.createObjectStore('friends');

			objectStore.transaction.oncomplete = function(event) {
				var transaction = db.transaction('friends', 'readwrite'),
				objectStore = transaction.objectStore('friends'),
				friends = [{email: 'bob@bob.com', name: 'Bob'}, {email: 'jack@jack.com', name: 'Jack'},
				{email: 'pete@pete.com', name: 'Pete'}, {email: 'jane@jane.com', name: 'Jane'}, 
				{email: 'polly@polly.com', name: 'Polly'}];

				for (var x in friends) {
					objectStore.add(friends[x], x);
				}
			}
		}
	}
}()); 