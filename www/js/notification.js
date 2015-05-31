var notification = {
	id = 1,
	dialog=null,
	callback = function () {
		cordova.plugins.notification.local.getIds(function (ids) {
			notification.showToast('IDs: ' + ids.join(' ,'));
		});
	},

	showToast = function (text) {
		setTimeout(function () {
			if (device.platform != 'windows') {
				window.plugins.toast.showShortBottom(text);
			} else {
				notification.showDialog(text);
			}
		}, 100);
	},

	showDialog = function (text) {
		if (notification.dialog) {
			notification.dialog.content = text;
			return;
		}

		notification.dialog = new Windows.UI.Popups.MessageDialog(text);

		notification.dialog.showAsync().done(function () {
			notification.dialog = null;
		});
	},
	hasPermission = function () {
		cordova.plugins.notification.local.hasPermission(function (granted) {
			notification.showToast(granted ? 'Yes' : 'No');
		});
	},

	registerPermission = function () {
		cordova.plugins.notification.local.registerPermission(function (granted) {
			notification.showToast(granted ? 'Yes' : 'No');
		});
	},
	schedule = function () {
		cordova.plugins.notification.local.schedule({
			id: 1,
			text: 'Test Message 1',
			icon: 'http://www.optimizeordie.de/wp-content/plugins/social-media-widget/images/default/64/googleplus.png',
			sound: null,
			data: { test: id }
		});
	},

	scheduleMultiple = function () {
		cordova.plugins.notification.local.schedule([{
			id: 1,
			text: 'Multi Message 1'
		}, {
			id: 2,
			text: 'Multi Message 2'
		}, {
			id: 3,
			text: 'Multi Message 3'
		}]);
	},

	scheduleDelayed = function () {
		var now = new Date().getTime(),
		_5_sec_from_now = new Date(now + 5 * 1000);

		var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

		cordova.plugins.notification.local.schedule({
			id: 1,
			title: 'Scheduled with delay',
			text: 'Test Message 1',
			at: _5_sec_from_now,
			sound: sound,
			badge: 12
		});
	},

	scheduleMinutely = function () {
		var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

		cordova.plugins.notification.local.schedule({
			id: 1,
			text: 'Scheduled every minute',
			every: 'minute',
			sound: sound
		});
	},
	update = function () {
		cordova.plugins.notification.local.update({
			id: 1,
			text: 'Updated Message 1',
			json: { updated: true }
		});
	},

	updateInterval = function () {
		cordova.plugins.notification.local.update({
			id: 1,
			text: 'Updated Message 1',
			every: 'minute'
		});
	},
	clearSingle = function () {
		cordova.plugins.notification.local.clear(1, callback);
	},

	clearMultiple = function () {
		cordova.plugins.notification.local.clear([2, 3], callback);
	},

	clearAll = function () {
		cordova.plugins.notification.local.clearAll(callback);
	},
	cancel = function () {
		cordova.plugins.notification.local.cancel(1, callback);
	},

	cancelMultiple = function () {
		cordova.plugins.notification.local.cancel([2, 3], callback);
	},

	cancelAll = function () {
		cordova.plugins.notification.local.cancelAll(callback);
	},
	isPresent = function () {
		cordova.plugins.notification.local.isPresent(id, function (present) {
			notification.showToast(present ? 'Yes' : 'No');
		});
	},

	isScheduled = function () {
		cordova.plugins.notification.local.isScheduled(id, function (scheduled) {
			notification.showToast(scheduled ? 'Yes' : 'No');
		});
	},

	isTriggered = function () {
		cordova.plugins.notification.local.isTriggered(id, function (triggered) {
			notification.showToast(triggered ? 'Yes' : 'No');
		});
	},
	callbackIds = function (ids) {
		console.log(ids);
		notification.showToast(ids.length === 0 ? '- none -' : ids.join(' ,'));
	},

	getIds = function () {
		cordova.plugins.notification.local.getIds(notification.callbackIds);
	},

	getScheduledIds = function () {
		cordova.plugins.notification.local.getScheduledIds(notification.callbackIds);
	},

	getTriggeredIds = function () {
		cordova.plugins.notification.local.getTriggeredIds(notification.callbackIds);
	}
}