document.addEventListener("DOMContentLoaded", function() {
    
    // 1. نظام التحكم بالأقسام والتنقل
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

    // 2. نظام مصفوفة الأخبار اليومية
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        const dailyNews = [
            {
                title: "انعقاد الاجتماع الدوري لمكتب الشؤون الاقتصادية ومعاش الناس",
                date: "2026-10-29",
                summary: "ناقش الاجتماع أبرز التحديات المعيشية ووضع خطط مقترحة للتخفيف عن المواطنين."
            },
            {
                title: "إطلاق المبادرة المجتمعية لدعم الخدمات الأساسية",
                date: "2026-10-28",
                summary: "أعلن الحزب عن بدء سلسلة من الندوات والورش التدريبية لرفع الوعي المجتمعي."
            }
        ];

        let newsHTML = "";
        dailyNews.forEach(news => {
            newsHTML += `
                <div class="news-card">
                    <span class="news-date">📅 ${news.date}</span>
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                </div>`;
        });
        newsContainer.innerHTML = newsHTML;
    }

    // 3. نظام "آخر البيانات للحزب" مع تفعيل التعليقات الديناميكية عند إضافة أي بيان جديد
    const statementsContainer = document.getElementById('statements-container');
    if (statementsContainer) {
        // مصفوفة البيانات (أضف بيانك الجديد هنا في أعلى المصفوفة ليظهر تلقائياً ويعمل له صندوق تعليقات خاص به)
        const partyStatements = [
            {
                id: "statement_statement_2026_10_30", // معرف فريد وحصري للتعليقات
                title: "البيان الصحفي الأخير بشأن التنمية المستدامة والمواقف الراهنة",
                date: "2026-10-30",
                content: "يؤكد حزب الشعب السوداني في بيانه الأخير على أولوية تحسين الأوضاع المعيشية ودعم الخدمات الأساسية لكافة المواطنين، مشدداً على ضرورة تكاتف الجهود الوطنية والمجتمعية لتجاوز التحديات الراهنة وبناء مستقبل مستقر يضمن الكرامة والتنمية للجميع."
            }
        ];

        let statementsHTML = "";
        partyStatements.forEach(statement => {
            statementsHTML += `
                <div class="statement-item-card">
                    <span class="statement-date">📅 تاريخ النشر: ${statement.date}</span>
                    <h3>📢 ${statement.title}</h3>
                    <p>${statement.content}</p>
                </div>`;
        });
        statementsContainer.innerHTML = statementsHTML;

        // تهيئة وحمل نظام التعليقات للبيان الأحدث بشكل تلقائي
        if(partyStatements.length > 0) {
            loadCommentsForStatement(partyStatements[0]);
        }
    }

    // دالة محرك التعليقات الديناميكي لمنع مشاكل الـ Iframe والتحديث المتزامن
    function loadCommentsForStatement(statement) {
        const wrapper = document.getElementById('comments-wrapper');
        const thread = document.getElementById('cusdis_thread');
        
        if (thread && wrapper) {
            wrapper.style.display = 'block';
            
            // حقن البيانات الحصرية للبيان الجديد داخل أداة Cusdis
            thread.setAttribute('data-page-id', statement.id);
            thread.setAttribute('data-page-title', statement.title);
            thread.setAttribute('data-page-url', window.location.href + "?id=" + statement.id);
            
            // عمل Re-render لـ Cusdis إذا كانت المكتبة محملة مسبقاً في الـ DOM
            if (window.Cusdis && typeof window.Cusdis.render === 'function') {
                window.Cusdis.render(thread);
            }
        }
    }
});
