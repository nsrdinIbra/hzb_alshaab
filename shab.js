document.addEventListener("DOMContentLoaded", function() {
    // === 1. نظام الملاحة والتحكم بالأزرار ===
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            sections.forEach(sec => sec.classList.remove('active-section'));

            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
        });
    });

    // === 2. جلب بيانات "آخر الأخبار" من ملف lastnews.json ===
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        fetch('lastnews.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('تعذر تحميل ملف آخر الأخبار');
                }
                return response.json();
            })
            .then(data => {
                let newsHTML = "";
                // افترضنا أن البيانات عبارة عن مصفوفة داخل الملف أو الملف نفسه مصفوفة
                const articles = Array.isArray(data) ? data : (data.articles || []);
                
                articles.forEach(news => {
                    newsHTML += `
                        <div class="news-card" style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 6px; border-right: 5px solid rgb(82, 223, 101); text-align: right;">
                            <span class="news-date" style="color: gray; font-size: 13px;">📅 ${news.date}</span>
                            <h3 style="color: rgb(15, 10, 85); margin: 5px 0;">${news.title}</h3>
                            <p style="color: rgb(19, 7, 47); text-align: right; margin: 0;">${news.summary || news.content}</p>
                        </div>
                    `;
                });
                newsContainer.innerHTML = newsHTML;
            })
            .catch(error => {
                console.error("خطأ في جلب lastnews.json:", error);
                newsContainer.innerHTML = "<p style='color: red; text-align: center;'>عذراً، تعذر تحميل الأخبار حالياً.</p>";
            });
    }

    // === 3. تحميل تعليقات Disqus في الصفحة الرئيسية ===
    if (document.getElementById('disqus_thread')) {
        window.disqus_config = function () {
            this.page.url = 'https://hzbalshaab.vercel.app/'; // رابط موقعك الحي
            this.page.identifier = 'statement_06_nov_2026'; // معرف المقال والبيان
        };

        var dsq = document.createElement('script'); 
        dsq.type = 'text/javascript'; 
        dsq.async = true;
        dsq.src = 'https://shaab.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }
});
