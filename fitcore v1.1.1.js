function openInstaModal(element) {
    var modal = document.getElementById("insta-modal");
    var modalImg = document.getElementById("modal-img");
    var img = element.querySelector('img');
    
    if (img && modal && modalImg) {
      modal.style.display = "flex";
      modalImg.src = img.src;     
    }
  }

  function closeInstaModal(event) {
    var modal = document.getElementById("insta-modal");
    if (event.target.id === "insta-modal" || event.target.classList.contains("close-btn")) {
      modal.style.display = "none";
    }
  }

(function () {
  function isProductPage() {
    return window.location.href.includes('/products/') || window.location.pathname.includes('/products/');
  }

  function initThumbs() {
    if (!isProductPage()) return false;

    // 🔥 التعديل هنا: بنقوله هات السوايب اللي مش واخد كلاس home_slider_container
    // ده هيخليه يمسك السلايدر الرئيسي بس ويتجاهل المنتجات المشابهة
    const swiperEl = document.querySelector('.swiper:not(.home_slider_container)');
    
    if (!swiperEl) return false;

    // التأكد إننا معملناش Thumbs قبل كده لنفس العنصر
    if (swiperEl.parentElement.querySelector('.product-thumbs') || document.querySelector('.product-thumbs')) return true;

    const wrapper = swiperEl.querySelector('.swiper-wrapper');
    const slides = swiperEl.querySelectorAll('.swiper-slide');
    
    if (!wrapper || slides.length === 0) return false;

    // سحب الصور
    const imgs = Array.from(slides)
      .map(s => s.querySelector('img'))
      .filter(Boolean)
      .map(img => img.getAttribute('src'));

    if (imgs.length === 0) return false;

    // مكان وضع الشريط
    const controlsRow = swiperEl.parentElement.querySelector('.mt-2.flex.items-center.justify-center.gap-2');
    
    // إنشاء الشريط
    const thumbs = document.createElement('div');
    thumbs.className = 'product-thumbs';

    imgs.forEach((src, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'product-thumb';
      b.setAttribute('aria-label', `thumb-${i+1}`);
      const im = document.createElement('img');
      im.src = src;
      im.loading = 'lazy';
      b.appendChild(im);

      b.addEventListener('click', () => {
        const targetIndex = i;
        const instance = swiperEl.swiper;
        if (instance && typeof instance.slideTo === 'function') {
          instance.slideTo(targetIndex);
        } else {
          slides[targetIndex].scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
        }
        updateActiveState(thumbs, targetIndex);
      });
      thumbs.appendChild(b);
    });

    // إضافة الشريط للصفحة
    if (controlsRow) controlsRow.insertAdjacentElement('afterend', thumbs);
    else swiperEl.insertAdjacentElement('afterend', thumbs);

    updateActiveState(thumbs, 0);

    // ربط الحركة مع السلايدر الأصلي
    const instance = swiperEl.swiper;
    if (instance && instance.on) {
      instance.on('slideChange', () => {
        updateActiveState(thumbs, instance.realIndex ?? instance.activeIndex ?? 0);
      });
    }
    return true;
  }

  function updateActiveState(container, activeIndex) {
    container.querySelectorAll('.product-thumb').forEach((el, idx) => {
      el.classList.toggle('is-active', idx === activeIndex);
    });
  }

  // التشغيل
  initThumbs();

  // المراقب (عشان لو الصفحة حملت ببطء)
  const observer = new MutationObserver((mutations) => {
    if (isProductPage()) {
        // نتأكد إننا لسه ملقيناش الـ thumbs
        if(!document.querySelector('.product-thumbs')) {
            initThumbs();
        }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  let attempts = 0;
  const intervalId = setInterval(() => {
    if (isProductPage()) {
        const success = initThumbs();
        if (success) clearInterval(intervalId); 
    }
    attempts++;
    if (attempts > 10) clearInterval(intervalId);
  }, 500);

})();

document.addEventListener("DOMContentLoaded", function() {
        if (document.getElementById('chic-footer-wrapper')) return;
    const footerHTML = `
    <div id="chic-footer-wrapper">
        <div class="chic-footer-container">
            
            <div class="chic-col brand-col">
                <div class="chic-logo">GRYPX™</div>
                <p class="chic-desc">
                    نحن نؤمن بأن المعدات المناسبة تصنع الفارق. منتجات مصممة للرياضيين الذين يطمحون للأفضل.
                </p>
                <div class="chic-social">
                    <a href="#" class="social-btn"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg></a>
                    <a href="#" class="social-btn"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg></a>
                </div>
            </div>

            <div class="chic-col">
                <h3 class="chic-title">روابط تهمك</h3>
                <ul class="chic-links">
                    <li><a href="/">الرئيسية</a></li>
                    <li><a href="/collections/gym-tool">المنتجات</a></li>
                    <li><a href="/pages/about">من نحن</a></li>
                </ul>
            </div>

        </div>

        <div class="chic-divider"></div>

        <div class="chic-bottom-bar">
            <div class="payment-icons">
                <img src="https://white.a.bigcontent.io/v1/static/mastercard_1" alt="Mastercard" class="pay-icon">
            <img src="https://white.a.bigcontent.io/v1/static/visa_1" alt="Visa" class="pay-icon">
            </div>
             <div class="chic-copyright">
                &copy; 2025 GRYPX. جميع الحقوق محفوظة.
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});

(function(){
  if (!location.pathname.startsWith('/cross-selling/')) return;
  document.documentElement.classList.add('is-cross-selling');
})();

(function () {
  let lastScroll = 0;
  let ticking = false;

  function onScroll(el) {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 0) {
      el.classList.remove("header--hidden");
      el.classList.add("header--visible");
      lastScroll = currentScroll;
      return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scroll Down
      el.classList.remove("header--visible");
      el.classList.add("header--hidden");
    } else {
      // Scroll Up
      el.classList.remove("header--hidden");
      el.classList.add("header--visible");
    }

    lastScroll = currentScroll;
  }

  function waitForHeaderWrap(cb) {
    const i = setInterval(() => {
      const el = document.querySelector(".bg-white.sticky.top-0.w-full.z-30");
      if (el) {
        clearInterval(i);
        cb(el);
      }
    }, 200);
  }

  document.addEventListener("DOMContentLoaded", function () {
    waitForHeaderWrap(function (el) {
      el.classList.add("header--visible");

      window.addEventListener("scroll", function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            onScroll(el);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    });
  });
})();
