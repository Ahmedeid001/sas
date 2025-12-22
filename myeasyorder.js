
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
document.addEventListener("DOMContentLoaded", function() {
   
    const buttons = document.querySelectorAll('button, .category_products_grid_card');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left; // مكان الماوس جوه الزرار
            const y = e.clientY - rect.top;
            
            btn.style.transform = `translate(${(x - rect.width/2)/5}px, ${(y - rect.height/2)/5}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            // يرجع مكانه لما الماوس يبعد
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.3s ease-out';
        });
        
        btn.addEventListener('mouseenter', function() {
            btn.style.transition = 'none'; // عشان الحركة تكون فورية مع الماوس
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {

    var targets = document.querySelectorAll('.category_products_grid_card, .category_card, h3, h2');

    // 2. إعداد المراقب (Observer)
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // عشان يشتغل مرة واحدة بس ميفضلش يروح ويجي
            }
        });
    }, { threshold: 0.1 }); // يشتغل لما 10% من العنصر يبان

    // 3. تطبيق الكلاس على العناصر
    targets.forEach(function(target) {
        target.classList.add('reveal-on-scroll');
        observer.observe(target);
    });
});
const API_KEY = "705af426-ebaa-4dbc-a733-0b6bc785fd31";


function openCategory(evt, categoryName) {
    var tabcontent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    
    var tablinks = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    
    document.getElementById(categoryName).style.display = "block";
    
    if(evt) evt.currentTarget.classList.add("active");
    
    const container = document.querySelector(`#${categoryName} .products-horizontal-row`);
    const btn = document.querySelector(`.tab-btn[onclick*="${categoryName}"]`);
    if(btn && container) {
        const id = btn.getAttribute('data-id');
        loadDataSafe(id, container);
    }
}

function loadDataSafe(id, container) {

    if (id && container && (container.innerHTML.trim() === "" || container.querySelector('.loading-spinner'))) {
        fetchProductsHybrid(id, container);
    }
}


async function fetchProductsHybrid(id, container) {
   
    if (!container.innerHTML.includes('product-card-item')) {
        container.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
    }
    
    let url = `/api/v1/products?category_id=${id}&limit=8`;
    let headers = { 'Content-Type': 'application/json' };

    try {
        let response = await fetch(url, { headers });

        if (!response.ok) {
            url = `https://api.easy-orders.net/api/v1/external-apps/products?category_id=${id}&limit=8`;
            url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            headers['Api-Key'] = API_KEY;
            response = await fetch(url, { headers });
        }

        if (!response.ok) throw new Error(`Error`);

        const json = await response.json();
        const products = Array.isArray(json) ? json : (json.data || json.products || []);

        if (products.length > 0) {
            let html = '';
            products.forEach((p, i) => {
                const title = p.name || p.title || "منتج";
                let rawPrice = p.price || p.sale_price || 0;
                const price = Math.floor(Number(rawPrice));
                
                let img = "https://via.placeholder.com/300?text=No+Image";
                if (p.thumb) img = p.thumb;
                else if (p.image) img = p.image;
                else if (p.images && p.images.length > 0) img = p.images[0].url || p.images[0];
                else if (p.cover) img = p.cover;

                if (img && !img.startsWith('http') && !img.startsWith('//')) {
                    img = `https://files.easy-orders.net/${img.replace(/^\//, '')}`;
                }

                const slug = p.slug || p.id;
                const link = `/products/${slug}`;
                const delay = i * 0.1;

                html += `
                <div class="product-card-item product-card-animate" style="animation-delay: ${delay}s;">
                    <a href="${link}" class="block w-full h-full cursor-pointer">
                        <div class="group box-border flex flex-col items-start bg-white relative h-full">
                            <div class="img-holder">
                                <img src="${img}" width="300" height="350" loading="lazy" decoding="async" alt="${title}">
                            </div>
                            <div class="card-details w-full">
                                <h3 class="card-title">${title}</h3>
                                <div class="card-price">${price} EGP</div>
                            </div>
                        </div>
                    </a>
                </div>`;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p style="padding:20px; text-align:center;">لا توجد منتجات.</p>';
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="padding:20px; text-align:center; color:red;">خطأ في التحميل</p>`;
    }
}

function initFirstTab() {
    // ID القسم الأول (RUGS)
    const firstID = "4a8e9aff-534a-4951-96c9-2e133270a836"; 
    // الكونتينر الأول
    const firstContainer = document.querySelector('#tab-rug .products-horizontal-row');
    
    if(firstContainer) {
        loadDataSafe(firstID, firstContainer);
    }
}

initFirstTab();

setTimeout(initFirstTab, 1000);


(function() {
    // دالة تعمل فور النقر على أي مكان في الصفحة
    document.addEventListener('click', function(e) {
        
        // 1. هل النقر حدث على "نقطة" (أو بداخلها)؟
        const clickedSpot = e.target.closest('.hotspot-point');
        
        // 2. هل النقر حدث داخل "الكارت" نفسه؟ (لمنع الإغلاق عند محاولة الشراء)
        const clickedCard = e.target.closest('.hotspot-product-card');

        if (clickedCard) {
            // إذا ضغط داخل الكارت، لا تفعل شيئاً (اتركه مفتوحاً)
            return;
        }

        if (clickedSpot) {
            // === المستخدم ضغط على النقطة ===
            
            // تحقق هل هي مفتوحة أصلاً؟
            const isAlreadyActive = clickedSpot.classList.contains('active-spot');

            // أغلق جميع النقاط الأخرى أولاً
            document.querySelectorAll('.hotspot-point.active-spot').forEach(spot => {
                spot.classList.remove('active-spot');
            });

            // إذا لم تكن مفتوحة، افتحها
            if (!isAlreadyActive) {
                clickedSpot.classList.add('active-spot');
            }

        } else {
            // === المستخدم ضغط في الفراغ (خارج النقاط والكروت) ===
            // أغلق كل شيء
            document.querySelectorAll('.hotspot-point.active-spot').forEach(spot => {
                spot.classList.remove('active-spot');
            });
        }
    });
})();
