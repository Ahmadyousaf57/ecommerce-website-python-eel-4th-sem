// Initialize chat after admin logs in
async function initializeAdminChat() {
    try {
        const adminId = await eel.get_admin_id()();
        if (adminId) {
            const adminUser = { id: adminId, name: "Admin" };
            initChat(adminUser);
        } else {
            console.error("Admin not found in database");
        }
    } catch (error) {
        console.error("Error initializing admin chat:", error);
    }
}
// Load user profile picture
async function loadUserProfile() {
    try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const profilePic = await eel.get_profile_picture(userEmail)();
            if (profilePic) {
                const imgElement = document.getElementById('userProfilePic');
                imgElement.src = `data:image/jpeg;base64,${profilePic}`;
            }
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}
// Call when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat
    initializeAdminChat();
    loadUserProfile();
    // Toggle sidebar
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const mobileToggleSidebar = document.getElementById('mobileToggleSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const welcomeScreen = document.getElementById('welcome-screen');
    const showDashboardBtn = document.getElementById('show-dashboard');

    // Initially hide all pages and show welcome screen
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    welcomeScreen.style.display = 'flex';

    // Toggle sidebar from header button (desktop)
    toggleSidebar.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-collapsed');
        mainContent.classList.toggle('main-content-expanded');
        
        // Change icon based on state
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('sidebar-collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    });

    // Toggle sidebar from mobile menu button
    mobileToggleSidebar.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Close sidebar from sidebar close button (mobile)
    sidebarClose.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    // Handle menu item clicks
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Get the page to show
            const pageId = this.getAttribute('data-page');
            
            // Hide welcome screen and all pages
            welcomeScreen.style.display = 'none';
            pages.forEach(page => page.classList.remove('active'));
            
            // Show the selected page
            const activePage = document.getElementById(pageId);
            if (activePage) {
                activePage.classList.add('active');
            }
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Show dashboard when button is clicked
    showDashboardBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById('dashboard').classList.add('active');
        
        // Set dashboard menu item as active
        menuItems.forEach(i => i.classList.remove('active'));
        document.querySelector('[data-page="dashboard"]').classList.add('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && 
                !mobileToggleSidebar.contains(e.target) && 
                !sidebarClose.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
        }
    });
});