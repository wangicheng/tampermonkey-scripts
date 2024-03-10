// ==UserScript==
// @name         OJ Code Downloader
// @namespace    http://134.208.3.66/problem/oj_code_downloader
// @version      2024-03-07
// @description  Helping you download your own written code.
// @author       h_bugw7
// @match        http://134.208.3.66/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    function getCode() {
        let code_mirror = document.querySelector("div.CodeMirror-code");
        let code = "";
        code_mirror.innerText.split("\n").forEach((v, i) => {
            if(i % 2 != 0) {
                code += v + "\n";
            }
        });
        return code;
    };
    function getFileExtension() {
        let language = document.querySelector('input[type="hidden"]').value;
        const extensions = {
            "C++": ".cpp",
            "C": ".c",
            "Java": ".java",
            "Python2": ".py",
            "Python3": ".py",
            
            "default": ".txt"
        };
        return extensions[language] || extensions.default;
    }
    function downloadCode() {
        let blob = new Blob([getCode()], { type: "text/plain" });
        let fileName = window.location.pathname.slice(9);
        
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName + getFileExtension();
    
        document.body.appendChild(a);
        a.click();
    
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    };
    function isCreated() {
        let buttons = document.querySelector("div.ivu-col.ivu-col-span-12").firstChild;
        return buttons.children[4].title == "Download your code";
    }
    function createDownloadButton() {
        if(isCreated()) return;
        let buttons = document.querySelector("div.ivu-col.ivu-col-span-12").firstChild;
        let button_prefab = buttons.children[3];
        let cloned_button = button_prefab.cloneNode(true);
        cloned_button.title = "Download your code";
        cloned_button.addEventListener("click", downloadCode);
        buttons.insertBefore(cloned_button, buttons.lastChild);
    };

    const config = { attributes: false, childList: true, subtree: false };
    const observer = new MutationObserver(function (mutationList, observer) {
        setTimeout(createDownloadButton, 200);
    });

    observer.observe(document.body, config);
})();