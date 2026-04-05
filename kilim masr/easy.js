 
(function() {
    'use strict';

    let lastPath = location.pathname;

    function initProductThumbnails() {
            const swiperEl = document.querySelector('.swiper.swiper-initialized');
                if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            document.querySelectorAll('.shopify-thumbnails-wrapper').forEach(el => el.remove());
        }
        if (!swiperEl || !swiperEl.querySelector('.sphinx_product_img')) return;
        if (swiperEl.classList.contains('thumbs-inited')) return;
        const originalSlides = swiperEl.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) img.sphinx_product_img');
        if (originalSlides.length <= 1) return;

        const thumbsWrapper = document.createElement('div');
        thumbsWrapper.className = 'shopify-thumbnails-wrapper';

        originalSlides.forEach((imgEl, index) => {
            const thumb = document.createElement('div');
            thumb.className = `shopify-thumb-item ${index === 0 ? 'is-active' : ''}`;
            const imgSrc = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || imgEl.currentSrc;
            thumb.innerHTML = `<img src="${imgSrc}">`;

            thumb.addEventListener('click', function() {
                if (swiperEl.swiper) {
                    swiperEl.swiper.params.loop ? swiperEl.swiper.slideToLoop(index) : swiperEl.swiper.slideTo(index);
                }
            });
            thumbsWrapper.appendChild(thumb);
        });
        swiperEl.classList.add('thumbs-inited');
        swiperEl.parentNode.insertBefore(thumbsWrapper, swiperEl.nextSibling);
        if (swiperEl.swiper) {
            swiperEl.swiper.on('slideChange', function () {
                const activeIndex = this.realIndex;
                const items = thumbsWrapper.querySelectorAll('.shopify-thumb-item');
                items.forEach((t, i) => {
                    t.classList.toggle('is-active', i === activeIndex);
                    if (i === activeIndex) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });
            });
        }
    }
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.swiper.swiper-initialized')) {
            document.querySelectorAll('.shopify-thumbnails-wrapper').forEach(el => el.remove());
        }
        initProductThumbnails();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    initProductThumbnails();

})();

/* ==========================================
   BLOCK 2
========================================== */
(function() {
    function changeCategoriesTitle() {
        const sectionTitles = document.querySelectorAll('.home_section_top_title span.relative');
        
        sectionTitles.forEach(title => {
            if (title.childNodes[0] && title.childNodes[0].nodeValue.trim() === 'Categories') {
                title.childNodes[0].nodeValue = 'Shop by Category ';
            }
        });
    }
    changeCategoriesTitle();
    const observer = new MutationObserver(changeCategoriesTitle);
    observer.observe(document.body, { childList: true, subtree: true });
})();

/* ==========================================
   BLOCK 3
========================================== */
(function () {
  function waitForHeader(callback) {
    const check = setInterval(() => {
      const header =
        document.querySelector(".bg-white.sticky.top-0.w-full.z-30") ||
        document.querySelector(".fixed.inset-0.z-40") ||
        document.querySelector("header.default_header") ||
        document.querySelector("header");

      if (header) {
        clearInterval(check);
        callback(header);
      }
    }, 200);
  }

  document.addEventListener("DOMContentLoaded", function () {
     const oldBar = document.querySelector(".shine_header_top_text");
    if (oldBar) oldBar.style.display = "none";

    waitForHeader(function (header) {
      const BAR_HEIGHT = 35;
            header.style.top = "0px"; // نثبت الهيدر في الأعلى تماماً
      header.style.willChange = "transform";
      header.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      const messages = [
        "welcome to our store",
        "Made with love",
        "Customize your piece"
      ];
      const bar = document.createElement("div");
      bar.id = "fixed-announcement-bar";
      bar.style.cssText = `
        background-color: #f3f3f3;
        color: #13134a;
        padding: 8px 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0px;
        font-size: 15px;
        font-weight: 600;
        font-family: inherit;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 20;
        height: ${BAR_HEIGHT}px;
        box-sizing: border-box;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        direction: ltr;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* أنيميشن الظهور والاختفاء */
        will-change: transform;
      `;
      const btnStyle = `
        background: transparent;
        color: #13134a;
        border: none;
        cursor: pointer;
        font-size: 14px;
        padding: 0 10px;
        opacity: 0.75;
      `;
      const btnPrev = document.createElement("button");
      btnPrev.type = "button";
      btnPrev.setAttribute("aria-label", "Previous");
      btnPrev.textContent = "❮";
      btnPrev.style.cssText = btnStyle;
      const btnNext = document.createElement("button");
      btnNext.type = "button";
      btnNext.setAttribute("aria-label", "Next");
      btnNext.textContent = "❯";
      btnNext.style.cssText = btnStyle;
      const wrapper = document.createElement("div");
      wrapper.className = "ann-wrapper";
      wrapper.style.cssText = `
        position: relative;
        height: 24px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 250px;
        text-align: center;
      `;
      const slides = messages.map((msg, index) => {
        const s = document.createElement("div");
        s.style.cssText = `
          position: absolute;
          opacity: 0;
          transform: translateY(15px);
          white-space: nowrap;
          transition: opacity 0.4s ease, transform 0.4s ease;
          width: 100%;
          pointer-events: none;
        `;
        s.textContent = msg;

        if (index === 0) {
          s.style.opacity = "1";
          s.style.transform = "translateY(0)";
        }
        wrapper.appendChild(s);
        return s;
      });
      bar.appendChild(btnPrev);
      bar.appendChild(wrapper);
      bar.appendChild(btnNext);
      document.body.prepend(bar);
    
      let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      let ticking = false;

      function onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

        if (scrollTop <= 20) {
          bar.style.transform = "translateY(0)";
          header.style.transform = `translateY(${BAR_HEIGHT}px)`;
        } else {
          bar.style.transform = "translateY(-100%)";

          if (scrollTop > lastScrollTop) {
            header.style.transform = "translateY(-100%)";
          } else {
            header.style.transform = "translateY(0)";
          }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        ticking = false;
      }

      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      }, { passive: true });
      let index = 0;
      let interval;

      function showSlide(i) {
        slides.forEach((s) => {
          s.style.opacity = "0";
          s.style.transform = "translateY(15px)";
        });
        slides[i].style.opacity = "1";
        slides[i].style.transform = "translateY(0)";
      }

      function nextSlide() {
        index = (index + 1) % slides.length;
        showSlide(index);
      }
      function prevSlide() {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
      }
      function startAuto() {
        interval = setInterval(nextSlide, 4000);
      }
      function restartAuto() {
        clearInterval(interval);
        startAuto();
      }
      btnNext.addEventListener("click", () => {
        nextSlide();
        restartAuto();
      });
      btnPrev.addEventListener("click", () => {
        prevSlide();
        restartAuto();
      });
      startAuto();
      onScroll(); // تطبيق الحالة الابتدائية فور التحميل
    });
  });
})();

/* ==========================================
   BLOCK 4
========================================== */
(function() {
  'use strict';
  function initFadeUpAnimation() {
    const animatedElements = document.querySelectorAll('.motion-fade-up:not(.observer-added)');
    if (animatedElements.length === 0) return; // مفيش عناصر جديدة
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 
    };

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);
    animatedElements.forEach(el => {
      intersectionObserver.observe(el);
      el.classList.add('observer-added'); // وسم العنصر عشان منراقبوش مرتين
    });
  }

  // 2. تشغيل فوري أول ما السكريبت يتقري
  initFadeUpAnimation();

  // 3. مراقبة الـ DOM عشان لو الصفحة حملت السكشن بعدين (React/SPA)
  const domObserver = new MutationObserver(() => {
    initFadeUpAnimation();
  });
  domObserver.observe(document.body, { childList: true, subtree: true });

  // 4. تشغيل إضافي لو الصفحة استخدمت حدث التنقل الداخلي
  window.addEventListener('popstate', () => {
    setTimeout(initFadeUpAnimation, 200);
  });
})();

/* ==========================================
   BLOCK 5
========================================== */
 

/* ==========================================
   BLOCK 6
========================================== */
(function () {
  function updateSimilarProductsTitle() {
    const titles = document.querySelectorAll('.home_section_top_title');
    titles.forEach(title => {
      if (title.textContent.includes('Similar Products')) {
        title.innerHTML = 'You may also like';
        title.style.fontSize = '20px';
        title.style.fontWeight = '500';
        return true;
      }
    });
    return false;
  }
  if (updateSimilarProductsTitle()) return;
  const observer = new MutationObserver(() => {
    if (updateSimilarProductsTitle()) {
      observer.disconnect(); 
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

(function() {
    'use strict';
    function updateSaleBadges() {
        const badges = document.querySelectorAll('.bg-\\[\\#C4301C\\].rounded-full');
                badges.forEach(badge => {
            if (badge.innerText !== "SALE") {
                badge.innerText = "SALE";
                                badge.style.display = "inline-flex";
                badge.style.alignItems = "center";
                badge.style.justifyContent = "center";
                badge.style.minWidth = "fit-content";
            }
        });
    }
    updateSaleBadges();
    const observer = new MutationObserver(() => {
        updateSaleBadges();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

/* ==========================================
   BLOCK 7
========================================== */
(function () {
  function waitFor(selector, cb, timeout = 10000) {
    const start = Date.now();
    const t = setInterval(() => {
      if (document.querySelector(selector)) { clearInterval(t); cb(); }
      if (Date.now() - start > timeout) clearInterval(t);
    }, 200);}
  function applyCartLayout() {
    document.querySelectorAll('li.cart-item').forEach((item) => {
      const headerRow = item.querySelector('.flex.justify-between.text-base.font-medium.text-gray-900');
      if (!headerRow) return;
      const titleEl = headerRow.querySelector('h3');
      const unitPriceEl = headerRow.querySelector('p.ms-4'); // 2000 EGP
      const qtyWrap = item.querySelector('.cart-item-quantity-counter');
      const deleteBtn = item.querySelector('.cart-item-quantity-counter > button[type="button"].ms-2');
      if (!titleEl || !unitPriceEl || !qtyWrap || !deleteBtn) return;
      deleteBtn.classList.add('cart-remove-top');
      headerRow.appendChild(deleteBtn);
      let row = item.querySelector('.cart-qty-price-row');
      if (!row) {
        row = document.createElement('div');
        row.className = 'cart-qty-price-row';
        const qtyOuterFlex = qtyWrap.closest('.flex'); 
        qtyOuterFlex.parentElement.insertBefore(row, qtyOuterFlex);
        row.appendChild(qtyWrap);
      }
      unitPriceEl.classList.add('cart-unit-price');
      row.appendChild(unitPriceEl);
    });}
  waitFor('li.cart-item', applyCartLayout);
  const obs = new MutationObserver(() => applyCartLayout());
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();

/* ==========================================
   BLOCK 8
========================================== */
(function() {    'use strict';
    function initCustomGallery() {
        const thumbnailsGrid = document.querySelector('.sphinx_product_images_grid');
        if (!thumbnailsGrid || thumbnailsGrid.dataset.customized) return;
        thumbnailsGrid.dataset.customized = "true";
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'custom-thumbnail-slider';
        const svgIcon = `<svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path></svg>`;
        const prevBtn = document.createElement('button');
        prevBtn.className = 'custom-slider-btn prev';
        prevBtn.innerHTML = svgIcon;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'custom-slider-btn next';
        nextBtn.innerHTML = svgIcon;
        thumbnailsGrid.parentNode.insertBefore(sliderContainer, thumbnailsGrid);
        sliderContainer.appendChild(prevBtn);
        sliderContainer.appendChild(thumbnailsGrid);
        sliderContainer.appendChild(nextBtn);
        const scrollAmount = 150; // المسافة التي سيتم تمريرها عند الضغط
        nextBtn.addEventListener('click', () => {
            thumbnailsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            thumbnailsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        function updateButtons() {
            prevBtn.disabled = thumbnailsGrid.scrollLeft <= 0;
            nextBtn.disabled = thumbnailsGrid.scrollLeft + thumbnailsGrid.clientWidth >= thumbnailsGrid.scrollWidth - 1;
        }
        thumbnailsGrid.addEventListener('scroll', updateButtons);
        setTimeout(updateButtons, 100);
        const thumbButtons = thumbnailsGrid.querySelectorAll('button[role="tab"]');
        thumbButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                thumbButtons.forEach(b => {
                    b.setAttribute('aria-selected', 'false');
                    b.querySelector('.outline').classList.remove('outline-2');
                    b.querySelector('.outline').classList.add('outline-0');
                });
                this.setAttribute('aria-selected', 'true');
                this.querySelector('.outline').classList.remove('outline-0');
                this.querySelector('.outline').classList.add('outline-2');
            });
        });
    }
    document.addEventListener("DOMContentLoaded", initCustomGallery);
    const observer = new MutationObserver(() => {
        initCustomGallery();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

(function () {
    function updatePricePrefix() {
        var isProductPage = window.location.pathname.includes('/products/');
        document.documentElement.style.setProperty('--price-prefix', isProductPage ? '"LE"' : '"From LE"');}
    function formatPriceNumber(el) {
        if (!el) return;
        el.classList.add('km-price-styled');
        var textNode = null;
        for (var j = 0; j < el.childNodes.length; j++) {
            if (el.childNodes[j].nodeType === 3 && /[0-9]/.test(el.childNodes[j].nodeValue)) {
                textNode = el.childNodes[j];
                break;}}
        if (!textNode) return;
        var raw = textNode.nodeValue.replace(/[^0-9.]/g, '');
        var num = parseFloat(raw);
        if (isNaN(num)) return;
        var formatted = num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        if (textNode.nodeValue !== formatted) {
            textNode.nodeValue = formatted; }
    }
    function runFormatter() {
        updatePricePrefix(); 
        var selectors = [
            '#price',
            '#sale-price',
            '.product_price',
            'del',
            'p.line-through',
            '.flex.items-center.gap-1.text-\\[\\#131316\\]',
            'p.text-xl.font-bold.text-\\[\\#010101\\].flex.items-center.gap-1',
            'span.flex.items-center.gap-1.text-xl.md\\:text-\\[32px\\].font-bold.text-\\[\\#010101\\]'
        ].join(',');
        document.querySelectorAll(selectors).forEach(formatPriceNumber);}
    var timer = null;
    function debouncedRun() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(runFormatter, 50); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFormatter);
    } else {
        runFormatter();}
    var observer = new MutationObserver(debouncedRun);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true 
    });
    var originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        debouncedRun(); };
    window.addEventListener('popstate', debouncedRun);
})();
 
