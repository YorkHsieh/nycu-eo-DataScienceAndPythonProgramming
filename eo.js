const home = document.querySelector("#home");
const course = document.querySelector("#course");
const enterButton = document.querySelector("#enter-course");
const backHomeButton = document.querySelector("#back-home");

const menuButton = document.querySelector("#menu-toggle");
const sidebar = document.querySelector("#sidebar");

const frame = document.querySelector("#lesson-frame");
const resourcesPanel = document.querySelector("#resources-panel");
const resourcesButton = document.querySelector("#show-resources");

const lessonLinks = sidebar.querySelectorAll("section a");
const navigationItems = [resourcesButton, ...lessonLinks];

// 用網址找 A_1，避免誤選最前面的環境建置講義
const firstLesson = [...lessonLinks].find((link) => {
    return new URL(link.href).pathname.endsWith("/SyafQIPN-g");
});

let hasEntered = false;

// 開關目錄
function setMenu(open) {
    sidebar.hidden = !open;

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
        "aria-label",
        open ? "關閉課程選單" : "開啟課程選單"
    );
}

// 切換閱讀區與下載區
function showPanel(panel, selectedItem) {
    resourcesPanel.hidden = panel !== "resources";
    frame.hidden = panel !== "lesson";

    navigationItems.forEach((item) => {
        item.removeAttribute("aria-current");
    });

    selectedItem.setAttribute("aria-current", "page");
}

// 載入講義
function openLesson(link) {
    frame.removeAttribute("srcdoc");
    frame.src = link.href;
    frame.title = link.textContent.trim();

    showPanel("lesson", link);
}

// 手機選完內容後關閉目錄
function closeMobileMenu() {
    if (window.matchMedia("(max-width: 700px)").matches) {
        setMenu(false);
        menuButton.focus();
    }
}

// 首頁 → 課程
enterButton.addEventListener("click", () => {
    home.hidden = true;
    course.hidden = false;

    // 只有第一次進入才載入 A_1
    if (!hasEntered) {
        if (firstLesson) {
            openLesson(firstLesson);
        }

        // 電腦展開目錄，手機收起
        setMenu(window.matchMedia("(min-width: 701px)").matches);
        hasEntered = true;
    }

    menuButton.focus();
});

// Logo＋課程名稱 → 首頁
backHomeButton.addEventListener("click", () => {
    course.hidden = true;
    home.hidden = false;
    enterButton.focus();
});

// 展開／收起目錄
menuButton.addEventListener("click", () => {
    const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

    setMenu(!isOpen);
});

// 顯示資源下載區
resourcesButton.addEventListener("click", () => {
    showPanel("resources", resourcesButton);
    closeMobileMenu();
});

// 選擇講義
lessonLinks.forEach((link) => {
    link.target = "lesson-frame";

    link.addEventListener("click", (event) => {
        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();

        openLesson(link);
        closeMobileMenu();
    });
});

// Escape 關閉目錄
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        !sidebar.hidden &&
        !course.hidden
    ) {
        setMenu(false);
        menuButton.focus();
    }
});

// 初始狀態
setMenu(false);