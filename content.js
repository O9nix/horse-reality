(function() {
  'use strict';

  console.log('🔧 Замена обработчика запущена');

  function init() {
    const $select = $('#sortBySelect');
    
    if ($select.length === 0) {
      console.log('⚠️ Элемент #sortBySelect не найден');
      return;
    }

    // 1. Клонируем элемент (это удаляет все обработчики событий)
    const $clone = $select.clone(true);
    
    // 2. Заменяем оригинал на клон
    $select.replaceWith($clone);
    
    console.log('✅ Оригинальные обработчики удалены');

    // 3. Вешаем СВОЙ обработчик
    $clone.on('change', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const selectedValue = $(this).val();
      console.log('📊 Новое значение:', selectedValue);

      // ВАША ЛОГИКА ЗДЕСЬ
      if (selectedValue) {
        $(this).addClass('active');
        
        // Пример: AJAX вместо перезагрузки
        
        // Пример: Изменение URL без перезагрузки (History API)
        const url = new URL(window.location);
        url.searchParams.set('sort_by', selectedValue);
        console.log(url)
         window.location.href=url.href
        // window.history.pushState({}, '', url);
        loadSortedContent(selectedValue);
        
      } else {
        $(this).removeClass('active');
      }
      
      return false;
    });

    console.log('✅ Новый обработчик установлен');
  }

  function loadSortedContent(sortBy) {
    // Пример AJAX запроса
    console.log('🔄 Загрузка контента с сортировкой:', sortBy);
    
    // fetch(`/api/content?sort_by=${sortBy}`)
    //   .then(res => res.json())
    //   .then(data => updatePage(data));
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();