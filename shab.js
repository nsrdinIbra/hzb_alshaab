document.addEventListener("DOMContentLoaded", function() {
    // === 1. نظام الملاحة والتحكم بالأزرار والأقسام ===
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

    // === 2. جلب وعرض البيان الرئيسي في الصفحة الرئيسية (bian.json) ===
    const homeContent = document.getElementById('home-content');
    if (homeContent) {
        fetch('bian.json')
            .then(response => {
                if (!response.ok) throw new Error('تعذر تحميل ملف البيان الرئيسي');
                return response.json();
            })
            .then(data => {
                let paragraphsHTML = '';
                if (data.paragraphs && Array.isArray(data.paragraphs)) {
                    data.paragraphs.forEach(p => {
                        paragraphsHTML += `<p>${p}</p>`;
                    });
                }

                let pointsHTML = '';
                if (data.declaration_points && Array.isArray(data.declaration_points)) {
                    data.declaration_points.forEach(pt => {
                        pointsHTML += `<li>${pt}</li>`;
                    });
                }

                homeContent.innerHTML = `
                    <article class="statement-card">
                        <h3>📢 ${data.title}</h3>
                        
                        <div class="date">
                            📅 تاريخ النشر: ${data.date} | 💬 
                            <a href="#disqus_thread" data-disqus-identifier="${data.disqus_id}" style="color: #555; text-decoration: none; font-weight: bold;">جاري تحميل التعليقات...</a>
                        </div>
                        
                        <div class="statement-content">
                            <p class="bismillah-statement" style="text-align: center; font-weight: bold; margin-bottom: 15px;">${data.bismillah}</p>
                            
                            ${paragraphsHTML}

                            <div class="declaration-box" style="background: #f9f9f9; border-right: 4px solid #b71c1c; padding: 15px; margin: 15px 0; border-radius: 4px;">
                                <h4 style="margin-top: 0; color: #b71c1c;">${data.declaration_title}</h4>
                                <ol style="padding-right: 20px; margin-bottom: 0; line-height: 1.8;">
                                    ${pointsHTML}
                                </ol>
                            </div>

                            <p style="text-align: center; font-weight: bold; margin-top: 20px;">
                                ${data.conclusion}
                            </p>
                            
                            <p style="text-align: left; font-weight: bold; color: #555; margin-top: 15px;">
                                ${data.signature}
                            </p>

                            ${data.image ? `
                            <div style="text-align: center; margin-top: 25px;">
                                <img src="${data.image}" alt="صورة البيان" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            </div>` : ''}
                        </div>

                        <!-- حاوية تعليقات Disqus -->
                        <div class="comments-section" style="margin-top: 30px;">
                            <h4>💬 آراء وتعليقات عامة الشعب حول البيان</h4>
                            <div id="disqus_thread"></div>
                        </div>
                    </article>
                `;

                // تحميل تعليقات Disqus بعد عرض الكود في الصفحة
                loadDisqus(data.disqus_id);
            })
            .catch(error => console.error("خطأ في جلب بيان الرئيسية:", error));
    }

    // === 3. جلب وعرض آخر الأخبار (lastnews.json) ===
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        fetch('lastnews.json')
            .then(response => {
                if (!response.ok) throw new Error('تعذر تحميل ملف الأخبار');
                return response.json();
            })
            .then(data => {
                let newsHTML = "";
                const articles = Array.isArray(data) ? data : (data.articles || []);
                
                articles.forEach(news => {
                    newsHTML += `
                        <article class="statement-card" style="margin-top: 25px;">
                            <h3>🚨 ${news.title}</h3>
                            <div class="date">📅 تاريخ النشر: ${news.date}</div>
                            <div class="statement-content" style="margin-top: 15px;">
                                <p>${news.content}</p>
                                <p style="text-align: left; font-weight: bold; color: #555; margin-top: 20px;">حزب الشعب - السودان</p>
                            </div>
                        </article>
                    `;
                });
                newsContainer.innerHTML = newsHTML;
            })
            .catch(error => console.error("خطأ في جلب الأخبار:", error));
    }

    // === 4. جلب وعرض قسم الاقتصاد ومعاش الناس (pl.json) ===
    const economyContainer = document.getElementById('economy-container');
    if (economyContainer) {
        fetch('pl.json')
            .then(response => {
                if (!response.ok) throw new Error('تعذر تحميل ملف الاقتصاد');
                return response.json();
            })
            .then(data => {
                let goalsHTML = "";
                if (data.goals && Array.isArray(data.goals)) {
                    data.goals.forEach(goal => {
                        goalsHTML += `<li>${goal}</li>`;
                    });
                }

                economyContainer.innerHTML = `
                    <p>رؤية الحزب لحل الأزمات الاقتصادية وتخفيف الأعباء المعيشية عن كاهل المواطن:</p>
                    <div class="economy-content" style="margin-top: 20px;">
                        <div style="background: #ffffff; padding: 25px; border-radius: 8px; border-right: 5px solid #d35400; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 25px;">
                            <h3 style="color: #d35400; margin-top: 0; font-size: 1.4rem;">${data.campaign_title}</h3>
                            <p style="font-weight: bold; color: #555; margin-bottom: 15px;">${data.campaign_subtitle}</p>
                            
                            <p style="line-height: 1.8; color: #333;">${data.description}</p>

                            <div style="background: #fdfefe; border: 1px solid #ebedef; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
                                <h4 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px;">${data.goals_title}</h4>
                                <ul style="padding-right: 20px; line-height: 1.8; margin: 0; color: #444;">
                                    ${goalsHTML}
                                </ul>
                            </div>

                            <p style="line-height: 1.8; color: #333; font-weight: 500;">${data.footer_text}</p>

                            <div style="margin-top: 15px; font-weight: bold; color: #d35400; font-size: 1.1rem;">
                                ${data.hashtag}
                            </div>

                            ${data.image ? `
                            <div style="text-align: center; margin-top: 25px;">
                                <img src="${data.image}" alt="صورة حملة معاش الناس" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            </div>` : ''}
                        </div>
                    </div>
                `;
            })
            .catch(error => console.error("خطأ في جلب بيانات الاقتصاد:", error));
    }

    // === دالة تشغيل تعليقات Disqus ديناميكياً ===
    function loadDisqus(identifier) {
        if (document.getElementById('disqus_thread')) {
            window.disqus_config = function () {
                this.page.url = 'https://hzbalshaab.vercel.app/'; 
                this.page.identifier = identifier; 
            };

            // إزالة السكريبت القديم إن وجد لتفادي التداخل
            const existingScript = document.getElementById('dsq-embed-script');
            if (existingScript) existingScript.remove();

            var dsq = document.createElement('script'); 
            dsq.id = 'dsq-embed-script';
            dsq.type = 'text/javascript'; 
            dsq.async = true;
            dsq.src = 'https://shaab.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        }
    }
});
