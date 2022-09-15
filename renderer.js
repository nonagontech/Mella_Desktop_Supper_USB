
const SDK = require("qsm-otter-sdk");
const btn1 = document.getElementById('btn1')
console.log(btn1);
btn1.onclick = async () => {
    console.log(SDK);
    var serial = navigator.serial;
    console.log(serial);
    const port = await SDK.pairInstrument()
    console.log("paired instrument", port)

}
