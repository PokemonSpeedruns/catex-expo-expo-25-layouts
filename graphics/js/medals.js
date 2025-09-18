'use strict';

const speedcontrolBundle = 'nodecg-speedcontrol';

const POKEBALL_IMGS = [
	'img/common/Master_Ball_Sprite.png',
	'img/common/Ultra_Ball_Sprite.png',
	'img/common/Great_Ball_Sprite.png',
	'img/common/Poke_Ball_Sprite.png',
	'img/common/Medal_None.png'
];

let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
let timer = nodecg.Replicant('timer', speedcontrolBundle);

let runData;
let completedID = [];
let forfeitID = [];
$(() => {
	loadFromSpeedControl();

	function loadFromSpeedControl() {
		runDataActiveRun.on('change', (newVal, oldVal) => {
			if (newVal) {
				runData = newVal;
				resetMedals();
				updateMedals(newVal, oldVal);
				trackTimer();
			}
		});
	}

	function resetMedals() {
		for (let k = 1; k < 6; k++) {
			hideFinalTime(k);
			$('#medals-img' + k).attr('src', POKEBALL_IMGS[4]);
		}
		completedID = [];
		forfeitID = [];
	}

	function trackTimer() {
		let timer = nodecg.Replicant('timer', speedcontrolBundle);
		timer.on('change', (newVal, oldVal) => {
			updateMedals(newVal, oldVal);
		});
	}

	function updateMedals(newVal, oldVal) {
		for (let [index, team] of runData.teams.entries()) {
			try {
				if (runData.teams.length > 1 && newVal.teamFinishTimes[team.id].state === 'completed' && !completedID.includes(team.id)) {
					completedID.push(team.id);
					setMedal();
				}
				if (runData.teams.length > 1 && newVal.teamFinishTimes[team.id].state === 'forfeit' && !forfeitID.includes(team.id)) {
					forfeitID.push(team.id);
					setForfeit();
				}
				if (oldVal != null && newVal.milliseconds < oldVal.milliseconds && newVal.milliseconds === 0)
					resetMedals();
			}
			catch {
				if (completedID.includes(team.id) || forfeitID.includes(team.id))
					removeMedal(team.id);

				// If we have a finished runner on the layout but the runner is not finished/forfeited, we set the timer next to it.
				// This can be helpful during tech issues, so people know the runner is still going even if their feed is down.
				if ($('.finished-runner-container #runner-name' + (index + 1)).length) {
					showFinalTime(index + 1, newVal.time);
				}
			}
		}
	}

	function setMedal() {
		let n = 0;
		completedID.sort(function(a, b) {
			return timer.value.teamFinishTimes[a].milliseconds - timer.value.teamFinishTimes[b].milliseconds;
		})
		for (let i = 0; i < completedID.length; i++) {
			for (let k = 0; k < runData.teams.length; k++) {
				if (runData.teams[k].id === completedID[i]) {
					showFinalTime(k + 1, timer.value.teamFinishTimes[runData.teams[k].id].time);
					$('#medals-img' + (k + 1)).attr('src', POKEBALL_IMGS[n]);
					n++;
				}
			}
		}
	}

	function setForfeit() {
		let n = 0;
		for (let i = 0; i < forfeitID.length; i++) {
			for (let k = 0; k < runData.teams.length; k++) {
				if (runData.teams[k].id === forfeitID[i]) {
					showFinalTime(k + 1, 'Forfeit');
					$('#medals-img' + (k + 1)).attr('src', POKEBALL_IMGS[4]);
					n++;
				}
			}
		}
	}

	function removeMedal(id) {
		if (completedID.indexOf(id) > -1) {
			let n = completedID.indexOf(id);
			completedID.splice(n, 1);
			for (let k = 1; k < 5; k++) {
				hideFinalTime(k);
				$('#medals-img' + k).attr('src', POKEBALL_IMGS[4]);
			}
			setMedal(completedID[0]);
		}
		if (forfeitID.indexOf(id) > -1) {
			let n = forfeitID.indexOf(id);
			forfeitID.splice(n, 1);
			for (let k = 1; k < 5; k++) {
				hideFinalTime(k);
				$('#medals-img' + k).attr('src', POKEBALL_IMGS[4]);
			}
			setMedal(forfeitID[0]);
		}
	}

	function showFinalTime(id, finalTime) {
		$('#finalTime' + id).show();
		$('#finalTime' + id).text(finalTime);
	}

	function hideFinalTime(id, finalTime) {
		$('#finalTime' + id).text('');
		$('#finalTime' + id).hide();
	}
});
