const pwdList = document.getElementById("pwd-list");
const pwdGenBtn = document.getElementById("pwd-gen-btn");
const pwdGenCopy = document.getElementById("pwd-gen-copy");
const pwdGenSave = document.getElementById("pwd-gen-save");
const pwdInput = document.getElementById("pwd-gen");

const saveDiv = document.getElementById("save-modal");
const saveInput = document.getElementById("save-pwd");
const saveWeb = document.getElementById("save-web");
const saveBtn = document.getElementById("save-btn");

function genPassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    pwdInput.value = password;
}

function copyPassword() {
    if (pwdInput.value.length > 0) {
        pwdInput.select();
        document.execCommand("copy");
    };
}

function toggleSaveModal() {
    saveDiv.classList.toggle("hidden");
    saveDiv.classList.toggle("show");
    if (pwdInput.value.length > 0) {
        saveInput.value = pwdInput.value;
    }
    chrome.runtime.sendMessage({ type: "getPwdField" }, (res) => {
        if (res.res) {
            saveWeb.value = res.url;
        }
    });
}

function handleSave() {
    const obj = { url: saveWeb.value, pwd: saveInput.value };
    chrome.storage.local.get({ userPwds: [] }, (result) => {
        const userPwds = result.userPwds;
        let found = false;
        if (userPwds.length > 0)
            userPwds.forEach(element => {
                found = element.url == obj.url;
            });
        if (!found) {
            userPwds.push(obj);
            chrome.storage.local.set({ userPwds: userPwds });
        }
    });

    setTimeout(renderPwds(), 500)
}

function renderPwds() {
    chrome.storage.local.get({ userPwds: [] }, (data) => {
        const userPwds = data.userPwds;
        pwdList.innerHTML = ""
        userPwds.forEach(element => {
            pwdList.innerHTML += `<li>${element.url}<br/>${element.pwd}</li>`;
        });
    });
}

pwdGenBtn.addEventListener("click", genPassword);
pwdGenCopy.addEventListener("click", copyPassword);
pwdGenSave.addEventListener("click", toggleSaveModal);
saveBtn.addEventListener("click", handleSave);

renderPwds();
