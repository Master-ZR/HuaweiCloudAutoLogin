// ==UserScript==
// @name  huaweiCloudAutoLogin
// @namespace http://tampermonkey.net/
// @version 0.1
// @description try to take over the world!
// @author 1207535453@qq.com
// @match https://auth.huaweicloud.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=huaweicloud.com
// @grant none
// ==/UserScript==

'use strict';

const accounts = [
    {
        "IAM": "",
        "account": "",
        "passwd": ""
    },  {
        "account": "",
        "passwd": ""
    }
]


const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const login = async (type, IAM, account, password, flag) => {
    const evtClick = new Event('input');
    if (type === 'hwid') {
        const user = document.querySelector('.hwid-input.userAccount');
        const userPasswd = document.querySelector('.hwid-input.hwid-input-pwd');
        user.value = account;
        user.dispatchEvent(evtClick);
        userPasswd.value = password;
        userPasswd.dispatchEvent(evtClick);
        // document.querySelector('.hwid-btn.hwid-btn-primary').click();
    } else {
        const IAMUser = document.querySelectorAll('.iam-input-text')[0];
        const user = document.querySelectorAll('.iam-input-text')[1];
        const userPasswd = document.querySelectorAll('.iam-input-text')[2];
        IAMUser.value = IAM;
        IAMUser.dispatchEvent(evtClick);
        user.value = account;
        user.dispatchEvent(evtClick);
        userPasswd.value = password;
        userPasswd.dispatchEvent(evtClick);
        // document.getElementById('btn_submit').click();
    }
    // await sleep(1000);
    if (flag) {
        type === "hwid" ? document.querySelector('.hwid-btn.hwid-btn-primary').click() : document.getElementById('btn_submit').click();
    }
};

const changeType = (targetType) => {
    const loginTypeIam = document.getElementById('loginForm');
    const loginTypeHwid = document.getElementById('hwLoginDivId');
    if (targetType == "hwid") {
        loginTypeHwid.classList.remove('ng-hide');
        loginTypeIam.classList.add('ng-hide');
        // document.getElementById('custom-btn').innerText = `切换到${loginType() === 'iam' ? "华为" : 'IAM'}账号登录`;

    } else {
        loginTypeHwid.classList.add('ng-hide');
        loginTypeIam.classList.remove('ng-hide');
        // document.getElementById('custom-btn').innerText = `切换到${loginType() === 'iam' ? "华为" : 'IAM'}账号登录`;
    }
};

const getLoginType = () => {
    // const loginTypeIam = document.getElementById('loginForm');
    const loginTypeHwid = document.getElementById('hwLoginDivId');
    return loginTypeHwid.classList.contains('ng-hide') ? 'iam' : 'hwid';
};
const getAccount = (target) => {
    var temp = eval(target.getAttribute("acct"));
    var targetType = Object.keys(temp).length < 3 ? "hwid" : "iam";
    var login_btn = document.getElementById("login-btn");
    login_btn.setAttribute("acct", target.getAttribute("acct"));
    changeType(targetType);
    const IAM = Object.keys(temp).length < 3 ? "" : temp.IAM;
    const account = temp.account;
    const password = temp.passwd;
    return {
        "type": targetType,
        "IAM": IAM,
        "account": account,
        "password": password
    }

}
const initButton = () => {
    var num = 0;
    var nodeList = [];
    for (var acct in accounts) {
        console.log(accounts[acct]);
        var a = accounts[acct]
        var acctLength = Object.keys(a).length
        var account = acctLength < 3 ? a.account : `${a.IAM} - ${a.account}`
        var button = document.createElement("div");
        button.classList.add("custom-btn");
        // button.setAttribute("style", `top:${num * 50}px`)
        button.setAttribute("acct", `accounts[${acct}]`)
        button.setAttribute("id", `accts`)
        // button.setAttribute("style", `display:none`)
        button.innerText = `${acctLength < 3 ? "华为账号" : "iam账号"} : ${account}`
        nodeList.push(button)
        document.body.appendChild(button)
    }
    var divs = document.querySelectorAll("#accts")
    var boxes = Array.prototype.slice.call(divs);
    boxes.sort(function (aB, bB) {
        var aWidth = parseInt(aB.clientWidth);
        var bWidth = parseInt(bB.clientWidth);
        console.log(aB)
        console.log(bB)
        return bWidth - aWidth;
    });
    console.log(boxes)
    // 将排序后的元素重新添加到文档中
    boxes.forEach(function (node) {
        console.log(num)
        node.style.top = `${num * 50}px`
        node.style.display = ""
        document.body.appendChild(node);
        num += 1
    });
    document.addEventListener('click', (event) => {
        if (event.target.id === 'accts') {
            var accountObj = getAccount(event.target)
            login(accountObj.type, accountObj.IAM, accountObj.account, accountObj.password, false).catch((error) => {
                console.error(error);
            });
        } else if (event.target.id === 'login-btn') {
            var accountObj = getAccount(event.target)
            login(accountObj.type, accountObj.IAM, accountObj.account, accountObj.password, true).catch((error) => {
                console.error(error);
            });
        }
    });

    // const changeButton = document.createElement('div');
    // changeButton.classList.add('custom-btn');
    // changeButton.setAttribute('id', 'custom-btn');
    // changeButton.innerText = `切换到${loginType() === 'iam' ? "华为" : 'IAM'}账号登录`;
    // document.body.appendChild(changeButton);

    const loginButton = document.createElement('div');
    loginButton.classList.add('custom-btn');
    loginButton.setAttribute('id', 'login-btn');
    loginButton.setAttribute('style', `top:${num * 50}px`);
    loginButton.innerText = '登录';
    document.body.appendChild(loginButton);

    // document.addEventListener('click', (event) => {
    //     if (event.target.id === 'custom-btn') {
    //         changeType();
    //     } else if (event.target.id === 'login-btn') {
    //         const type = loginType();
    //         const account = type === 'hwid' ? hwidAccount : account;
    //         const password = type === 'hwid' ? hwidPasswd : passwd;
    //         login(type, IAM, account, password).catch((error) => {
    //             console.error(error);
    //         });
    //     }
    // });
};
const addUserData = () => {

}

const initObserver = () => {
    const targetNode = document.querySelector('.loginDiv.ng-scope');
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                // const loginTypeHwid = document.getElementById('hwLoginDivId');
                const changeButton = document.getElementById('custom-btn');
                changeButton.innerText = `切换到${getLoginType() === 'iam' ? "华为" : 'IAM'}账号登录`;
            }
        }
    });
    observer.observe(targetNode, { attributes: true });
};

const initAutologin = () => {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(`
        .custom-btn {
          right: 30px;
          text-align: center;
          margin: 50px 20px -100px;
          color: #fff;
          border-radius: 5px;
          padding: 10px 25px;
          font-weight: bolder;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: fixed;
          display: inline-block;
          box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
            7px 7px 20px 0px rgba(0, 0, 0, .1),
            4px 4px 5px 0px rgba(0, 0, 0, .1);
          outline: none;
          background-color: #3bf;
          background-image: linear-gradient(315deg, #0af 25%, #3bf 74%);
          border: none;
          z-index: 999999;
        }

        .custom-btn:after {
          position: absolute;
          content: "";
          width: 100%;
          height: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          border-radius: 5px;
          background-color: #4dccc6;
          background-image: linear-gradient(315deg, #3bf 25%, #0af  74%);
          box-shadow:
            -7px -7px 20px 0px #fff9,
            -4px -4px 5px 0px #fff9,
            7px 7px 20px 0px #0002,
            4px 4px 5px 0px #0001;
          transition: all 0.3s ease;
        }

        .custom-btn:hover {
          color: #fff;
        }

        .custom-btn:hover:after {
          top: 0;
          height: 100%;
        }

        .custom-btn:active {
          top: 2px;
        }
      `));
    document.head.appendChild(style);

    initButton();
    // initObserver();
    login("IAM", "", "", "", false)
    login("hwid", "", "", "", false)
    // buttonSort()
};
window.onload = function () {
    initAutologin();
}
