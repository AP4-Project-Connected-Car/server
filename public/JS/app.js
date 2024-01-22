async function connectToServer() {
    const ws = new WebSocket('ws://localhost:8081');

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
    const ws = await connectToServer();
    console.log('Connected to WS server !');
    ws.send(JSON.stringify({message: 'test'}));
}

document.getElementById('test').addEventListener('click', test);