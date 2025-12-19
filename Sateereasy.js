Test 
    
    
    
    <script>
(function () {

    let lastScroll = 0;
    let ticking = false;

    function onScroll(header) {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll <= 0) {
            header.classList.remove("header--hidden");
            header.classList.add("header--visible");
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll Down
            header.classList.remove("header--visible");
            header.classList.add("header--hidden");
        } else {
            // Scroll Up
            header.classList.remove("header--hidden");
            header.classList.add("header--visible");
        }

        lastScroll = currentScroll;
    }

    function waitForHeader(cb) {
        const i = setInterval(() => {
            const header = document.querySelector("header.default_header");
            if (header) {
                clearInterval(i);
                cb(header);
            }
        }, 200);
    }

    document.addEventListener("DOMContentLoaded", function () {
        waitForHeader(function (header) {

            header.classList.add("header--visible");

            window.addEventListener("scroll", function () {
                if (!ticking) {
                    window.requestAnimationFrame(function () {
                        onScroll(header);
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

        });
    });

})();
</script>
