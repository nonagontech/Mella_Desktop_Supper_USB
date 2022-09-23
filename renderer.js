
const SDK = require("qsm-otter-sdk");
const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')

btn1.onclick = async () => {
    console.log('pairInstrument start');
    const port = await SDK.pairInstrument()
    console.log("paired instrument", port)

}
btn2.onclick = async () => {
    console.log('readConnectionStatus start');
    const port = await SDK.readConnectionStatus()
    console.log("readConnectionStatus", port)

}
