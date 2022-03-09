let out = [];

chrome.runtime.onMessage.addListener((msg, from, sendRes) => {
    if (msg.type === "pwdField") {
        out[0] = { res: msg.data, url: from.url };
    } else if (msg.type === "getPwdField") {
        sendRes(out[0]);
    }
});