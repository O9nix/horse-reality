(function() {
  // Создаем тег script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  
  // Удаляем тег после загрузки
  script.onload = function() {
    this.remove();
  };
  
  // Вставляем в голову документа
  (document.head || document.documentElement).appendChild(script);
})();