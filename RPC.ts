type Callback = {
  resolve: (value: any) => void,
  reject: (reason?: any) => void,
}

export class RPCaller {
  public ready: Promise<void>;

  private seqNum = 0;
  private callbacks: {[seqNum: number]: Callback} = {};
  private frame: HTMLIFrameElement;

  constructor(frameOrUrl: HTMLIFrameElement | string) {
    if (typeof frameOrUrl === 'string') {
      this.frame = document.createElement('iframe');
      this.frame.src = frameOrUrl;
      this.frame.style.cssText = "width: 0; height: 0; border: 0; border: none; position: absolute;";
      document.body.appendChild(this.frame);
    } else {
      this.frame = frameOrUrl;
    }
    
    this.ready = (async () => {
      await new Promise((resolve) => {
        this.frame.addEventListener('load', resolve)
      })
      // TODO: handshake
    })()

    window.addEventListener('message', (ev) => {
      if (!ev.data || typeof ev.data !== 'object') return;
      const seqNum = ev.data.seqNum;
      const callback = this.callbacks[seqNum];
      if (ev.data.error) {
        callback.reject(ev.data.error);
      } else {
        callback.resolve(ev.data.result);
      }
      delete this.callbacks[ev.data.seqNum];
    });
  }

  
  async call(args: any): Promise<any> {
    await this.ready
    let seqNum = this.seqNum;
    this.seqNum++;
    this.frame.contentWindow!.postMessage({seqNum, args}, "*")
    return await new Promise<any>((resolve, reject) =>
      this.callbacks[seqNum] = {resolve, reject}
    );
  }
}

async function exampleCaller() {
  let rpc = new RPCaller(document.getElementById("iframe") as HTMLIFrameElement);

  await rpc.ready;

  const sum1 = await rpc.call([10, 20]) as number;
  document.getElementById("pre")!.innerHTML += `10 + 20 = ${sum1}\n`;
  const sum2 = await rpc.call([sum1, sum1]) as number;
  document.getElementById("pre")!.innerHTML += `${sum1} + ${sum1} = ${sum2}\n`;
}


async function exampleCallee() {
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

  let rpc = new RPCallee(async ([a, b]: [number, number]) => {
    wait(1000);
    return a + b;
  })
}

export class RPCallee {
  constructor(handler: (args: any) => Promise<any>) {
    window.addEventListener('message', async (ev) => {
      if (!ev.data || typeof ev.data !== 'object') return;
      const {seqNum, args} = ev.data;
      try {
        const result = await handler(args);
        window.parent.postMessage({seqNum, result}, "*");
      } catch (error) {
        window.parent.postMessage({seqNum, error}, "*");
      }
    });
  }
}