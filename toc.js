// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="前言.html"><strong aria-hidden="true">1.</strong> 前言</a></li><li class="chapter-item expanded affix "><li class="part-title">Books</li><li class="chapter-item expanded "><a href="推荐系统实践/推荐系统实践.html"><strong aria-hidden="true">2.</strong> 推荐系统实践</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="推荐系统实践/好的推荐系统.html"><strong aria-hidden="true">2.1.</strong> 好的推荐系统</a></li><li class="chapter-item expanded "><a href="推荐系统实践/利用用户行为数据.html"><strong aria-hidden="true">2.2.</strong> 利用用户行为数据</a></li><li class="chapter-item expanded "><a href="推荐系统实践/推荐系统冷启动问题.html"><strong aria-hidden="true">2.3.</strong> 推荐系统冷启动问题</a></li><li class="chapter-item expanded "><a href="推荐系统实践/利用用户标签数据.html"><strong aria-hidden="true">2.4.</strong> 利用用户标签数据</a></li><li class="chapter-item expanded "><a href="推荐系统实践/利用上下文信息.html"><strong aria-hidden="true">2.5.</strong> 利用上下文信息</a></li><li class="chapter-item expanded "><a href="推荐系统实践/利用社交网络数据.html"><strong aria-hidden="true">2.6.</strong> 利用社交网络数据</a></li><li class="chapter-item expanded "><a href="推荐系统实践/推荐系统实例.html"><strong aria-hidden="true">2.7.</strong> 推荐系统实例</a></li><li class="chapter-item expanded "><a href="推荐系统实践/评分预测问题.html"><strong aria-hidden="true">2.8.</strong> 评分预测问题</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Papers</li><li class="chapter-item expanded affix "><li class="part-title">Courses</li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
