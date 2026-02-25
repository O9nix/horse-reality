// background.js - оставьте только для ручного запуска по клику
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['ytv.js'],
    });
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Отправляем сообщение в content script
        chrome.tabs.sendMessage(tabId, { action: 'checkServer' }, async (response) => {
            // После получения ответа от content script
            if (response && response.status === 'ready') {
                try {
                    const serverResponse = await fetch('https://192.168.102.178:3008/auto');
                    const data = await serverResponse.json();

                    // Отправляем ответ сервера обратно в content script
                    chrome.tabs.sendMessage(tabId, { action: 'runFunction', data: data });
                } catch (error) {
                    console.error('Ошибка запроса:', error);
                }
            }
        });
    }
});
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) { 
//     if(changeInfo.status === 'complete') {
//         // вот теперь вклада загрузилась окончательно
//         chrome.scripting.executeScript({
//         target: {tabId: tab.id},
//         files: ['ytv.js'],
//     });
//     }
// });


// // Обработчик сообщений от content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "checkUrl") {
//         const targetOrigin = request.origin;
//         const apiUrl = `${localStorage.getItem('my_serv') || 'https://192.168.102.178:3008'}/checkurl?url=${encodeURIComponent(targetOrigin)}`;

//         fetch(apiUrl, {
//             method: "GET",
//             mode: "no-cors", // Обычно не нужно явно указывать в background script
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8",
//             },
//         })
//         .then((response) => {
//             if (!response.ok) { // Проверка статуса ответа
//                  throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then((data) => {
//             console.log("Данные получены background script'ом:", data);
//             // Отправляем данные обратно content script'у
//             sendResponse({ success: true, data: data });
//         })
//         .catch((error) => {
//             console.error("Ошибка в background script при fetch:", error);
//             // Отправляем ошибку обратно content script'у
//             sendResponse({ success: false, error: error.message });
//         });

//         // Важно: вернуть true, чтобы указать, что sendResponse будет вызван асинхронно
//         return true;
//     }
//     // Не забудьте обработать другие возможные сообщения (action)
// });

// // Убедитесь, что значение по умолчанию установлено и в background script
// if (!localStorage.getItem('my_serv')) {
//      localStorage.setItem('my_serv', 'https://192.168.102.178:3008');
// }