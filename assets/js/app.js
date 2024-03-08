const app = function(){
    const apiKey = "c2stNmlPSlFuQ2lCa3hoSjdwOXpHdDJUM0JsYmtGSkk1alRVd0F2Y3A4aUg2UWUwU0NU";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const faqsList = [
        'write a program to print fibonacci series.',
        'Public holidays in US.',
        'Top VPNs for Developers.',
        'Recommend some good books.',
        'Top action movies.',
    ];

    let input = document.querySelector('#message');
    let form = document.querySelector('#chat-form');
    let chatFrame = document.querySelector('#chat-frame');
    const loadFAQS = () => {
        let html = `<ul class="faq-list">`;
        faqsList.forEach((question) => {
            html += `<li class="faq">${question}</li>`;
        });
        html += '</ul>';

        document.querySelector('#chat-frame').innerHTML = html;
    }

    const getUniqueId = (sender) => {
        const prfx = sender === 'bot' ? 'b' : 'u';
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 100000000);
        return `${prfx}-${timestamp}-${randomNumber}`;
    }

    const createMsgBox = (sender) => {
        const senderClass = sender === 'bot' ? 'bot' : 'you';
        const divId = getUniqueId(sender);
        var div = document.createElement('div');
        div.className = `${senderClass} msg`;
        div.setAttribute('id',divId);
        chatFrame.appendChild(div);
        return divId;
    }

    const setMessage = (message, id) => {
        document.querySelector(`#${id}`).innerText = `${message}`;
    }

    const generateMessage = (message, sender) => {
        const msgBox = createMsgBox(sender);
        setMessage(message,msgBox);
        return msgBox;
    }

    const generateResponse = (prompt) => {
        return fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${atob(apiKey).replace(/@@appky@@/g,'')}`,
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

    const sendMessage = (message) => {
        input.readOnly = true;
        input.value = '';
        generateMessage(message,'user');
        const msgBoxBot = generateMessage('Thinking...','bot');
        generateResponse(message).then(response => {
            setMessage(response,msgBoxBot);
            input.readOnly = false;
        });
    }

    return {
        init: function(){
            loadFAQS();
            document.querySelectorAll('.faq').forEach((faq) => {
                faq.addEventListener('click', (e) => {
                    const quest = e.target.innerText.trim();
                    sendMessage(quest);
                });
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = input.value;
                sendMessage(message);
            });
        },
    }
}();

app.init();