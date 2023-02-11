<script lang="ts">
	// import json from './input.json';
	// let jqCode = ".[]";
	// let input = JSON.stringify(json, null, 4);
	let jqCode = ".";
	let input = "";
	let output: any[] = [];
	let valid = true;
	let auto = false;

	async function onInput() {
		valid = false
		const r: string = await jq.promised.raw(input, jqCode, ["-c"]);
		output = r.split("\n").map((l) => JSON.parse(l))
		valid = true
		if (auto) {
			auto = false;
			onClickSend();
		}
	}
	// onInput();

	function onStorage() {
		try {
			const shared = JSON.parse(localStorage.getItem("shared"))
			console.log("storage event detected, loading", shared)
			if (!(shared instanceof Object)) {
				return;
			}
			if (shared.auto) {
				auto = true;
			}
			if (shared.data) {
				input = JSON.stringify(shared.data, null, 4);
				onInput();
			}
			if (shared.filter) {
				jqCode = shared.filter;
				onInput();
			}
		} catch (e) {
			console.error(e);
		}
	}
	onStorage();
	window.addEventListener('storage', onStorage)

	function onClickSend() {
		const result = output.length === 1 ? output[0] : output;  // todo: not great
		localStorage.setItem("shared", JSON.stringify({filtered: result}))
		// input = "";
		// jqCode = ".";
		// output = [];
	}
</script>

<main>
	<!-- <h1>jq</h1> -->
	<!-- <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> -->
	<div class="filter">
		<span class="title">jq</span>
		<input bind:value={jqCode} on:input={onInput}/>
		<button on:click={onClickSend}>send</button>
	</div>
	<div class="row">
		<div class="input">
			<h2>in</h2>
			<textarea bind:value={input}/>
		</div>
		<div class="output" class:valid>
			<h2>out</h2>
			<div class="output-items" class:valid>
				{#each output as out}
					<pre class="item">{JSON.stringify(out, null, 4)}</pre>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	/* * {
		box-sizing: content-box;
	} */

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.filter {
		width: 100%;
		display: flex;
		font-size: 24px;
		justify-content: center;
		align-items: center;
	}

	.title {
		font-size: 30px;
		margin-right: 20px;
		font-weight: bold;
	}

	input {
		font-family: 'Courier New', Courier, monospace;
		flex-grow: 1;
		margin-bottom: 0;
	}

	button {
		margin-left: 10px;
		margin-bottom: 0;
	}

	.item {
		background: #dff;
	}

	.output-items:not(.valid) {
		background: #fee;
	}

	.row {
		display: flex;
		min-height: 400px;
		flex-grow: 1;
	}

	textarea {
		width: 100%;
		flex-grow: 1;
		overflow-x: scroll;
		white-space: pre;
		font-family:'Courier New', Courier, monospace;
	}

	.input, .output {
		flex-grow: 1;
		flex-basis: 0;
		display: inline-block;
		padding: 10px;
		overflow-x: scroll;
		font-size: 12px;
		display: flex;
		flex-direction: column;
	}

	.output-items {
		text-align: left;
		padding: 10px;
		margin: -10px;
	}

	.item {
		margin-bottom: 10px;
		padding: 10px;
	}
</style>
