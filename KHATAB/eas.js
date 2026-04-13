(function() {
    'use strict';

    let viewingInterval;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function updateLiveNumber() {
        const numElement = document.querySelector('.viewing-number');
        if (!numElement) return;

        let currentNum = parseInt(numElement.innerText);
        let nextNum = currentNum + getRandomInt(-2, 3);

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
        if (!actionButtonsContainer || document.querySelector('.custom-viewing-container')) return;

        const initialCount = getRandomInt(54, 75);
        const finalHTML = `
            <div class="custom-viewing-container">
                <svg id="icon-eye" viewBox="0 0 511.626 511.626"><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"></path></svg>
                <span class="text"><span class="viewing-number">${initialCount}</span> زائر يشاهد هذا المنتج الآن </span>
            </div>
            <div class="bleame-trust-badges">
                <div class="bleame-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#006196" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;flex-shrink:0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                    <p>ضمان 5 سنوات</p>
                </div>
                <div class="bleame-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#006196" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;flex-shrink:0;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                    <p style="font-size:15px;font-weight:500;margin:0;">14 يوم استبدال واسترجاع</p>
                </div>
            </div>`;

        actionButtonsContainer.insertAdjacentHTML('afterend', finalHTML);
        clearInterval(viewingInterval);
        viewingInterval = setInterval(updateLiveNumber, 3000);
    }
    function initProductButtons() {
        document.querySelectorAll('.group.box-border').forEach(card => {
            const priceWrapper = card.querySelector('.text-heading.mt-3\\.5');
            const oldBtn = card.querySelector('button[aria-label="Add to cart"]');

            if (!priceWrapper || !oldBtn || card.querySelector('.product_card_add_btn')) return;

            const newBtn = document.createElement('button');
            newBtn.className = 'product_card_add_btn';
            newBtn.innerText = 'أضف إلي السلة';
            newBtn.onclick = (e) => { e.stopPropagation(); oldBtn.click(); };

            priceWrapper.parentElement.appendChild(newBtn);
        });
    }
    function moveAndFixBreadcrumbs() {
        const source = document.querySelector('.hidden.md\\:block.pt-6 .mx-auto.flex.flex-wrap.items-center.gap-1');
        const target = document.querySelector('.flex.items-start');

        if (source && target && !document.querySelector('.js-moved-breadcrumb')) {
            const newBread = document.createElement('div');
            newBread.className = 'js-moved-breadcrumb';
            newBread.style.cssText = `display:flex; align-items:center; flex-wrap: wrap;margin-bottom:15px; font-size:11px !important; white-space:nowrap; color:#61758A;`;
            newBread.innerHTML = source.innerHTML;

            const style = document.createElement('style');
            style.innerHTML = `
                .js-moved-breadcrumb svg { display: none !important; }
                .js-moved-breadcrumb a::after { content: "/" !important; margin: 0 8px !important; color: #656464 !important; font-weight: 400 !important; }
                .js-moved-breadcrumb a { text-decoration: none !important; color: #656464b8 !important; display: flex; align-items: center; }
            `;
            document.head.appendChild(style);
            target.parentNode.insertBefore(newBread, target);

            const oldSection = document.querySelector('.hidden.md\\:block.pt-6');
            if (oldSection) oldSection.style.setProperty('display', 'none', 'important');
        }
    }

    function changeCategoriesTitle() {
        const sectionTitles = document.querySelectorAll('.home_section_top_title span.relative');
        
        sectionTitles.forEach(title => {
            if (title.childNodes[0] && title.childNodes[0].nodeValue.trim() === 'الأقسام') {
                title.childNodes[0].nodeValue = 'تسوق منتجاتنا';
            }
        });
    }

    function runAllTasks() {
        injectProductMeta();
        initProductButtons();
        moveAndFixBreadcrumbs();
        changeCategoriesTitle();
    }
    const observer = new MutationObserver(() => {
        runAllTasks();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    if (document.readyState === 'complete') runAllTasks();
    else window.addEventListener('load', runAllTasks);

})();
