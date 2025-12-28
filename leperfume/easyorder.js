document.addEventListener("mousedown", function (e) {
    const dialog = document.querySelector(
        'div[role="dialog"].lg\\:hidden[data-headlessui-state="open"]'
    );
    if (!dialog) return;

    const panel = dialog.querySelector(".relative.bg-white");
    if (!panel) return;

    if (!panel.contains(e.target)) {
        const closeBtn = dialog.querySelector("button");
        if (closeBtn && !closeBtn.dataset.closing) {
            closeBtn.dataset.closing = "true";
                        panel.style.opacity = '0';
            
            closeBtn.click();
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
  /* دالة انتظار عنصر ثم تنفيذ كول باك */
  function waitFor(selector, callback, options) {
    const opts = Object.assign({ interval: 200, timeout: 10000 }, options || {});
    const start = Date.now();
    const timer = setInterval(function () {
      var el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        callback(el);
      } else if (Date.now() - start > opts.timeout) {
        clearInterval(timer);
      }
    }, opts.interval);
  }

  /* ================= 5.1 تعديلات الهيدر ================= */

  // ضبط الهيكل (Grid) للصف العلوي في الهيدر
  waitFor("header.default_header .flex.items-center", function (headerRow) {
    headerRow.style.display = "grid";
    headerRow.style.gridTemplateColumns = "1fr auto 1fr";
    headerRow.style.alignItems = "center";
    headerRow.style.width = "100%";
    headerRow.style.height = "50px";
  });

  // زر المنيو (موبايل)
  waitFor("button.bg-white.py-2.lg\\:hidden", function (menuBtn) {
    menuBtn.querySelectorAll("svg, img").forEach(function (x) { x.remove(); });
    menuBtn.classList.remove("bg-white");

    var img = document.createElement("img");
    img.src = "https://img.icons8.com/windows/32/menu--v1.png";
    img.style.width = "26px";
    img.style.height = "26px";
    img.alt = "Menu";
    img.classList.add("custom-header-icon");

    menuBtn.style.justifySelf = "start";
    menuBtn.style.marginLeft = "1px";
    menuBtn.style.backgroundColor = "transparent";

    menuBtn.appendChild(img);
  });

  // زر البحث
  waitFor("a[href='/search']", function (searchParent) {
    searchParent.querySelectorAll("svg, img").forEach(function (x) { x.remove(); });

    var img = document.createElement("img");
    img.src = "https://img.icons8.com/fluency-systems-regular/48/search--v1.png";
    img.style.width = "27px";
    img.style.height = "27px";
    img.alt = "Search";
    img.classList.add("custom-header-icon");

    searchParent.style.marginRight = "-20px";
    searchParent.insertBefore(img, searchParent.firstChild);
  });

  // زر السلة
  waitFor("button.group.relative.flex.items-center", function (cartBtn) {
    var svg = cartBtn.querySelector("svg");
    if (svg) svg.remove();

    var img = document.createElement("img");
    img.src = "https://files.easy-orders.net/1765165976715042792.png";
    img.style.width = "22px";
    img.style.height = "22px";
    img.alt = "Cart";
    img.classList.add("custom-header-icon");

    cartBtn.style.marginRight = "0px";
    cartBtn.insertBefore(img, cartBtn.firstChild);
  });

  // حاوية أيقونات الهيدر (search + cart ...)
  waitFor(".ms-auto.flex.items-center", function (iconsWrapper) {
    iconsWrapper.style.justifySelf = "end";
    iconsWrapper.style.display = "flex";
    iconsWrapper.style.alignItems = "center";
    iconsWrapper.style.gap = "15px";
  });

  // ضبط اللوجو
  waitFor(".default_header_logo", function (logoArea) {
    logoArea.classList.add("header-logo-wrapper");
    var logoImg = logoArea.querySelector("img");
    if (logoImg) {
      logoImg.style.width = "100%";
      logoImg.style.height = "100%";
      logoImg.style.objectFit = "contain";
    }
  });

  // منطق السكرول (يعمل في كل الصفحات)
  var lastPath = "";
  var headerWrapper = document.querySelector(".sticky.top-0");
  var body = document.body;

  function handleScroll() {
    // تم إزالة الشرط القديم، الكود يعمل الآن على جميع الصفحات
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    var scrollPercentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    // الشرط: لو نزلنا شوية (أكتر من 1%) الخلفية تتغير
    if (scrollPercentage > 40 || window.scrollY > 300) { 
      headerWrapper.classList.add("header-scrolled");
      headerWrapper.classList.remove("header-transparent");
    } else {
      headerWrapper.classList.add("header-transparent");
      headerWrapper.classList.remove("header-scrolled");
    }
  }

  function checkUrlChange() {
    var currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;

      // هنا بنحدد بس مين الهوم ومين لأ عشان الـ CSS يظبط البادينج
      if (currentPath === "/" || currentPath === "/index.html") {
        body.classList.add("is-home-page");
      } else {
        body.classList.remove("is-home-page");
      }
      
      // بنعيد تفعيل السكرول هاندلر في كل الأحوال
      handleScroll();
      window.removeEventListener("scroll", handleScroll); // تنظيف قديم
      window.addEventListener("scroll", handleScroll); // إضافة جديد
    }
  }

  // تشغيل مراقبة المسار
  checkUrlChange();
  setInterval(checkUrlChange, 500);

  /* ================= 5.2 إضافة بلوك الفوتر (موبايل) ================= */
  waitFor(".flex.flex-col.gap-6.mt-6", function (socialBlock) {
    if (document.querySelector(".km-footer-extra")) return;

    var wrapper = document.createElement("div");
    wrapper.className = "km-footer-extra";

    var payment = document.createElement("div");
    payment.className = "km-payment-icons";
    payment.innerHTML = '\
      <img src="https://white.a.bigcontent.io/v1/static/mastercard_1" alt="mastercard">\
      <img src="https://white.a.bigcontent.io/v1/static/visa_1" alt="visa">\
      <img src="https://white.a.bigcontent.io/v1/static/payPal_2" alt="paypal">\
    ';

    var legal = document.createElement("div");
    legal.className = "km-legal-links";
    legal.innerHTML = '\
      <a href="/pages/terms-and-conditions">Terms &amp; Conditions</a>\
      <span class="divider">•</span>\
      <a href="/pages/privacy-policy">Privacy Policy</a>\
      <span class="divider">•</span>\
      <a href="/pages/cookie-policy">Cookie Policy</a>\
      <span class="divider">•</span>\
      <a href="/pages/accessibility">Accessibility</a>\
    ';

    var copyrightD = document.createElement("div");
    copyrightD.className = "km-copyright-dt";
    copyrightD.innerHTML = "© " + new Date().getFullYear() + " Le Perfume.";

    wrapper.appendChild(legal);
    wrapper.appendChild(copyrightD);
    wrapper.appendChild(payment);

    socialBlock.insertAdjacentElement("afterend", wrapper);
  });

  /* ================= 5.3 إضافة بلوك الفوتر (ديسكتوب) ================= */
  waitFor(".hidden.lg\\:grid.lg\\:grid-cols-4", function (desktopGrid) {
    if (document.querySelector(".km-footer-extra-dt")) return;

    var wrapperDT = document.createElement("div");
    wrapperDT.className = "km-footer-extra-dt";

    var paymentDT = document.createElement("div");
    paymentDT.className = "km-payment-icons-dt";
    paymentDT.innerHTML = '\
      <img src="https://white.a.bigcontent.io/v1/static/mastercard_1" alt="mastercard">\
      <img src="https://white.a.bigcontent.io/v1/static/visa_1" alt="visa">\
      <img src="https://white.a.bigcontent.io/v1/static/payPal_2" alt="paypal">\
    ';

    var legalDT = document.createElement("div");
    legalDT.className = "km-legal-links-dt";
    legalDT.innerHTML = '\
      <a href="/pages/terms-and-conditions">Terms &amp; Conditions</a>\
      <span class="divider">•</span>\
      <a href="/pages/privacy-policy">Privacy Policy</a>\
      <span class="divider">•</span>\
      <a href="/pages/cookie-policy">Cookie Policy</a>\
      <span class="divider">•</span>\
      <a href="/pages/accessibility">Accessibility</a>\
    ';

    var copyrightDT = document.createElement("div");
    copyrightDT.className = "km-copyright-dt";
    copyrightDT.innerHTML = "© " + new Date().getFullYear() + " Le Perfume — All Rights Reserved.";

    wrapperDT.appendChild(paymentDT);
    wrapperDT.appendChild(legalDT);
    wrapperDT.appendChild(copyrightDT);

    desktopGrid.insertAdjacentElement("afterend", wrapperDT);
  });

  /* ================= 5.4 أكورديون وصف المنتج ================= */
  waitFor("#headlessui-tabs-panel-\\:r1\\:", function (origDesc) {
    if (document.querySelector(".km-accordion-desc")) return;

    var descContent = origDesc.innerHTML;

    waitFor("#price", function (priceBlock) {
      var accordion = document.createElement("div");
      accordion.className = "km-accordion-desc";

      accordion.innerHTML = '\
        <button class="km-acc-header">\
          <img src="https://files.easy-orders.net/1765413887722331080.png" alt="icon" class="km-acc-icon" />\
          <span>Description</span>\
          <img class="arrow-icon" \
               src="https://img.icons8.com/material-rounded/24/expand-arrow--v1.png" \
               alt="arrow" />\
        </button>\
        <div class="km-acc-body" style="max-height:0;">' +
          descContent +
        "</div>\
      ";

      priceBlock.insertAdjacentElement("afterend", accordion);

      var header = accordion.querySelector(".km-acc-header");
      var body = accordion.querySelector(".km-acc-body");
      var arrow = accordion.querySelector(".arrow-icon");

      header.addEventListener("click", function () {
        var isOpen = header.classList.toggle("open");
        body.style.maxHeight = isOpen ? body.scrollHeight + "px" : "0";
        arrow.classList.toggle("rotate");
      });
    });
  });

});
