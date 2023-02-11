import App from './App.svelte';
import Embed from './Embed.svelte';


function inIframe () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const app =
	inIframe()
	? new Embed({ target: document.body })
	: new App({ target: document.body });

export default app;