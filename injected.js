(function() {
  'use strict';
  console.log('🔧 Injected script loaded');

  // Функция инициализации с проверкой jQuery
  function init() {
    // Проверяем, загружен ли jQuery
    if (typeof window.jQuery === 'undefined') {
      console.log('⏳ jQuery еще не загружен, ждем...');
      setTimeout(init, 50);
      return;
    }

    const $ = window.jQuery;
    console.log('✅ jQuery найден, версия:', $.fn.jquery);

    // === ВАША ЛОГИКА ===
    const $select = $('#sortBySelect');
    
    if ($select.length) {
      console.log('🎯 Элемент найден, заменяем обработчик');
      
      // Клонируем элемент для удаления старых слушателей
      const $clone = $select.clone(true);
      $select.replaceWith($clone);
      
      // Вешаем новый обработчик
      $clone.on('change', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        const val = $(this).val();
        console.log('📊 Сортировка:', val);
        
        if (val) {
          $(this).addClass('active');
          // Меняем URL без перезагрузки
          const url = new URL(window.location);
          url.searchParams.set('sort_by', val);
           window.location.href=url.href
        } else {
          $(this).removeClass('active');
        }
        return false;
      });
    }
  }

  // Запуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();