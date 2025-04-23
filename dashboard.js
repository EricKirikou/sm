document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const collapseToggle = document.getElementById('collapseToggle');

    // Ensure sidebar visibility is controlled from the start
    sidebar.classList.add('sidebar-loaded');

    // Apply collapse state before rendering to avoid flickering
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('sidebar-collapsed');
    }

    // Toggle sidebar collapse
    if (collapseToggle) {
        collapseToggle.addEventListener('click', function () {
            sidebar.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('sidebar-collapsed'));
        });
    }

    // Mobile sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('sidebar-open');
        });
    }

    // Swipe handling for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    });

    document.addEventListener("touchmove", (event) => {
        touchEndX = event.touches[0].clientX;
    });

    document.addEventListener("touchend", () => {
        let swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 100) {
            // Swipe right to open
            sidebar.classList.add("sidebar-open");
        } else if (swipeDistance < -100) {
            // Swipe left to close
            sidebar.classList.remove("sidebar-open");
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(event.target) &&
            !sidebarToggle.contains(event.target) &&
            sidebar.classList.contains('sidebar-open')) {
            sidebar.classList.remove('sidebar-open');
        }
    });
});
