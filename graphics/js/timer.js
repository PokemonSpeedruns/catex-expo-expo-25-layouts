'use strict';
$(() => {
	loadFromSpeedControl();

	function loadFromSpeedControl() {
		var speedcontrolBundle = 'nodecg-speedcontrol';
		var timerElem = $('#timer');
		var timer = nodecg.Replicant('timer', speedcontrolBundle);
		timer.on('change', (newVal, oldVal) => {
			if (newVal)
				updateTimer(newVal, oldVal);
		});

		function updateTimer(newVal) {
			timerElem.html(newVal.time);
		}
	}
});
