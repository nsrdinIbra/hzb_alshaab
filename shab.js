document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    loadSiteData();
});

function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link[data-target]");
    const sections = document.querySelectorAll(".page-section");
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    // فتح وإغلاق القوائم المنسدلة عند النقر (مهم للهواتف)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            const parentLi = toggle.parentElement;
            const menu = parentLi.querySelector(".dropdown-menu");
            if (menu) {
                const isOpen = menu.style.display === "block";
                document.querySelectorAll(".dropdown-menu").forEach(m => m.style.display = "none");
                menu.style.display = isOpen ? "none" : "block";
            }
        });
    });

    // التنقل بين الأقسام
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            if (!targetId) return;

            sections.forEach(sec => sec.classList.remove("active-section"));
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.add("active-section");

            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // إغلاق القوائم المنسدلة بعد الاختيار
            document.querySelectorAll(".dropdown-menu").forEach(m => m.style.display = "none");

            // الصعود لأعلى الصفحة بسلاسة
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // إغلاق القوائم المنسدلة عند النقر خارجها
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown-menu").forEach(m => m.style.display = "none");
        }
    });
}

function loadSiteData() {
    fetch("ln.json")
        .then(response => {
            if (!response.ok) throw new Error("تعذر تحميل ملف ln.json");
            return response.json();
        })
        .then(data => {
            // دمج أخبار الحزب ومقالاته في قسم "أخبار ومقالات الحزب"
            const partyNewsAndArticles = [
                ...(Array.isArray(data.news) ? data.news : []),
                ...(Array.isArray(data.articles) ? data.articles : [])
            ];

            renderPosts(partyNewsAndArticles, "news-container");
            renderPosts(data.regional_news, "regional-news-container");
            renderPosts(data.state_challenges, "state-challenges-container");
            renderPosts(data.basic_papers, "basic-papers-container");
            renderPosts(data.important_papers, "important-papers-container");
            renderCampaigns(data.economy, "economy-container");
        })
        .catch(error => console.error("خطأ أثناء قراءة البيانات:", error));
}

function renderPosts(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = "";

    items.forEach(post => {
        const card = document.createElement("article");
        card.className = "post-card";
        card.style.cssText = "background: #ffffff; border-radius: 8px; padding: 22px; margin: 18px 0; box-shadow: 0 3px 10px rgba(0,0,0,0.08); text-align: right; border-right: 4px solid #27ae60;";

        card.innerHTML = `
            <h3 style="margin: 0 0 6px; color: #1a252f;">${post.title || ""}</h3>
            ${post.date ? `<small style="display: block; color: #7f8c8d; margin-bottom: 14px;">📅 ${post.date}</small>` : ""}
            <div style="line-height: 1.9; color: #2c3e50;">${post.content || ""}</div>
        `;

        container.appendChild(card);
    });
}

function renderCampaigns(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = "";

    items.forEach(item => {
        const goalsHtml = Array.isArray(item.goals) && item.goals.length > 0
            ? `<h4 style="color: #c0392b; margin: 15px 0 10px;">${item.goals_title || ""}</h4>
               <ul style="text-align: right; line-height: 1.9; color: #2c3e50; padding-right: 20px;">
                   ${item.goals.map(goal => `<li>${goal}</li>`).join("")}
               </ul>`
            : "";

        const card = document.createElement("article");
        card.className = "news-card";
        card.style.cssText = "background: #fff; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 3px 10px rgba(0,0,0,0.08); text-align: right;";

        card.innerHTML = `
            ${item.image ? `<img src="${item.image}" alt="${item.campaign_title || ""}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;">` : ""}
            <h3 style="color: #1a252f; margin-top: 0;">${item.campaign_title || ""}</h3>
            ${item.campaign_subtitle ? `<p style="color: #27ae60; font-weight: bold;">${item.campaign_subtitle}</p>` : ""}
            <p style="line-height: 1.8; color: #333;">${item.description || ""}</p>
            ${goalsHtml}
            ${item.footer_text ? `<p style="margin-top: 15px; font-weight: bold; color: #1a252f;">${item.footer_text}</p>` : ""}
            ${item.hashtag ? `<span style="display: inline-block; background: #eafaf1; color: #27ae60; padding: 5px 12px; border-radius: 4px; font-weight: bold; margin-top: 10px;">${item.hashtag}</span>` : ""}
        `;

        container.appendChild(card);
    });
}
