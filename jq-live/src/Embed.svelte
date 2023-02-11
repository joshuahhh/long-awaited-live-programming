<script lang="ts">
  import RPC from './RPC';
	
  let deliverFiltered: (filtered: any) => void;

  new RPC.RPCallee(async (props: any) => {
    localStorage.setItem("shared", JSON.stringify(props))
    const filtered = await new Promise<any>((resolve) => {
      deliverFiltered = resolve;
    })
    return filtered;
  });

  window.addEventListener('storage', (e) => {
    console.log("storage event detected, loading")
    const shared = JSON.parse(localStorage.getItem("shared"))
    if (shared.filtered) {
      deliverFiltered(shared.filtered);
      localStorage.setItem("shared", JSON.stringify({}))
    }
  })
</script>

<h2>embedded</h2>