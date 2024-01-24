async function getWsPort() {
    const response = await fetch(window.location.origin + '/port');
    const result = await response.json();
    return result.ws;
}

async function connectToServer(uri) {
    const ws = new WebSocket(uri);

    ws.onmessage = (wsData) => {
        console.log(wsData);
        // const messageAsString = JSON.parse(wsData.data);
        // console.log(messageAsString);
    };

    return new Promise(resolve => {
        const timer = setInterval(() => {
            if(ws.readyState === 1) {
                clearInterval(timer)
                resolve(ws);
            }
        }, 10);
    });
}

async function test() {
    const wsPort = await getWsPort();
    const ws = await connectToServer(`ws://${window.location.hostname}:${wsPort}`);
    console.log('Connected to WS server !');
    ws.send(JSON.stringify({message: 'test'}));
}

document.getElementById('test').addEventListener('click', test);