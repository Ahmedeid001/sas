/* =============================================
   Bibasata Software – Combined Scripts
   ============================================= */

(function () {
    'use strict';

    /* ─── 1. Creative Loader Dismiss ─── */
    (function () {
        var minDisplayTime = 800;
        var loadStartTime = Date.now();

        function dismissLoader() {
            var loader = document.getElementById('bib-creative-loader');
            if (!loader) return;
            loader.classList.add('fade-out');
            setTimeout(function () {
                if (loader.parentNode) loader.remove();
            }, 450);
        }

        window.addEventListener('load', function () {
            var timePassed = Date.now() - loadStartTime;
            var timeRemaining = Math.max(0, minDisplayTime - timePassed);
            setTimeout(dismissLoader, timeRemaining);
        });

        setTimeout(dismissLoader, 3000);
    })();

    /* ─── 2. Bib Bento Footer Setup ─── */
    (function () {
        function setupBibFooter() {
            var footers = document.querySelectorAll('#bib-bento-footer');
            if (footers.length === 0) return;

            // Remove duplicates
            for (var j = 1; j < footers.length; j++) {
                footers[j].parentNode.removeChild(footers[j]);
            }

            var footer = footers[0];

            // Hide old footers
            document.querySelectorAll('footer:not(#bib-bento-footer)').forEach(function (el) {
                el.style.display = 'none';
            });

            // Move to end of body
            if (footer.parentNode !== document.body || footer.nextSibling !== null) {
                document.body.appendChild(footer);
            }

            requestAnimationFrame(function () {
                footer.classList.add('is-ready');
            });
        }

        if (document.readyState === 'complete') {
            setupBibFooter();
        } else {
            window.addEventListener('load', setupBibFooter);
        }

        setTimeout(setupBibFooter, 500);
        setTimeout(setupBibFooter, 2000);
    })();

    /* ─── 3. Product Cards (Buttons + Price Formatting) ─── */
    (function () {
        var CONFIG = {
            btnText: 'فعل اشتراكك 🚀',
            pricePrefix: 'LE ',
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
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            el.innerHTML = CONFIG.pricePrefix + formatted;
            el.style.direction = 'rtl';
            el.style.fontFamily = 'sans-serif';
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
        '.flex.items-center.gap-1.text-xl.md\\:text-\\[32px\\].font-bold.text-\\[\\#010101\\]',
        '.text-2xl.md\\:text-\\[32px\\].font-bold' // تم إضافة هذا الكلاس هنا
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

        new MutationObserver(debouncedRun).observe(document.body, {
            childList: true,
            subtree: true
        });
    })();

    /* ─── 4. Icons Carousel (bib-icons-slider) ─── */
    (function () {
        var tries = 0;
        var MAX_TRIES = 30;

        function initBibIconsCarousel() {
            var region = document.getElementById('bib-icons-slider');
            var dots = document.querySelectorAll('.bib-dots button');
            if (!region || dots.length === 0) return false;

            function itemWidth() {
                var first = region.querySelector('.bib-item');
                return first ? first.getBoundingClientRect().width : region.clientWidth;
            }

            function setDot(i) {
                dots.forEach(function (d, idx) {
                    d.setAttribute('aria-current', String(idx === i));
                });
            }

            function scrollToIndex(i) {
                var w = itemWidth();
                region.scrollTo({ left: -Math.round(i * w), behavior: 'smooth' });
                setDot(i);
            }

            // Auto-play
            var autoPlayTimer;
            var currentIndex = 0;

            function startAutoPlay() {
                stopAutoPlay();
                autoPlayTimer = setInterval(function () {
                    if (window.innerWidth > 992) return;
                    var w = itemWidth();
                    currentIndex = Math.round(Math.abs(region.scrollLeft) / w);
                    currentIndex++;
                    if (currentIndex >= dots.length) currentIndex = 0;
                    scrollToIndex(currentIndex);
                }, 3000);
            }

            function stopAutoPlay() {
                clearInterval(autoPlayTimer);
            }

            function resetAutoPlay() {
                stopAutoPlay();
                startAutoPlay();
            }

            dots.forEach(function (d, i) {
                d.addEventListener('click', function () {
                    scrollToIndex(i);
                    resetAutoPlay();
                });
            });

            var ticking = false;
            region.addEventListener('scroll', function () {
                if (window.innerWidth > 992 || ticking) return;
                ticking = true;
                requestAnimationFrame(function () {
                    var w = itemWidth();
                    var i = Math.round(Math.abs(region.scrollLeft) / w);
                    setDot(Math.max(0, Math.min(i, dots.length - 1)));
                    ticking = false;
                });
            }, { passive: true });

            region.addEventListener('mouseenter', stopAutoPlay);
            region.addEventListener('mouseleave', startAutoPlay);
            region.addEventListener('touchstart', stopAutoPlay, { passive: true });
            region.addEventListener('touchend', startAutoPlay);

            startAutoPlay();
            return true;
        }

        var interval = setInterval(function () {
            tries++;
            if (initBibIconsCarousel() || tries > MAX_TRIES) {
                clearInterval(interval);
            }
        }, 300);
    })();

    /* ─── 5. Reviews Carousel (review-track) ─── */
    (function () {
        function initReviewCarousel() {
            var track = document.getElementById('review-track');
            var nextBtn = document.querySelector('.carousel-arrow.next');
            var prevBtn = document.querySelector('.carousel-arrow.prev');

            if (!track || !nextBtn || !prevBtn || track.dataset.initialized) return false;

            track.dataset.initialized = 'true';

            function getScrollAmount() {
                var card = track.querySelector('.carousel-card');
                return card ? card.offsetWidth + 20 : 280;
            }

            // Manual controls
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });

            // Auto-scroll
            var autoScrollTimer;

            function startAutoScroll() {
                autoScrollTimer = setInterval(function () {
                    var maxScroll = track.scrollWidth - track.clientWidth;
                    if (Math.abs(track.scrollLeft) >= maxScroll - 20) {
                        track.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                    }
                }, 2500);
            }

            function stopAutoScroll() {
                clearInterval(autoScrollTimer);
            }

            startAutoScroll();

            track.addEventListener('mouseenter', stopAutoScroll);
            track.addEventListener('mouseleave', startAutoScroll);
            track.addEventListener('touchstart', stopAutoScroll, { passive: true });
            track.addEventListener('touchend', startAutoScroll);

            return true;
        }

        // Try init immediately
        initReviewCarousel();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initReviewCarousel);
        }

        // Polling fallback
        var attempts = 0;
        var maxAttempts = 20;
        var pollingTimer = setInterval(function () {
            if (initReviewCarousel() || attempts >= maxAttempts) {
                clearInterval(pollingTimer);
            }
            attempts++;
        }, 500);

        // Mutation observer fallback
        new MutationObserver(function () {
            var track = document.getElementById('review-track');
            if (track && !track.dataset.initialized) {
                initReviewCarousel();
            }
        }).observe(document.body, { childList: true, subtree: true });
    })();

})();
