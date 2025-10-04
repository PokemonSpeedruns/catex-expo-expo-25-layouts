const speedcontrolBundle = 'nodecg-speedcontrol';
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const nextRuns = nodecg.Replicant('nextRuns');

let host = '';
let staticIndex, runIndex, targetIndex, pollIndex, rewardIndex;
rewardIndex = pollIndex = targetIndex = runIndex = 10;
staticIndex = 0;

NodeCG.waitForReplicants(runDataArray, runDataActiveRun).then(() => {

	// Please view the Github docs for valid values.
	// Set static text.	
	function staticText(index) {
		if (index === 0)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Twitch: pokemonspeedrunstv</p>`)
		else if (index === 1)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on YouTube: @PokemonSpeedRunsPSR</p>`)
		else if (index === 2)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Twitter/X: @PkmnSpeedRuns</p>`)
		else if (index === 3)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Bluesky: @pokemonspeedruns.bsky.social</p>`)
		else if (index === 4)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Instagram: @pkmnspeedruns</p>`)
		else 
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Join the PSR Subreddit: r/pkmnspeedruns</p>`)
	}

	// Run text.
	function runText(index) {
		const players = getNamesForRun(nextRuns.value.data[index]).join(', ');
		if (index === 0)
			setOmnibarHtml(`<p class='is-multiline is-text-centered'>UP NEXT: ${nextRuns.value.data[index].game}</p> <p class='is-multiline is-text-centered'>${nextRuns.value.data[index].category} by ${players}</p>`)
		else
			setOmnibarHtml(`<p class="is-multiline is-text-centered">ON DECK: ${nextRuns.value.data[index].game}</p> <p class="is-multiline is-text-centered">${nextRuns.value.data[index].category} by ${players}</p>`)
	}

	// Do not edit below this line (unless you know what you're doing!)
	runDataActiveRun.on('change', (newVal, oldVal) => {
		let runs = [];
		let currentRunIndex = runDataArray.value.findIndex(runData => runData.id === newVal.id);
		for (let i = 1; i <= nodecg.bundleConfig.omnibar.numRuns; i++) {
			if (!runDataArray.value[currentRunIndex + i]) {
				break;
			}
			runs.push(runDataArray.value[currentRunIndex + i]);
		}
		nextRuns.value = { dataLength: runs.length, data: runs };
	});
	
	setOmnibarHtml(staticText[0])
	runTickerText();

	function setOmnibarHtml(html) {
		$('#omnibar-content').fadeOut(nodecg.bundleConfig.omnibar.fadeOutTime, () => {
			$('#omnibar-content').html(html).fadeIn(nodecg.bundleConfig.omnibar.fadeInTime);
		});
	}

	function runTickerText() {
		setInterval(() => {
			if (runIndex < nextRuns.value.dataLength && runIndex < nodecg.bundleConfig.omnibar.numRuns) {
				runText(runIndex);
				runIndex++;
			}
			else {
				staticText(staticIndex)
				staticIndex++;

				if (staticIndex > staticText.length + 4) { // +4 as quick fix to showing the 6 social platforms in static text, need to figure out why staticText.length only = 1
					rewardIndex = pollIndex = targetIndex = runIndex = staticIndex = 0;
				}
			}
		}, nodecg.bundleConfig.omnibar.dwellTime);
	}
});