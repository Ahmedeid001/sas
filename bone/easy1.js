(function () {
    var CONFIG = {
        btnText: 'إضافة للسلة',
        pricePrefix: '',
        currencySuffix: ' ج.م',
        debounceMs: 300
    };

    function initProductButtons() {
        var cards = document.querySelectorAll('.group.box-border');

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (card.querySelector('.product_card_add_btn')) continue;

            var titleEl = card.querySelector('h3.text-heading');
            var oldBtn = card.querySelector('button[aria-label="Add to cart"]');

            if (!titleEl || !oldBtn) continue;

            var newBtn = document.createElement('button');
            newBtn.className = 'product_card_add_btn';
            newBtn.textContent = CONFIG.btnText;

            (function (ob) {
                newBtn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    ob.click();
                };
            })(oldBtn);

            titleEl.before(newBtn);
        }
    }

    function formatPrice(el) {
        if (!el || el.dataset.formatted) return;

        var raw = el.innerText.replace(/[^0-9.]/g, '');
        var num = parseFloat(raw);

        if (isNaN(num)) return;

        var formatted = num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

        el.innerHTML = formatted + CONFIG.currencySuffix;

         el.style.unicodeBidi = 'isolate';

        el.dataset.formatted = 'true';
    }

    function formatAllPrices() {
        var selectors = [
            '#price',
            '#sale-price',
            'p#sale-price',
            '.product_price',
            'del',
            'p.line-through',
            '.flex.items-center.gap-1.text-\\[\\#131316\\]',
            'p.text-xl.font-bold.text-\\[\\#010101\\].flex.items-center.gap-1',
            '.flex.items-center.gap-1.text-xl.md\\:text-\\[32px\\].font-bold.text-\\[\\#010101\\]'
        ].join(',');

        var prices = document.querySelectorAll(selectors);

        for (var i = 0; i < prices.length; i++) {
            formatPrice(prices[i]);
        }
    }

    function runAll() {
        initProductButtons();
        formatAllPrices();
    }

    var timer = null;

    function debouncedRun() {
        if (timer) return;

        timer = setTimeout(function () {
            timer = null;
            runAll();
        }, CONFIG.debounceMs);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAll);
    } else {
        runAll();
    }

    var observer = new MutationObserver(debouncedRun);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

(function() {
     function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function injectSoldMeta() {
         if (!window.location.pathname.includes('/product')) {
            return;
        }

         const productNameElement = document.querySelector('.flex.items-start');
        
         if (!productNameElement || document.querySelector('.custom-sold-meta-container')) {
            return;
        }

         const soldAmount = getRandomInt(14, 19); 
        const timeHours = getRandomInt(18, 35);  

        const soldMetaHTML = `
            <div class="custom-sold-meta-container" style="display: flex; align-items: center; gap: 8px; margin-top: 3px; color: #e95144; font-size: 12px; font-weight: 600; direction: rtl;">
                <svg viewBox="0 0 384 512" style="width: 16px; height: 16px; fill: currentColor;">
                    <path d="M216 23.858c0-23.802-30.653-32.765-44.149-13.038C48 191.851 224 200 224 288c0 35.629-29.114 64.458-64.85 63.994C123.98 351.538 96 322.22 96 287.046v-85.51c0-21.703-26.471-32.225-41.432-16.504C27.801 213.158 0 261.332 0 320c0 105.869 86.131 192 192 192s192-86.131 192-192c0-170.29-168-193.003-168-296.142z"></path>
                </svg>
                <span class="text">
                    تم بيع <span class="sold-number" >${soldAmount}</span> قطعة خلال آخر <span class="sold-hours" >${timeHours}</span> ساعة
                </span>
            </div>
        `;

        productNameElement.insertAdjacentHTML('afterend', soldMetaHTML);
    }

     const observer = new MutationObserver(injectSoldMeta);
    observer.observe(document.body, { childList: true, subtree: true });

     if (document.readyState === 'complete') injectSoldMeta();
    else window.addEventListener('load', injectSoldMeta);
})();

(function() {
    let viewingInterval;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateLiveNumber() {
        const numElement = document.querySelector('.viewing-number');
        if (!numElement) return;

        let currentNum = parseInt(numElement.innerText);
        let change = getRandomInt(-2, 3);
        let nextNum = currentNum + change;

        if (nextNum < 54) nextNum = 54 + getRandomInt(1, 5);
        if (nextNum > 89) nextNum = 89 - getRandomInt(1, 5);

        numElement.classList.add('number-pop');
        setTimeout(() => {
            numElement.innerText = nextNum;
            setTimeout(() => numElement.classList.remove('number-pop'), 300);
        }, 200);
    }

    function injectProductMeta() {
         if (!window.location.pathname.includes('/product')) {
            clearInterval(viewingInterval);
            return;
        }

        const actionButtonsContainer = document.querySelector('.checkout_btn')?.parentElement;
        
        // منع التكرار
        if (!actionButtonsContainer || document.querySelector('.custom-viewing-container')) return;

        const initialCount = getRandomInt(54, 75);

        const finalHTML = `
            <div class="custom-viewing-container">
                <svg id="icon-eye" viewBox="0 0 511.626 511.626">
                    <path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"></path>
                </svg>
                <span class="text">
                    <span class="viewing-number">${initialCount}</span> عميل يشاهد هذا المنتج 
                </span>
            </div>

            <div class="bleame-trust-badges">
                <div class="bleame-badge">
                    <img src="https://files.easy-orders.net/1773471697868342310.png" alt="Free Shipping">
                    <p>شحن سريع خلال 2-3 أيام</p>
                </div>
                <div class="bleame-badge">
    <img src="https://files.easy-orders.net/1773471811241421659.png" 
         alt="Guarantee" 
         style="width: 24px !important; height: auto !important;">
         
    <p style="font-size: 15px; font-weight: 500; margin: 0;">14 يوم إستبدال وإسترجاع</p>
</div>
            </div>
        `;

        actionButtonsContainer.insertAdjacentHTML('afterend', finalHTML);

        clearInterval(viewingInterval);
        viewingInterval = setInterval(updateLiveNumber, 3000);
    }

    const observer = new MutationObserver(injectProductMeta);
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'complete') injectProductMeta();
    else window.addEventListener('load', injectProductMeta);
})();

(function () {
     window.toggleBoneTwotone = function(headerEl) {
        if (window.innerWidth > 768) return; 
        var col = headerEl.parentElement;
        col.classList.toggle('active');
    };

     document.getElementById('bt-year').textContent = new Date().getFullYear();

     function setupTwotoneFooter() {
        var footers = document.querySelectorAll('#bone-twotone-footer');
        if (footers.length === 0) return;
        
        if (footers.length > 1) {
            for (var j = 1; j < footers.length; j++) {
                footers[j].parentNode.removeChild(footers[j]);
            }
        }
        
        var customFooter = footers[0]; 
        
        var oldFooters = document.querySelectorAll('footer:not(#bone-twotone-footer)');
        oldFooters.forEach(function(el) {
            el.style.display = 'none';
        });
        
        if (customFooter.parentNode !== document.body || customFooter.nextSibling !== null) {
            document.body.appendChild(customFooter);
        }
        
        requestAnimationFrame(function () {
            customFooter.classList.add('is-ready');
        });
    }

    if (document.readyState === 'complete') {
        setupTwotoneFooter();
    } else {
        window.addEventListener('load', setupTwotoneFooter);
    }
    setTimeout(setupTwotoneFooter, 500);
    setTimeout(setupTwotoneFooter, 2000);
})();

(function() {
      'use strict';
      function runBoneSlider() {
        const slider = document.getElementById('bone-icons-slider');
        const dots = document.querySelectorAll('#bone-slider-dots button');
        const items = document.querySelectorAll('.bone-item');
        if (slider && dots.length > 0 && slider.dataset.inited !== 'true') {
          slider.dataset.inited = 'true';
          dots.forEach((dot, index) => {
            dot.onclick = () => {
              if (items[index]) {
                items[index].scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'center'
                });
              }
            };
          });
          slider.onscroll = () => {
            const scrollLeft = Math.abs(slider.scrollLeft);
            const itemWidth = slider.clientWidth;
            
            let activeIndex = Math.round(scrollLeft / itemWidth);
            
            if (activeIndex >= dots.length) activeIndex = dots.length - 1;

            dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === activeIndex);
            });
          };
        }
      }
      const fastObserver = new MutationObserver(() => {
        runBoneSlider();
      });

      fastObserver.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: false
      });
      window.addEventListener('popstate', runBoneSlider);
            runBoneSlider();

    })();

(function() {
    'use strict';
    const lightbox = document.createElement('div');
    lightbox.id = 'bone-lightbox-modal';
    lightbox.innerHTML = `
        <div class="blm-overlay"></div>
        <div class="blm-content">
            <button class="blm-close" aria-label="Close">&times;</button>
            <img class="blm-img" src="" alt="Product Zoom">
        </div>
    `;
    document.body.appendChild(lightbox);

    const overlay = lightbox.querySelector('.blm-overlay');
    const closeBtn = lightbox.querySelector('.blm-close');
    const modalImg = lightbox.querySelector('.blm-img');
    const closeModal = () => {
        lightbox.classList.remove('is-active');
        setTimeout(() => { modalImg.src = ''; }, 300);
    };

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    function initBoneProductGallery() {
        const productImages = document.querySelectorAll('.swiper-slide .sphinx_product_img img');
        
        productImages.forEach(img => {
            if (img.dataset.boneZoom === 'true') return;
            img.dataset.boneZoom = 'true';

            const parentRelative = img.closest('.relative.overflow-hidden');
            if (parentRelative) {
                parentRelative.classList.add('bone-zoom-wrapper');
            }

            img.addEventListener('click', (e) => {
                e.preventDefault();
                modalImg.src = img.src; 
                lightbox.classList.add('is-active');
            });
        });
    }
    const fastObserver = new MutationObserver(() => {
        initBoneProductGallery();
    });

    fastObserver.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: false 
    });

    window.addEventListener('popstate', initBoneProductGallery);
    setTimeout(initBoneProductGallery, 200);

})();

(function() {
  'use strict';

  function rearrangeCartDeleteBtn() {
    const counters = document.querySelectorAll('.cart-item-quantity-counter');
    
    counters.forEach(counter => {
       const deleteBtn = counter.querySelector('button:last-child'); 
      
       if (deleteBtn && deleteBtn.querySelector('.text-red-600') && deleteBtn.dataset.moved !== 'true') {
        const parentWrapper = counter.parentElement; 
        
        if (parentWrapper) {
           deleteBtn.dataset.moved = 'true';
          
           parentWrapper.appendChild(deleteBtn);
          
          parentWrapper.style.display = 'flex';  
          parentWrapper.style.width = '100%';
          parentWrapper.style.justifyContent = 'space-between';
          parentWrapper.style.alignItems = 'center';
          
          deleteBtn.classList.remove('ms-2');
        }
      }
    });
  }

   const cartObserver = new MutationObserver(() => {
    rearrangeCartDeleteBtn();
  });

   cartObserver.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: false 
  });

   window.addEventListener('popstate', rearrangeCartDeleteBtn);
  
   rearrangeCartDeleteBtn();

})();

(function() {
    'use strict';

    function injectSwitcher() {
         const header = document.querySelector('.category_section_header');
        if (!header || document.getElementById('view-switcher')) return;

        const switcherHTML = `
            <div id="view-switcher" class="layout-switcher">
                <button class="layout-btn active" id="grid-view-btn" title="عرض شبكة">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </button>
                <button class="layout-btn" id="list-view-btn" title="عرض قائمة">
                   <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                </button>
            </div>
        `;

        header.insertAdjacentHTML('beforeend', switcherHTML);

        const gridBtn = document.getElementById('grid-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        const container = document.querySelector('.category_products_grid_container');

        if (!container) return;

        gridBtn.onclick = () => {
            container.classList.remove('list-mode');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        };

        listBtn.onclick = () => {
            container.classList.add('list-mode');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        };
    }

     const observer = new MutationObserver(() => {
        injectSwitcher();
    });

    observer.observe(document.body, { childList: true, subtree: true });

     injectSwitcher();
})();

function scrollFoxyTrack(direction) {
  const track = document.getElementById('foxyTrack');
  const scrollAmount = 240 * direction; 
  track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
function openFoxyModal(videoUrl) {
  const modal = document.getElementById('foxyVideoModal');
  const modalVideo = document.getElementById('foxyModalVideo');
  document.body.style.overflow = 'hidden';
  modalVideo.src = videoUrl;
  modal.classList.add('active');
  modalVideo.play();
}
function closeFoxyModal(event) {
  if(event) event.stopPropagation();
  const modal = document.getElementById('foxyVideoModal');
  const modalVideo = document.getElementById('foxyModalVideo');
  document.body.style.overflow = '';
  modalVideo.pause();
  modalVideo.src = ''; 
  modal.classList.remove('active');
}
