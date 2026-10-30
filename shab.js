document.addEventListener("DOMContentLoaded", function() {
    // === 1. نظام الملاحة والتحكم بالأزرار الأربعة الأصلي ===
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

    // === 2. نظام مصفوفة الأخبار اليومية التلقائي ===
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        const dailyNews = [
            {
                title: "انعقاد الاجتماع الدوري لمكتب الشؤون الاقتصادية ومعاش الناس",
                date: "2026-10-29",
                summary: "ناقش الاجتماع أبرز التحديات المعيشية ووضع خطط مقترحة للتخفيف عن المواطنين، وسط تفاعل واسع من الأعضاء."
            },
            {
                title: "إطلاق المبادرة المجتمعية لدعم الخدمات الأساسية",
                date: "2026-10-28",
                summary: "أعلن الحزب عن بدء سلسلة من الندوات والورش التدريبية لرفع الوعي المجتمعي والخدمي في مختلف المناطق."
            },
            {
                title: "بيان هام بشأن التطورات السياسية الراهنة",
                date: "2026-10-27",
                summary: "أصدر الحزب بياناً صحفياً يوضح فيه رؤيته المستقبلية للحلول السلمية والديمقراطية."
            }
        ];

        let newsHTML = "";
        dailyNews.forEach(news => {
            newsHTML += `
                <div class="news-card" style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 6px; border-right: 5px solid rgb(82, 223, 101); text-align: right;">
                    <span class="news-date" style="color: gray; font-size: 13px;">📅 ${news.date}</span>
                    <h3 style="color: rgb(15, 10, 85); margin: 5px 0;">${news.title}</h3>
                    <p style="color: rgb(19, 7, 47); text-align: right; margin: 0;">${news.summary}</p>
                </div>
            `;
        });
        newsContainer.innerHTML = newsHTML;
    }

    // === 3. محرك تهيئة Disqus المباشر والمستقر 100% ===
    window.disqus_config = function () {
        this.page.url = 'https://hzbalshaab.vercel.app/'; // رابط موقعك الحي الثابت
        this.page.identifier = 'statement_29_oct_2026'; // معرف البيان
    };

    // حقن الصندوق مباشرة في حاوية الـ HTML
    var dsq = document.createElement('script'); 
    dsq.type = 'text/javascript'; 
    dsq.async = true;
    dsq.src = 'https://shaab.disqus.com/embed.js'; // استدعاء ملف الـ Embed لحسابك shaab
    (document.getElementsByTagName('head') || document.getElementsByTagName('body')).appendChild(dsq);
});
