let domain = "";// REPLACE WITH ACTUAL BASE DOMAIN
async function ajaxCall(type, path, data, callback, errCallback) {
    try {
        const result = await fetch(domain + '/' + path, {
            method: type,
            body: type === 'GET' ? undefined : JSON.stringify(data),
            headers: {
                Accept: 'application/json',
                // token,
                'Content-Type': 'application/json'
            }
        });
        const resultjson = await result.json();

        // resolve(resultjson);
        return resultjson;
    } catch (error) {
        console.log(error);
        // reject(error);
        return error;
    }

}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("hi", tabId, changeInfo)
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./Content.js"]
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND SCRIPT.");
            })
            .catch(err => console.log(err, 12));
    }
});


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === 'translate') {
        sendResponse("recieved", request);

        const responseTranslation = await ajaxCall(
            'GET',
            `api/translate?text=${request.message}`,
            null,
            null,
            null,
            null
            // getStorageItem('user') ? getStorageItem('user').token : ''
        );

        console.log(responseTranslation, responseTranslation['b'], 51)
        chrome.storage.local.set({
            [request.key]: responseTranslation['b']
        });
    }
});