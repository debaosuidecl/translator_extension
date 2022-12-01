console.log("active")

// find all text in the comment section

function delay(ms) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("done")
        }, ms)
    })
}

async function asyncmessaging(message) {
    return new Promise((res, rej) => {
        chrome.runtime.sendMessage(message, function (response) {
            res(response);

        });
    });
}
async function retrieveStorage(key) {
    return new Promise((res, rej) => {
        chrome.storage.local.get(key, function (data) {
            res(data)

        });
    })
}
async function translateMe(contentContainer) {
    let key = `${Math.floor(Math.random() * 10000000)}`
    console.log("here is the key")
    await asyncmessaging({
        type: 'translate',
        message: contentContainer.textContent,
        key,
    });
    let value = ""
    let tries = 0;

    while (!value && tries < 5) {
        console.log("trial: ", tries)
        console.log("Waiting for 3 secs")
        await delay(1000)
        console.log("Done with 3 secs");
        const valueobject = await retrieveStorage(key)
        value = valueobject[key]
        tries++
    }
    contentContainer.innerText = value || "Oops could not transate: " + contentContainer.innerText
}

(
    async () => {
        console.log("waiting for 5000 seconds")
        await delay(5000)
        console.log("hajimaru zo")
        const allContent = document.querySelectorAll("#content yt-formatted-string");

        for (let i = 0; i < allContent.length; i++) {
            const contentContainer = allContent[i];
            contentContainer.addEventListener("click", () => translateMe(contentContainer))
        }
    }
)()


