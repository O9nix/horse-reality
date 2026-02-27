// Перехват добавления внешних скриптов
(function() {
  const BLOCKED_URL = 'rawgit.com/notifyjs/notifyjs/master/dist/notify.js';
  
  // Перехват document.createElement('script')
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'script') {
      // Перехватчик для свойства src
      Object.defineProperty(element, 'src', {
        set: function(value) {
          if (value && value.includes(BLOCKED_URL)) {
            console.log('🚫 Blocked script load:', value);
            // Не устанавливаем src, предотвращая загрузку
            return; 
          }
          // Для всех остальных URL работаем как обычно
          this.setAttribute('src', value);
        },
        get: function() {
          return this.getAttribute('src');
        }
      });
    }
    return element;
  };

  // Перехват document.write (на всякий случай, если сайт использует его)
  const originalWrite = document.write;
  document.write = function(html) {
    if (typeof html === 'string' && html.includes(BLOCKED_URL)) {
      console.log('🚫 Blocked document.write:', html);
      return;
    }
    return originalWrite.apply(document, arguments);
  };
})();
(function() {
  'use strict';
  console.log('🔧 Filters Extension injected');
try {
      let list =[... document.querySelectorAll('.job-progress')]
      list.forEach(item=>{
        item.style.border = '2px solid black'
      })
    } catch (error) {
      
    }
  // === Ждём jQuery ===
  function waitForjQuery(callback) {
    if (typeof window.jQuery !== 'undefined') {
      callback(window.jQuery);
    } else {
      setTimeout(() => waitForjQuery(callback), 50);
    }
  }

  // === Ждём элемент ===
  function waitForElement(selector, callback, maxAttempts = 50) {
    let attempts = 0;
    
    function check() {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      } else {
        console.log(`⚠️ Element ${selector} not found after ${maxAttempts} attempts`);
      }
    }
    check();
  }

  // === Инициализация ===
  waitForjQuery(function($) {
    console.log('✅ jQuery готов');

    // Ждём кнопку фильтров
    waitForElement('#filtersButton', function(button) {
      console.log('🎯 Кнопка filtersButton найдена');
      initFiltersTracker(button, $);
    });

    // Ждём модальное окно фильтров
    waitForElement('#marketFilters', function(modal) {
      console.log('🎯 Модальное окно marketFilters найдено');
      initModalTracker(modal, $);
    });
  });

  // === Отслеживание кнопки фильтров ===
  function initFiltersTracker(button, $) {
    const $button = $(button);
    
    // Клонируем для удаления старых обработчиков
    const $clone = $button.clone(true);
    $button.replaceWith($clone);

    $clone.on('click', function(e) {
      console.log('🖱️ Клик по filtersButton');
      
      // Сохранение в localStorage
      const clicks = JSON.parse(localStorage.getItem('filtersClicks') || '[]');
      clicks.push({
        timestamp: Date.now(),
        url: window.location.href,
        action: 'button_click'
      });
      localStorage.setItem('filtersClicks', JSON.stringify(clicks.slice(-100)));

      console.log('📊 Всего кликов по фильтрам:', clicks.length);
    });

    console.log('✅ Трекер filtersButton установлен');
  }

  // === Отслеживание модального окна ===
  function initModalTracker(modal, $) {
    const $modal = $(modal);
    
    // Создаём MutationObserver для отслеживания изменений модалки
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
            const isVisible = $modal.hasClass('show') && $modal.css('display') === 'block';
            
            console.log('📊 Modal state:', isVisible ? 'OPEN' : 'CLOSED');
            
            // Сохраняем состояние
            localStorage.setItem('filtersModalOpen', isVisible ? 'true' : 'false');
            
            // Отправляем событие
            // chrome.runtime.sendMessage({
            //   action: 'modalStateChange',
            //   isOpen: isVisible,
            //   timestamp: Date.now()
            // });
          }
        }
      });
    });

    observer.observe($modal[0], { 
      attributes: true, 
      attributeFilter: ['class', 'style', 'aria-hidden'] 
    });

    console.log('✅ Трекер модального окна установлен');
  }

  // === Публичные функции для управления фильтрами ===
  window.HorseRealityFilters = {
    // Открыть окно фильтров
    open: function() {
      console.log('🔓 Opening filters modal');
      
      const $modal = $('#marketFilters');
      const $button = $('#filtersButton');
      
      if ($modal.length === 0) {
        console.error('❌ Modal #marketFilters not found');
        return false;
      }
      
      // Показываем модалку (эмулируем клик по кнопке)
      $button.trigger('click');
      
      // Или напрямую меняем атрибуты
      setTimeout(function() {
        $modal.addClass('show');
        $modal.css('display', 'block');
        $modal.attr('aria-hidden', 'false');
        $modal.attr('aria-modal', 'true');
        
        // Добавляем backdrop
        if ($('.modal-backdrop').length === 0) {
          $('body').append('<div class="modal-backdrop fade show"></div>');
        }
        
        // Блокируем прокрутку body
        $('body').addClass('modal-open');
        $('body').css('padding-right', '15px');
        
        console.log('✅ Filters modal opened');
        
        // Сохраняем событие
        const events = JSON.parse(localStorage.getItem('filtersEvents') || '[]');
        events.push({
          timestamp: Date.now(),
          action: 'open',
          url: window.location.href
        });
        localStorage.setItem('filtersEvents', JSON.stringify(events.slice(-100)));
        
        return true;
      }, 100);
      
      return true;
    },
    
    // Закрыть окно фильтров
    close: function() {
      console.log('🔒 Closing filters modal');
      
      const $modal = $('#marketFilters');
      
      if ($modal.length === 0) {
        console.error('❌ Modal #marketFilters not found');
        return false;
      }
      
      // Скрываем модалку
      $modal.removeClass('show');
      $modal.css('display', 'none');
      $modal.attr('aria-hidden', 'true');
      $modal.attr('aria-modal', 'false');
      
      // Удаляем backdrop
      $('.modal-backdrop').remove();
      
      // Разблокируем прокрутку body
      $('body').removeClass('modal-open');
      $('body').css('padding-right', '');
      
      console.log('✅ Filters modal closed');
      
      // Сохраняем событие
      const events = JSON.parse(localStorage.getItem('filtersEvents') || '[]');
      events.push({
        timestamp: Date.now(),
        action: 'close',
        url: window.location.href
      });
      localStorage.setItem('filtersEvents', JSON.stringify(events.slice(-100)));
      
      return true;
    },
    
    // Переключить состояние
    toggle: function() {
      const isOpen = localStorage.getItem('filtersModalOpen') === 'true';
      return isOpen ? this.close() : this.open();
    },
    
    // Проверить состояние
    isOpen: function() {
      const $modal = $('#marketFilters');
      return $modal.hasClass('show') && $modal.css('display') === 'block';
    },
    
    // Получить статистику
    getStats: function() {
      const clicks = JSON.parse(localStorage.getItem('filtersClicks') || '[]');
      const events = JSON.parse(localStorage.getItem('filtersEvents') || '[]');
      
      return {
        totalClicks: clicks.length,
        totalEvents: events.length,
        opens: events.filter(e => e.action === 'open').length,
        closes: events.filter(e => e.action === 'close').length,
        lastEvent: events[events.length - 1]
      };
    },
    
    // Очистить статистику
    clearStats: function() {
      localStorage.removeItem('filtersClicks');
      localStorage.removeItem('filtersEvents');
      localStorage.removeItem('filtersModalOpen');
      console.log('✅ Statistics cleared');
    }
  };

  console.log('✅ HorseRealityFilters API available');
  console.log('📖 Usage: window.HorseRealityFilters.open()');

})();