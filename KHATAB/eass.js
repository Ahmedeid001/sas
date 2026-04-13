(function () {
  'use strict';

  let viewingInterval = null;
  let observer = null;
  let debounceTimer = null;

  const state = {
    productMetaInjected: false,
    breadcrumbsMoved: false,
    categoriesTitleChanged: false
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateLiveNumber() {
    const numElement = document.querySelector('.viewing-number');
    if (!numElement) return;

    const currentNum = parseInt(numElement.textContent || '60', 10);
    let nextNum = currentNum + getRandomInt(-2, 3);

    if (nextNum < 54) nextNum = 54 + getRandomInt(1, 5);
    if (nextNum > 89) nextNum = 89 - getRandomInt(1, 5);

    numElement.classList.add('number-pop');
    setTimeout(() => {
      numElement.textContent = String(nextNum);
      setTimeout(() => numElement.classList.remove('number-pop'), 250);
    }, 120);
  }

  function injectProductMeta() {
    const isProductPage = window.location.pathname.includes('/product');
    if (!isProductPage) {
      if (viewingInterval) {
        clearInterval(viewingInterval);
        viewingInterval = null;
      }
      return;
    }

    if (state.productMetaInjected || document.querySelector('.custom-viewing-container')) return;

    const actionButtonsContainer = document.querySelector('.checkout_btn')?.parentElement;
    if (!actionButtonsContainer) return;

    const initialCount = getRandomInt(54, 75);
    const finalHTML = `
      <div class="custom-viewing-container">
        <span class="text"><span class="viewing-number">${initialCount}</span> زائر يشاهد هذا المنتج الآن </span>
      </div>
      <div class="bleame-trust-badges">
        <div class="bleame-badge"><p>ضمان 5 سنوات</p></div>
        <div class="bleame-badge"><p>14 يوم استبدال واسترجاع</p></div>
      </div>
    `;

    actionButtonsContainer.insertAdjacentHTML('afterend', finalHTML);
    state.productMetaInjected = true;

    if (viewingInterval) clearInterval(viewingInterval);
    viewingInterval = setInterval(updateLiveNumber, 3000);
  }

  function initProductButtons() {
    document.querySelectorAll('.group.box-border').forEach(card => {
      if (card.dataset.btnReady === '1') return;

      const priceWrapper = card.querySelector('.text-heading.mt-3\\.5');
      const oldBtn = card.querySelector('button[aria-label="Add to cart"]');
      if (!priceWrapper || !oldBtn) return;

      if (!card.querySelector('.product_card_add_btn')) {
        const newBtn = document.createElement('button');
        newBtn.className = 'product_card_add_btn';
        newBtn.textContent = 'أضف إلي السلة';
        newBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          oldBtn.click();
        });
        priceWrapper.parentElement.appendChild(newBtn);
      }

      card.dataset.btnReady = '1';
    });
  }

  function moveAndFixBreadcrumbs() {
    if (state.breadcrumbsMoved || document.querySelector('.js-moved-breadcrumb')) return;

    const source = document.querySelector('.hidden.md\\:block.pt-6 .mx-auto.flex.flex-wrap.items-center.gap-1');
    const target = document.querySelector('.flex.items-start');
    if (!source || !target) return;

    const newBread = document.createElement('div');
    newBread.className = 'js-moved-breadcrumb';
    newBread.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;margin-bottom:15px;font-size:11px;white-space:nowrap;color:#61758A;';
    newBread.innerHTML = source.innerHTML;

    if (!document.getElementById('js-breadcrumb-style')) {
      const style = document.createElement('style');
      style.id = 'js-breadcrumb-style';
      style.textContent = `
        .js-moved-breadcrumb svg{display:none!important}
        .js-moved-breadcrumb a::after{content:"/";margin:0 8px;color:#656464}
        .js-moved-breadcrumb a{text-decoration:none;color:#656464b8;display:flex;align-items:center}
      `;
      document.head.appendChild(style);
    }

    target.parentNode.insertBefore(newBread, target);

    const oldSection = document.querySelector('.hidden.md\\:block.pt-6');
    if (oldSection) oldSection.style.display = 'none';

    state.breadcrumbsMoved = true;
  }

  function changeCategoriesTitle() {
    if (state.categoriesTitleChanged) return;

    const sectionTitles = document.querySelectorAll('.home_section_top_title span.relative');
    let changed = false;

    sectionTitles.forEach(title => {
      const node = title.childNodes[0];
      if (node && node.nodeType === 3 && node.nodeValue.trim() === 'الأقسام') {
        node.nodeValue = 'تسوق منتجاتنا';
        changed = true;
      }
    });

    if (changed) state.categoriesTitleChanged = true;
  }

  // ===== دمج سكربت فصل الكاونتر عن زر الحذف =====
  function restructureCartCounter() {
    document.querySelectorAll('.cart-item-quantity-counter').forEach((container) => {
      if (container.dataset.qtyRestructured === '1') return;
      if (container.querySelector('.qty-box-wrapper')) {
        container.dataset.qtyRestructured = '1';
        return;
      }

      const deleteBtn = container.querySelector('button.ms-2');
      if (!deleteBtn) return;

      const qtyWrapper = document.createElement('div');
      qtyWrapper.className = 'qty-box-wrapper';

      Array.from(container.childNodes).forEach(node => {
        if (node !== deleteBtn) qtyWrapper.appendChild(node);
      });

      container.innerHTML = '';
      container.appendChild(qtyWrapper);
      container.appendChild(deleteBtn);

      container.classList.add('flex-split-layout');
      deleteBtn.classList.add('custom-trash-btn');
      container.dataset.qtyRestructured = '1';
    });
  }

  function runAllTasks() {
    injectProductMeta();
    initProductButtons();
    moveAndFixBreadcrumbs();
    changeCategoriesTitle();
    restructureCartCounter(); // المدمج الجديد
  }

  function scheduleRun() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runAllTasks, 120);
  }

  observer = new MutationObserver(scheduleRun);
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    runAllTasks();
  } else {
    window.addEventListener('DOMContentLoaded', runAllTasks, { once: true });
  }
})();
