<script lang="ts">
	import RPC from "./RPC";
	const jq = new RPC.RPCaller("http://localhost:3030");

	let input: string = "fun";
	let synonyms: string[] = [];

	async function fetchSynonyms() {
		const resp = await fetch(`http://words.bighugelabs.com/api/2/57b1739d4fd2156c72223c9ce7be2958/${input}/json`);
		const data = await resp.json();
		console.log("data from server", data);
		synonyms = await jq.call({data});
		console.log("synonyms", synonyms);
	}

	function followWord(ev) {
		console.log("click word");
		input = ev.target.innerText;
		fetchSynonyms();
	}
</script>

<main>
	<header>
		<h1>Synonymizer</h1>
		<p>Circumlocute like a pro!</p>
		<input bind:value={input}/>
		<button on:click={fetchSynonyms}>Go</button>
	</header>
	<div>
		{#each synonyms as synonym}
			<div class="word" style="transform: rotate({Math.random() * 10 - 5}deg)" on:click={followWord}>
				{synonym}
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		text-align: center;
		max-width: none;
	}

	header {
		margin-bottom: 20px;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.word {
		display: inline-block;
		padding: 20px;
		cursor: pointer;
	}
</style>
