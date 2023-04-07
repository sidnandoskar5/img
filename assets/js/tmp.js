const app = function(){
    const apiKey = "sk-@@appky@@R6b3xLHfxa1CC70euUTrT3BlbkFJDDO9X0mxbedPpAwUhyaQ@@appky@@";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const getPromptKw = (kw) => {
        return `give me a short description of ${kw.trim()}`;
    }

    const registerEvent = (el) => {
        el.addEventListener("click",displayInfo);
    }

    const openDictionary = () => {
        showOverlay();
        document.querySelector("#dictionary").classList.add('active');
    }

    const closeDictionaryEvent = () => {
        let btn = document.querySelector("#close");
        btn.addEventListener('click', () => {
            closeDictionary();  
        })
    }

    const closeDictionary = () => {
        closeOverlay();
        cleanUpDictionary();
        document.querySelector("#dictionary").classList.remove('active');
    }

    const showOverlay = () => {
        document.querySelector("#overlay").classList.add('active');
    }

    const closeOverlay = () => {
        document.querySelector("#overlay").classList.remove('active');
    }

    const cleanUpDictionary = () => {
        document.querySelector("#keyword").innerText = '';
        document.querySelector("#info").innerText = '';
    }

    const displayInfo = (e) => {
        let kw = e.target.innerText;
        let info = e.target.dataset.info;
        document.querySelector("#keyword").innerText = `${kw}:`;
        document.querySelector("#info").innerText = info;
        openDictionary();
    }

    const loadKeywordInfo = () => {
        let kws = document.querySelectorAll(".info");
        kws.forEach((el) => {
            let kw = getPromptKw(el.innerHTML);
            generateResponse(kw).then(response => {
                registerEvent(el);
                el.setAttribute('data-info',response);
                el.classList.add('enable');
            })
        })
    }

    const generateResponse = (prompt) => {
        return fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey.replace(/@@appky@@/g,'')}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{role: "user", content: prompt}],
              max_tokens: 3000,
              n: 1,
              temperature: 1,
            }),
        })
        .then(response => response.json())
        .then(data => {
            return data.choices[0].message.content;
        })
        .catch(error => console.error(error));
    }

    return {
        init: () => {
            loadKeywordInfo();
            closeDictionaryEvent();
        },
    }
}();

app.init();