import { getUserInfo } from '../js/utils/userUtils.js';

export async function createNav() {
  const currentPath = window.location.pathname;
  const isLoggedIn = !['/', '/login.html', '/signup.html'].includes(currentPath);
  const userInfo = isLoggedIn ? await getUserInfo() : null;

  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="${isLoggedIn ? '/dashboard.html' : '/'}">${isLoggedIn ? 'SecureVault' : 'SecureVault'}</a>
        ${isLoggedIn ? `
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link ${currentPath === '/dashboard.html' ? 'active' : ''}" href="/dashboard.html">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${currentPath === '/encrypt.html' ? 'active' : ''}" href="/encrypt.html">Encrypt New File</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${currentPath === '/files.html' ? 'active' : ''}" href="/files.html">My Files</a>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown">
                  <i class="bi bi-person-circle"></i> ${userInfo?.fullName || 'User'}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item ${currentPath === '/profile.html' ? 'active' : ''}" href="/profile.html">
                    <i class="bi bi-person"></i> My Profile
                  </a></li>
                  <li><a class="dropdown-item ${currentPath === '/keys.html' ? 'active' : ''}" href="/keys.html">
                    <i class="bi bi-key"></i> Encryption Keys
                  </a></li>
                  <li><a class="dropdown-item ${currentPath === '/settings.html' ? 'active' : ''}" href="/settings.html">
                    <i class="bi bi-gear"></i> Settings
                  </a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="/" id="logoutBtn">
                    <i class="bi bi-box-arrow-right"></i> Logout
                  </a></li>
                </ul>
              </li>
            </ul>
          </div>
        ` : `
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link ${currentPath === '/login.html' ? 'active' : ''}" href="/login.html">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${currentPath === '/signup.html' ? 'active' : ''}" href="/signup.html">Sign Up</a>
              </li>
            </ul>
          </div>
        `}
      </div>
    </nav>
  `;
}