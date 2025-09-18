'use strict';

$(() => {

	let runData;

	loadFromSpeedControl();

	function loadFromSpeedControl() {
		const speedcontrolBundle = 'nodecg-speedcontrol';

		let gameTitle = $('#game-name');
		let gameCategory = $('#category');
		let gameSystem = $('#platform');
		let gameYear = $('#year');
		let gameEstimate = $('#estimate');

		let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
		runDataActiveRun.on('change', (newVal) => {
			if (newVal)
				runData = newVal;
				updateSceneFields(newVal);
		});

		function updateSceneFields(runData) {
			let currentTeamsData = runData.teams;
			let customData = runData.customData;

			gameSystem.html(runData.system);
			gameYear.html(runData.release);
			gameEstimate.html(runData.estimate);

			fadeHtml('#game-name', runData.game.toUpperCase(), true);
			fadeHtml('#category', runData.category, true);

			// Reset all runner data.
			$('.runner-name').add('.pronouns').text('');
			$('.runner-details').data('teamID', '');

			let i = 0;

			for (let team of currentTeamsData) {
				for (let player of team.players) {
					// Update runner name.
					fadeText('#runner-name' + (i + 1), player.name, true);

					// Update pronouns.
					let pronouns = player.pronouns;
					if (pronouns === undefined) {
						$('#pronouns' + (i + 1)).hide();
					} else {
						$('#pronouns' + (i + 1)).show();
						fadeText('#pronouns' + (i + 1), `[${pronouns}]`, true);
					}

					i += 1;
				}
			}

			// Reset all comms data.
			$('.comms-name').add('.comms-pronouns').text('');

			// Update comms names and pronouns.
			Object.entries(customData).map(([key, val] = entry) => {
				if(key.includes("Pronouns")) {
					val = '[' + val + ']'; // Pronouns are bracketed.
				}
				// The key here maps to the HTML element ID.
				fadeText('#' + key, val, true);
			});
		}
	}
});
