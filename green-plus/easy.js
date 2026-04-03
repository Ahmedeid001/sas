function toggleBlockById(blockId) {
    const block = document.querySelector(`#${blockId}`);
    if (!block) return;
    const isHome = location.pathname === "/" || location.pathname === "/index.html";
    block.style.display = isHome ? "block" : "none";
  }

  function initHideBlocks(blockIds = []) {
    let tryCount = 0;
    const tryInterval = setInterval(() => {
      const allExist = blockIds.every(id => document.querySelector(`#${id}`));
      if (allExist || tryCount > 100) {
        clearInterval(tryInterval);
        blockIds.forEach(toggleBlockById);
      }
      tryCount++;
    }, 50);

    const toggleAll = () => blockIds.forEach(toggleBlockById);
    const observer = new MutationObserver(toggleAll);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', toggleAll);
    window.addEventListener('pushstate', toggleAll);
    window.addEventListener('replacestate', toggleAll);

    let lastPath = location.pathname;
    setInterval(() => {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname;
        toggleAll();
      }
    }, 200);
  }

  // استدعاء الدالة لكل البلوكات اللي عايزين نخفيها
  initHideBlocks(["watch-brands-section", "gamesSliderContainer", "custom-banner" , "videoBannerBlock" , "bannerBlock2" , "bannerBlock2"]);

(function() {
    'use strict';

    let lastPath = location.pathname;

    function initProductThumbnails() {
        // 1. البحث عن السلايدر
        const swiperEl = document.querySelector('.swiper.swiper-initialized');
        
        // 2. إذا انتقلنا لصفحة جديدة، نظف فوراً
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            document.querySelectorAll('.shopify-thumbnails-wrapper').forEach(el => el.remove());
        }

        // 3. شروط الخروج: مفيش سلايدر أو الصور موجودة فعلاً
        if (!swiperEl || !swiperEl.querySelector('.sphinx_product_img')) return;
        if (swiperEl.classList.contains('thumbs-inited')) return;

        // 4. استخراج الصور
        const originalSlides = swiperEl.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) img.sphinx_product_img');
        if (originalSlides.length <= 1) return;

        // 5. بناء الحاوية
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

        // 6. الختم والحقن (هنا الـ CSS سيفعل سحره ويظهرها فوراً)
        swiperEl.classList.add('thumbs-inited');
        swiperEl.parentNode.insertBefore(thumbsWrapper, swiperEl.nextSibling);

        // 7. مزامنة السحب
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

    // المراقب السريع جداً
    const observer = new MutationObserver(() => {
        // إذا اختفى السلايدر من الـ DOM، امسح الصور المصغرة فوراً
        if (!document.querySelector('.swiper.swiper-initialized')) {
            document.querySelectorAll('.shopify-thumbnails-wrapper').forEach(el => el.remove());
        }
        initProductThumbnails();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    initProductThumbnails();

})();

(function() {
    'use strict';

    // دالة لحساب عرض السكرول لمنع النطة
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    // مراقبة أي كليك بيحصل في الصفحة
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('gpQualityModal');
        if (!modal) return;

        // 1. لو داس على زرار الفتح
        const openBtn = e.target.closest('#gpOpenModalBtn');
        if (openBtn) {
            e.preventDefault();
            const scrollbarWidth = getScrollbarWidth();
            document.documentElement.style.setProperty('--gp-scrollbar-width', `${scrollbarWidth}px`);
            document.body.classList.add('gp-modal-open');
            modal.classList.add('gp-active');
            return;
        }

        // 2. لو داس على زرار الإغلاق (X) أو داس بره المربع الأبيض (على الخلفية السوداء)
        const closeBtn = e.target.closest('#gpCloseModalBtn');
        if (closeBtn || e.target.id === 'gpQualityModal') {
            e.preventDefault();
            modal.classList.remove('gp-active');
            
            setTimeout(() => {
                document.body.classList.remove('gp-modal-open');
                document.documentElement.style.setProperty('--gp-scrollbar-width', '0px');
            }, 300);
        }
    });
})();

(function() {
    'use strict';

    function calculateAndInjectSavings() {
        // 1. جلب عناصر السعر الحالي والسعر القديم
        const salePriceEl = document.getElementById('sale-price');
        const oldPriceEl = document.querySelector('p.line-through');

        // لو مفيش سعر قديم (يعني مفيش خصم) نمسح البادج لو موجود ونوقف الكود
        if (!salePriceEl || !oldPriceEl) {
            const existingBadge = document.getElementById('gp-savings-badge');
            if (existingBadge) existingBadge.remove();
            return;
        }

        // 2. استخراج الأرقام الصافية من النصوص
        const salePrice = parseFloat(salePriceEl.innerText.replace(/[^0-9.]/g, ''));
        const oldPrice = parseFloat(oldPriceEl.innerText.replace(/[^0-9.]/g, ''));

        // التأكد إن الأرقام سليمة وإن فعلاً فيه خصم
        if (isNaN(salePrice) || isNaN(oldPrice) || oldPrice <= salePrice) {
            const existingBadge = document.getElementById('gp-savings-badge');
            if (existingBadge) existingBadge.remove();
            return;
        }

        // 3. حساب فرق الخصم
        const savings = oldPrice - salePrice;

        // 4. إنشاء البادج أو تحديثه لو موجود
        let badge = document.getElementById('gp-savings-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'gp-savings-badge';
            // وضع البادج في نفس الحاوية (Row) بتاعت السعر
            oldPriceEl.parentElement.appendChild(badge);
        }

        // تحديث نص البادج (ممكن تغيرها لـ "وفر 260 ج.م" لو حابب العربي)
        badge.innerHTML = `SAVE ${savings} EGP`;
    }

    // تأخير التنفيذ لمنع التهنيج مع React
    let timer = null;
    function debouncedRun() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(calculateAndInjectSavings, 100);
    }

    // التشغيل المبدئي
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', debouncedRun);
    } else {
        debouncedRun();
    }

    // مراقبة أي تغيير في الصفحة (عشان لو العميل غير المقاس والسعر اتغير، البادج يحسب الخصم الجديد فوراً)
    const observer = new MutationObserver(debouncedRun);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

})();

(function () {
  function fixDiscountBadge() {
    document.querySelectorAll('span').forEach(function (el) {
      const text = el.textContent.trim();

      // لو النص فيه كلمة "خصم" ونسبة %
      if (text.includes('Discount') && text.includes('%')) {
        const match = text.match(/(\d+)\s*%/);
        if (match) {
          el.textContent = '-' + match[1] + '%';
        }
      }
    });
  }

   fixDiscountBadge();

   const observer = new MutationObserver(fixDiscountBadge);
  observer.observe(document.body, { childList: true, subtree: true });
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
                    <span class="viewing-number">${initialCount}</span> customers are viewing this product 
                </span>
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
  function initBibIconsCarousel() {
    const region = document.getElementById('bib-icons-slider');
    const dots = document.querySelectorAll('.bib-dots button');

    if (!region || dots.length === 0) return false;

    // حساب العرض بدقة بناءً على اتجاه الصفحة RTL
    function itemWidth() {
      return region.clientWidth; 
    }

    function setDot(activeIndex) {
      dots.forEach((dot, idx) => {
        dot.setAttribute('aria-current', String(idx === activeIndex));
      });
    }

    function scrollToIndex(i) {
      const w = itemWidth();
      // في الـ RTL السكرول بيكون بالسالب
      const scrollPos = -Math.round(i * w);
      region.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
      setDot(i);
    }

    let autoPlayTimer;
    let currentIndex = 0;

    function startAutoPlay() {
      stopAutoPlay(); 
      autoPlayTimer = setInterval(() => {
        if (window.innerWidth > 992) return;

        const w = itemWidth();
        currentIndex = Math.round(Math.abs(region.scrollLeft) / w);
        
        currentIndex++;
        if (currentIndex >= dots.length) {
          currentIndex = 0;
        }
        
        scrollToIndex(currentIndex);
      }, 3500); // 3.5 ثواني أنسب للقراءة
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentIndex = i;
        scrollToIndex(i);
        stopAutoPlay();
        startAutoPlay(); 
      });
    });

    let ticking = false;
    region.addEventListener('scroll', () => {
      if (window.innerWidth > 992) return;
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const w = itemWidth();
        const i = Math.round(Math.abs(region.scrollLeft) / w);
        const safeIndex = Math.max(0, Math.min(i, dots.length - 1));
        
        currentIndex = safeIndex;
        setDot(safeIndex);
        ticking = false;
      });
    }, { passive: true });
    region.addEventListener('mouseenter', stopAutoPlay);
    region.addEventListener('mouseleave', startAutoPlay);
    region.addEventListener('touchstart', stopAutoPlay, {passive: true});
    region.addEventListener('touchend', startAutoPlay);

    startAutoPlay();
    return true;
  }
  let tries = 0;
  const interval = setInterval(() => {
    tries++;
    if (initBibIconsCarousel() || tries > 30) {
      clearInterval(interval);
    }
  }, 300);
})();
