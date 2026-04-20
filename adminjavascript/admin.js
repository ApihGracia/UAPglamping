
    const defaultConfig = {
      company_name: 'UAP Glamping',
      welcome_message: 'Welcome to Admin Dashboard',
      background_color: '#1a4d2e',
      surface_color: '#ffffff',
      text_color: '#333333',
      primary_action_color: '#2d7a4f',
      secondary_action_color: '#f5f5f5',
      login_logo_url: '',
      dashboard_logo_url: ''
    };

    let allData = [];
    let editingRecord = null;
    
    // Credentials storage
    let ADMIN_USERNAME = 'admin';
    let ADMIN_PASSWORD = 'uapglamping2024';

    // Data handler
    const dataHandler = {
      onDataChanged(data) {
        allData = data;
        updateDashboardStats();
        renderCurrentPage();
      }
    };

    // Initialize SDK
    async function initializeApp() {
      // Load saved credentials from localStorage
      const savedUsername = localStorage.getItem('admin_username');
      const savedPassword = localStorage.getItem('admin_password');
      if (savedUsername && savedPassword) {
        ADMIN_USERNAME = savedUsername;
        ADMIN_PASSWORD = savedPassword;
        document.getElementById('displayUsername').textContent = ADMIN_USERNAME;
      }
      
      if (window.dataSdk) {
        const result = await window.dataSdk.init(dataHandler);
        if (!result.isOk) {
          console.error('Failed to initialize data SDK');
        }
      }

      if (window.elementSdk) {
        await window.elementSdk.init({
          defaultConfig,
          onConfigChange: async (config) => {
            document.getElementById('companyNameLogin').textContent = config.company_name || defaultConfig.company_name;
            document.getElementById('companyNameSidebar').textContent = config.company_name || defaultConfig.company_name;
            document.getElementById('welcomeMessage').textContent = config.welcome_message || defaultConfig.welcome_message;

            // Restore saved logos
            const savedLoginLogo = config.login_logo_url || defaultConfig.login_logo_url;
            const savedDashboardLogo = config.dashboard_logo_url || defaultConfig.dashboard_logo_url;
            
            if (savedLoginLogo) {
              const loginLogo = document.getElementById('loginLogo');
              loginLogo.innerHTML = '';
              loginLogo.style.backgroundImage = `url(${savedLoginLogo})`;
              loginLogo.style.backgroundSize = 'cover';
              loginLogo.style.backgroundPosition = 'center';
              
              // Hide upload instructions if logo exists
              const instructions = document.querySelector('.upload-instructions');
              if (instructions) {
                instructions.style.display = 'none';
              }
            }
            
            if (savedDashboardLogo) {
              const profilePic = document.getElementById('profilePicture');
              profilePic.innerHTML = '';
              profilePic.style.backgroundImage = `url(${savedDashboardLogo})`;
              profilePic.style.backgroundSize = 'cover';
              profilePic.style.backgroundPosition = 'center';
            }

            const backgroundColor = config.background_color || defaultConfig.background_color;
            const surfaceColor = config.surface_color || defaultConfig.surface_color;
            const textColor = config.text_color || defaultConfig.text_color;
            const primaryActionColor = config.primary_action_color || defaultConfig.primary_action_color;

            document.querySelector('.sidebar').style.background = backgroundColor;
            document.querySelector('.login-container').style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryActionColor} 100%)`;
            document.querySelectorAll('.stat-card').forEach(card => {
              card.style.borderLeftColor = primaryActionColor;
            });
            document.querySelectorAll('.add-btn, .save-btn, .login-btn').forEach(btn => {
              btn.style.background = primaryActionColor;
            });
            document.querySelectorAll('.content-header h1, .modal-header h2, .table-header h2').forEach(el => {
              el.style.color = backgroundColor;
            });
          },
          mapToCapabilities: (config) => ({
            recolorables: [
              {
                get: () => config.background_color || defaultConfig.background_color,
                set: (value) => {
                  if (window.elementSdk) {
                    window.elementSdk.config.background_color = value;
                    window.elementSdk.setConfig({ background_color: value });
                  }
                }
              },
              {
                get: () => config.surface_color || defaultConfig.surface_color,
                set: (value) => {
                  if (window.elementSdk) {
                    window.elementSdk.config.surface_color = value;
                    window.elementSdk.setConfig({ surface_color: value });
                  }
                }
              },
              {
                get: () => config.text_color || defaultConfig.text_color,
                set: (value) => {
                  if (window.elementSdk) {
                    window.elementSdk.config.text_color = value;
                    window.elementSdk.setConfig({ text_color: value });
                  }
                }
              },
              {
                get: () => config.primary_action_color || defaultConfig.primary_action_color,
                set: (value) => {
                  if (window.elementSdk) {
                    window.elementSdk.config.primary_action_color = value;
                    window.elementSdk.setConfig({ primary_action_color: value });
                  }
                }
              }
            ],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
          }),
          mapToEditPanelValues: (config) => new Map([
            ['company_name', config.company_name || defaultConfig.company_name],
            ['welcome_message', config.welcome_message || defaultConfig.welcome_message]
          ])
        });
      }
    }

    // Profile picture handler
    let profilePictureUrl = '';
    
    document.getElementById('profilePictureContainer').addEventListener('click', () => {
      document.getElementById('profilePictureInput').click();
    });
    
    document.getElementById('profilePictureInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
          profilePictureUrl = event.target.result;
          const profilePic = document.getElementById('profilePicture');
          profilePic.innerHTML = '';
          profilePic.style.backgroundImage = `url(${profilePictureUrl})`;
          profilePic.style.backgroundSize = 'cover';
          profilePic.style.backgroundPosition = 'center';
          
          // Save dashboard logo permanently
          if (window.elementSdk) {
            await window.elementSdk.setConfig({ 
              dashboard_logo_url: profilePictureUrl
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Login logo handler (syncs with dashboard sidebar logo)
    let loginLogoUrl = '';
    
    document.getElementById('loginLogoContainer').addEventListener('click', () => {
      document.getElementById('loginLogoInput').click();
    });
    
    document.getElementById('loginLogoInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
          loginLogoUrl = event.target.result;
          
          // Update login page logo
          const loginLogo = document.getElementById('loginLogo');
          loginLogo.innerHTML = '';
          loginLogo.style.backgroundImage = `url(${loginLogoUrl})`;
          loginLogo.style.backgroundSize = 'cover';
          loginLogo.style.backgroundPosition = 'center';
          
          // Update dashboard sidebar logo automatically
          profilePictureUrl = loginLogoUrl;
          const profilePic = document.getElementById('profilePicture');
          profilePic.innerHTML = '';
          profilePic.style.backgroundImage = `url(${loginLogoUrl})`;
          profilePic.style.backgroundSize = 'cover';
          profilePic.style.backgroundPosition = 'center';
          
          // Save logo permanently
          if (window.elementSdk) {
            await window.elementSdk.setConfig({ 
              login_logo_url: loginLogoUrl,
              dashboard_logo_url: loginLogoUrl
            });
          }
          
          // Hide upload instructions after first upload
          const instructions = document.querySelector('.upload-instructions');
          if (instructions) {
            instructions.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Login handler with permanent credentials
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		localStorage.setItem("admin_logged_in", "true");
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboardPage').classList.add('active');
      } else {
        // Show error message
        const loginBox = document.querySelector('.login-box');
        let errorMsg = loginBox.querySelector('.login-error');
        
        if (!errorMsg) {
          errorMsg = document.createElement('div');
          errorMsg.className = 'login-error';
          errorMsg.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; text-align: center;';
          const form = document.getElementById('loginForm');
          loginBox.insertBefore(errorMsg, form);
        }
        
        errorMsg.textContent = '❌ Invalid username or password. Please try again.';
        
        // Remove error message after 3 seconds
        setTimeout(() => {
          if (errorMsg && errorMsg.parentNode) {
            errorMsg.remove();
          }
        }, 3000);
      }
    });
document.addEventListener('DOMContentLoaded', () => {
  const loginPage = document.getElementById('loginPage');
  if (loginPage) {
    loginPage.style.display = 'flex';
  }
});



    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
      document.getElementById('dashboardPage').classList.remove('active');
      document.getElementById('loginPage').style.display = 'flex';
      document.getElementById('loginForm').reset();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const page = item.getAttribute('data-page');
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Content').classList.add('active');
        
        renderCurrentPage();
      });
    });

    // Update dashboard stats
    function updateDashboardStats() {
      const customers = allData.filter(d => d.type === 'customer').length;
      const bookings = allData.filter(d => d.type === 'booking').length;
      const activities = allData.filter(d => d.type === 'activity' && d.activity_available).length;
      const packages = allData.filter(d => d.type === 'package' && d.package_status === 'Available').length;
      
      document.getElementById('totalCustomers').textContent = customers;
      document.getElementById('totalBookings').textContent = bookings;
      document.getElementById('totalActivities').textContent = activities;
      document.getElementById('totalPackages').textContent = packages;
    }

    // Render current page
    function renderCurrentPage() {
      const activePage = document.querySelector('.nav-item.active').getAttribute('data-page');
      
      if (activePage === 'customers') {
        renderCustomersTable();
      } else if (activePage === 'bookings') {
        renderBookingsTable();
      } else if (activePage === 'billing') {
        renderBillingTable();
      } else if (activePage === 'activities') {
        renderActivitiesTable();
        renderActivityBookingsTable();
      } else if (activePage === 'packages') {
        renderPackagesTable();
      }
    }

    // Render activity bookings table
    function renderActivityBookingsTable() {
      const container = document.getElementById('activityBookingsTableContainer');
      const activityBookings = allData.filter(d => d.type === 'activity_booking');
      
      if (activityBookings.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📅</div>
            <p class="empty-state-text">No activity bookings yet</p>
            <p class="empty-state-subtext">Book activities for customers and automatically notify instructors</p>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Activity</th>
              <th>Date & Time</th>
              <th>Participants</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${activityBookings.map(booking => `
              <tr>
                <td>${booking.customer_name}</td>
                <td>${booking.activity_booking_activity_name}<br><small style="color: #666;">RM ${booking.activity_booking_activity_price.toFixed(2)}</small></td>
                <td>${new Date(booking.activity_booking_date).toLocaleDateString()}<br><small style="color: #666;">${booking.activity_booking_time}</small></td>
                <td>${booking.activity_booking_participants} ${booking.activity_booking_participants === 1 ? 'person' : 'people'}</td>
                <td><small style="color: #666;">${booking.activity_booking_instructor_email}</small></td>
                <td>
                  <span class="status-badge ${
                    booking.activity_booking_status === 'Confirmed' ? 'status-available' : 
                    booking.activity_booking_status === 'Pending' ? 'status-booked' : 'status-closed'
                  }">
                    ${booking.activity_booking_status}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="delete-btn" onclick="deleteRecord('${booking.__backendId}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Render customers table
    function renderCustomersTable() {
      const container = document.getElementById('customersTableContainer');
      const customers = allData.filter(d => d.type === 'customer');
      
      if (customers.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">   </div>
            <p class="empty-state-text">No customers yet</p>
            <p class="empty-state-subtext">Add customer records to manage your glamping guests</p>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAllCustomers" style="cursor: pointer;"></th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(customer => `
              <tr>
                <td><input type="checkbox" class="customer-checkbox" data-id="${customer.__backendId}" style="cursor: pointer;"></td>
                <td>${customer.customer_name}</td>
                <td>${customer.customer_phone}</td>
                <td>${customer.customer_email}</td>
                <td>${customer.customer_address}</td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" onclick="editCustomer('${customer.__backendId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord('${customer.__backendId}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.getElementById('selectAllCustomers').addEventListener('change', (e) => {
        document.querySelectorAll('.customer-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }

    // Render bookings table
    function renderBookingsTable() {
      const container = document.getElementById('bookingsTableContainer');
      const bookings = allData.filter(d => d.type === 'booking');
      
      if (bookings.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📅</div>
            <p class="empty-state-text">No bookings yet</p>
            <p class="empty-state-subtext">Add booking records to track your reservations</p>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAllBookings" style="cursor: pointer;"></th>
              <th>Customer</th>
              <th>Package</th>
              <th>Tent Type</th>
              <th>Check-in Date</th>
              <th>Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(booking => `
              <tr>
                <td><input type="checkbox" class="booking-checkbox" data-id="${booking.__backendId}" style="cursor: pointer;"></td>
                <td>${booking.customer_name}</td>
                <td>${booking.booking_package}</td>
                <td>${booking.booking_tent_type}</td>
                <td>${new Date(booking.booking_date).toLocaleDateString()}</td>
                <td>${booking.booking_days}</td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" onclick="editBooking('${booking.__backendId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord('${booking.__backendId}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.getElementById('selectAllBookings').addEventListener('change', (e) => {
        document.querySelectorAll('.booking-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }

    // Render billing table
    function renderBillingTable() {
      const container = document.getElementById('billingTableContainer');
      const billing = allData.filter(d => d.type === 'billing');
      
      if (billing.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">💳</div>
            <p class="empty-state-text">No receipts yet</p>
            <p class="empty-state-subtext">Add billing records to track payments</p>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAllBilling" style="cursor: pointer;"></th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Receipt PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${billing.map(bill => `
              <tr>
                <td><input type="checkbox" class="billing-checkbox" data-id="${bill.__backendId}" style="cursor: pointer;"></td>
                <td>${bill.customer_name}</td>
                <td>$${bill.billing_amount.toFixed(2)}</td>
                <td><a href="${bill.billing_receipt_url}" target="_blank" rel="noopener noreferrer" style="color: #2d7a4f;">View PDF</a></td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" onclick="editBilling('${bill.__backendId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord('${bill.__backendId}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.getElementById('selectAllBilling').addEventListener('change', (e) => {
        document.querySelectorAll('.billing-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }

    // Render activities table
    function renderActivitiesTable() {
      const container = document.getElementById('activitiesTableContainer');
      const activities = allData.filter(d => d.type === 'activity');
      
      if (activities.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🎯</div>
            <p class="empty-state-text">No activities yet</p>
            <p class="empty-state-subtext">Click the "Add Activity" button to add your first extra activity</p>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAllActivities" style="cursor: pointer;"></th>
              <th>Activity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${activities.map(activity => `
              <tr>
                <td><input type="checkbox" class="activity-checkbox" data-id="${activity.__backendId}" style="cursor: pointer;"></td>
                <td>${activity.activity_name}</td>
                <td>RM ${activity.activity_price.toFixed(2)}</td>
                <td>
                  <span class="status-badge ${activity.activity_available ? 'status-available' : 'status-closed'}">
                    ${activity.activity_available ? 'Available' : 'Closed'}
                  </span>
                </td>
                <td>${activity.activity_description.substring(0, 50)}${activity.activity_description.length > 50 ? '...' : ''}</td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" onclick="editActivity('${activity.__backendId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord('${activity.__backendId}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.getElementById('selectAllActivities').addEventListener('change', (e) => {
        document.querySelectorAll('.activity-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }

    // Render packages table
    function renderPackagesTable() {
      const container = document.getElementById('packagesTableContainer');
      const packages = allData.filter(d => d.type === 'package');
      
      if (packages.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <p class="empty-state-text">No packages yet</p>
            <p class="empty-state-subtext">Click the "Add Package" button to create your first package</p>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAllPackages" style="cursor: pointer;"></th>
              <th>Package Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${packages.map(pkg => `
              <tr>
                <td><input type="checkbox" class="package-checkbox" data-id="${pkg.__backendId}" style="cursor: pointer;"></td>
                <td>${pkg.package_name}</td>
                <td>RM ${pkg.package_price.toFixed(2)}</td>
                <td>
                  <span class="status-badge ${
                    pkg.package_status === 'Available' ? 'status-available' : 
                    pkg.package_status === 'Fully Booked' ? 'status-booked' : 'status-closed'
                  }">
                    ${pkg.package_status}
                  </span>
                </td>
                <td>${pkg.package_description.substring(0, 50)}${pkg.package_description.length > 50 ? '...' : ''}</td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" onclick="editPackage('${pkg.__backendId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord('${pkg.__backendId}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.getElementById('selectAllPackages').addEventListener('change', (e) => {
        document.querySelectorAll('.package-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }

    // Modal handlers
    function openModal(modalId) {
      document.getElementById(modalId).classList.add('active');
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
      editingRecord = null;
    }

    // Confirmation modal
    let confirmCallback = null;
    
    function showConfirmModal(title, message, callback) {
      document.getElementById('confirmModalTitle').textContent = title;
      document.getElementById('confirmModalMessage').textContent = message;
      confirmCallback = callback;
      openModal('confirmModal');
    }
    
    document.getElementById('closeConfirmModal').addEventListener('click', () => {
      closeModal('confirmModal');
      confirmCallback = null;
    });
    
    document.getElementById('cancelConfirmModal').addEventListener('click', () => {
      closeModal('confirmModal');
      confirmCallback = null;
    });
    
    document.getElementById('confirmActionBtn').addEventListener('click', async () => {
      if (confirmCallback) {
        const btn = document.getElementById('confirmActionBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Processing...';
        await confirmCallback();
        btn.disabled = false;
        btn.textContent = 'Confirm';
        closeModal('confirmModal');
        confirmCallback = null;
      }
    });

    // Delete customers handler
    document.getElementById('deleteCustomersBtn').addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('.customer-checkbox:checked'));
      if (selected.length === 0) {
        showConfirmModal('No Selection', 'Please select at least one customer to delete.', () => {});
        return;
      }
      
      showConfirmModal(
        'Confirm Delete',
        `Are you sure you want to delete ${selected.length} customer${selected.length > 1 ? 's' : ''}? This action cannot be undone.`,
        async () => {
          for (const checkbox of selected) {
            const id = checkbox.getAttribute('data-id');
            const record = allData.find(d => d.__backendId === id);
            if (record && window.dataSdk) {
              await window.dataSdk.delete(record);
            }
          }
        }
      );
    });

    // Delete bookings handler
    document.getElementById('deleteBookingsBtn').addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('.booking-checkbox:checked'));
      if (selected.length === 0) {
        showConfirmModal('No Selection', 'Please select at least one booking to delete.', () => {});
        return;
      }
      
      showConfirmModal(
        'Confirm Delete',
        `Are you sure you want to delete ${selected.length} booking${selected.length > 1 ? 's' : ''}? This action cannot be undone.`,
        async () => {
          for (const checkbox of selected) {
            const id = checkbox.getAttribute('data-id');
            const record = allData.find(d => d.__backendId === id);
            if (record && window.dataSdk) {
              await window.dataSdk.delete(record);
            }
          }
        }
      );
    });

    // Delete billing handler
    document.getElementById('deleteBillingBtn').addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('.billing-checkbox:checked'));
      if (selected.length === 0) {
        showConfirmModal('No Selection', 'Please select at least one receipt to delete.', () => {});
        return;
      }
      
      showConfirmModal(
        'Confirm Delete',
        `Are you sure you want to delete ${selected.length} receipt${selected.length > 1 ? 's' : ''}? This action cannot be undone.`,
        async () => {
          for (const checkbox of selected) {
            const id = checkbox.getAttribute('data-id');
            const record = allData.find(d => d.__backendId === id);
            if (record && window.dataSdk) {
              await window.dataSdk.delete(record);
            }
          }
        }
      );
    });

    // Close activities handler
    document.getElementById('closeActivitiesBtn').addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('.activity-checkbox:checked'));
      if (selected.length === 0) {
        showConfirmModal('No Selection', 'Please select at least one activity to close.', () => {});
        return;
      }
      
      showConfirmModal(
        'Confirm Close Activities',
        `Are you sure you want to mark ${selected.length} activit${selected.length > 1 ? 'ies' : 'y'} as closed? This will make them unavailable to customers.`,
        async () => {
          for (const checkbox of selected) {
            const id = checkbox.getAttribute('data-id');
            const record = allData.find(d => d.__backendId === id);
            if (record && window.dataSdk) {
              await window.dataSdk.update({ ...record, activity_available: false });
            }
          }
        }
      );
    });

    // Mark packages fully booked handler
    document.getElementById('fullBookedPackagesBtn').addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('.package-checkbox:checked'));
      if (selected.length === 0) {
        showConfirmModal('No Selection', 'Please select at least one package to mark as fully booked.', () => {});
        return;
      }
      
      showConfirmModal(
        'Confirm Fully Booked',
        `Are you sure you want to mark ${selected.length} package${selected.length > 1 ? 's' : ''} as fully booked? This will indicate to customers that no spaces are available.`,
        async () => {
          for (const checkbox of selected) {
            const id = checkbox.getAttribute('data-id');
            const record = allData.find(d => d.__backendId === id);
            if (record && window.dataSdk) {
              await window.dataSdk.update({ ...record, package_status: 'Fully Booked' });
            }
          }
        }
      );
    });

    // Customer modal
    document.getElementById('closeCustomerModal').addEventListener('click', () => closeModal('customerModal'));
    document.getElementById('cancelCustomer').addEventListener('click', () => closeModal('customerModal'));

    document.getElementById('customerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const saveBtn = document.getElementById('saveCustomer');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
      
      const customerData = {
        type: 'customer',
        customer_name: document.getElementById('customerName').value,
        customer_phone: document.getElementById('customerPhone').value,
        customer_email: document.getElementById('customerEmail').value,
        customer_address: document.getElementById('customerAddress').value,
        created_at: new Date().toISOString()
      };
      
      if (window.dataSdk) {
        let result;
        if (editingRecord) {
          result = await window.dataSdk.update({ ...editingRecord, ...customerData });
        } else {
          if (allData.length >= 999) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Customer';
            const modalContent = document.querySelector('#customerModal .modal-content');
            const existingWarning = modalContent.querySelector('.limit-warning');
            if (!existingWarning) {
              const warning = document.createElement('div');
              warning.className = 'limit-warning';
              warning.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
              warning.textContent = 'Maximum limit of 999 records reached. Please delete some records first.';
              modalContent.insertBefore(warning, modalContent.querySelector('form'));
            }
            return;
          }
          result = await window.dataSdk.create(customerData);
        }
        
        if (result.isOk) {
          closeModal('customerModal');
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Customer';
          const modalContent = document.querySelector('#customerModal .modal-content');
          const existingError = modalContent.querySelector('.error-message');
          if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
            errorDiv.textContent = 'Failed to save customer. Please try again.';
            modalContent.insertBefore(errorDiv, modalContent.querySelector('form'));
          }
        }
      }
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Customer';
    });

    window.editCustomer = function(id) {
      const customer = allData.find(d => d.__backendId === id);
      if (customer) {
        editingRecord = customer;
        document.getElementById('customerModalTitle').textContent = 'Edit Customer';
        document.getElementById('customerName').value = customer.customer_name;
        document.getElementById('customerPhone').value = customer.customer_phone;
        document.getElementById('customerEmail').value = customer.customer_email;
        document.getElementById('customerAddress').value = customer.customer_address;
        openModal('customerModal');
      }
    };

    // Booking modal
    document.getElementById('closeBookingModal').addEventListener('click', () => closeModal('bookingModal'));
    document.getElementById('cancelBooking').addEventListener('click', () => closeModal('bookingModal'));

    document.getElementById('bookingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const saveBtn = document.getElementById('saveBooking');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
      
      const bookingData = {
        type: 'booking',
        customer_name: document.getElementById('bookingCustomer').value,
        booking_package: document.getElementById('bookingPackage').value,
        booking_tent_type: document.getElementById('bookingTentType').value,
        booking_date: document.getElementById('bookingDate').value,
        booking_days: parseInt(document.getElementById('bookingDays').value),
        created_at: new Date().toISOString()
      };
      
      if (window.dataSdk) {
        let result;
        if (editingRecord) {
          result = await window.dataSdk.update({ ...editingRecord, ...bookingData });
        } else {
          if (allData.length >= 999) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Booking';
            const modalContent = document.querySelector('#bookingModal .modal-content');
            const existingWarning = modalContent.querySelector('.limit-warning');
            if (!existingWarning) {
              const warning = document.createElement('div');
              warning.className = 'limit-warning';
              warning.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
              warning.textContent = 'Maximum limit of 999 records reached. Please delete some records first.';
              modalContent.insertBefore(warning, modalContent.querySelector('form'));
            }
            return;
          }
          result = await window.dataSdk.create(bookingData);
        }
        
        if (result.isOk) {
          closeModal('bookingModal');
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Booking';
        }
      }
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Booking';
    });

    window.editBooking = function(id) {
      const booking = allData.find(d => d.__backendId === id);
      if (booking) {
        editingRecord = booking;
        document.getElementById('bookingModalTitle').textContent = 'Edit Booking';
        document.getElementById('bookingCustomer').value = booking.customer_name;
        document.getElementById('bookingPackage').value = booking.booking_package;
        document.getElementById('bookingTentType').value = booking.booking_tent_type;
        document.getElementById('bookingDate').value = booking.booking_date;
        document.getElementById('bookingDays').value = booking.booking_days;
        openModal('bookingModal');
      }
    };

    // Billing modal
    document.getElementById('closeBillingModal').addEventListener('click', () => closeModal('billingModal'));
    document.getElementById('cancelBilling').addEventListener('click', () => closeModal('billingModal'));

    document.getElementById('billingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const saveBtn = document.getElementById('saveBilling');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
      
      const billingData = {
        type: 'billing',
        customer_name: document.getElementById('billingCustomer').value,
        billing_amount: parseFloat(document.getElementById('billingAmount').value),
        billing_receipt_url: document.getElementById('billingReceiptUrl').value,
        created_at: new Date().toISOString()
      };
      
      if (window.dataSdk) {
        let result;
        if (editingRecord) {
          result = await window.dataSdk.update({ ...editingRecord, ...billingData });
        } else {
          if (allData.length >= 999) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Receipt';
            const modalContent = document.querySelector('#billingModal .modal-content');
            const existingWarning = modalContent.querySelector('.limit-warning');
            if (!existingWarning) {
              const warning = document.createElement('div');
              warning.className = 'limit-warning';
              warning.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
              warning.textContent = 'Maximum limit of 999 records reached. Please delete some records first.';
              modalContent.insertBefore(warning, modalContent.querySelector('form'));
            }
            return;
          }
          result = await window.dataSdk.create(billingData);
        }
        
        if (result.isOk) {
          closeModal('billingModal');
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Receipt';
        }
      }
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Receipt';
    });

    window.editBilling = function(id) {
      const billing = allData.find(d => d.__backendId === id);
      if (billing) {
        editingRecord = billing;
        document.getElementById('billingModalTitle').textContent = 'Edit Receipt';
        document.getElementById('billingCustomer').value = billing.customer_name;
        document.getElementById('billingAmount').value = billing.billing_amount;
        document.getElementById('billingReceiptUrl').value = billing.billing_receipt_url;
        openModal('billingModal');
      }
    };

    // Activity modal
    const addActivityBtn = document.getElementById('addActivityBtn');
    if (addActivityBtn) {
      addActivityBtn.addEventListener('click', () => {
        editingRecord = null;
        document.getElementById('activityModalTitle').textContent = 'Add Activity';
        document.getElementById('activityForm').reset();
        openModal('activityModal');
      });
    }

    // Activity Booking modal
    const addActivityBookingBtn = document.getElementById('addActivityBookingBtn');
    if (addActivityBookingBtn) {
      addActivityBookingBtn.addEventListener('click', () => {
        editingRecord = null;
        document.getElementById('activityBookingModalTitle').textContent = 'Book Activity for Customer';
        document.getElementById('activityBookingForm').reset();
        
        // Populate activity dropdown with available activities
        const activitySelect = document.getElementById('activityBookingActivity');
        const availableActivities = allData.filter(d => d.type === 'activity' && d.activity_available);
        
        activitySelect.innerHTML = '<option value="">Choose an activity</option>' +
          availableActivities.map(activity => 
            `<option value="${activity.__backendId}" data-price="${activity.activity_price}" data-name="${activity.activity_name}">
              ${activity.activity_name} - RM ${activity.activity_price.toFixed(2)}
            </option>`
          ).join('');
        
        openModal('activityBookingModal');
      });
    }

    document.getElementById('closeActivityBookingModal').addEventListener('click', () => closeModal('activityBookingModal'));
    document.getElementById('cancelActivityBooking').addEventListener('click', () => closeModal('activityBookingModal'));

    document.getElementById('activityBookingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const saveBtn = document.getElementById('saveActivityBooking');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="loading-spinner"></span> Booking & Sending Email...';
      
      const activitySelect = document.getElementById('activityBookingActivity');
      const selectedOption = activitySelect.options[activitySelect.selectedIndex];
      const activityName = selectedOption.getAttribute('data-name');
      const activityPrice = parseFloat(selectedOption.getAttribute('data-price'));
      
      const customerName = document.getElementById('activityBookingCustomer').value;
      const customerEmail = document.getElementById('activityBookingCustomerEmail').value;
      const activityDate = document.getElementById('activityBookingDate').value;
      const activityTime = document.getElementById('activityBookingTime').value;
      const participants = parseInt(document.getElementById('activityBookingParticipants').value);
      const instructorEmail = document.getElementById('instructorEmail').value;
      const notes = document.getElementById('activityBookingNotes').value;
      
      // Create email body
      const emailSubject = `New Activity Booking: ${activityName}`;
      const emailBody = `Hello Instructor,

You have a new activity booking request:

ACTIVITY DETAILS:
- Activity: ${activityName}
- Price per person: RM ${activityPrice.toFixed(2)}
- Total participants: ${participants}
- Total amount: RM ${(activityPrice * participants).toFixed(2)}
- Date: ${new Date(activityDate).toLocaleDateString()}
- Time: ${activityTime}

CUSTOMER INFORMATION:
- Name: ${customerName}
- Email: ${customerEmail}

SPECIAL REQUESTS:
${notes || 'None'}

Please confirm this booking at your earliest convenience.

Best regards,
UAP Glamping Admin`;
      
      // Open email client with pre-filled information
      const mailtoLink = `mailto:${instructorEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');
      
      // Save booking to database
      const activityBookingData = {
        type: 'activity_booking',
        customer_name: customerName,
        customer_email: customerEmail,
        activity_booking_activity_name: activityName,
        activity_booking_activity_price: activityPrice,
        activity_booking_date: activityDate,
        activity_booking_time: activityTime,
        activity_booking_participants: participants,
        activity_booking_instructor_email: instructorEmail,
        activity_booking_notes: notes,
        activity_booking_status: 'Pending',
        created_at: new Date().toISOString()
      };
      
      if (window.dataSdk) {
        if (allData.length >= 999) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Book & Notify Instructor';
          const modalContent = document.querySelector('#activityBookingModal .modal-content');
          const existingWarning = modalContent.querySelector('.limit-warning');
          if (!existingWarning) {
            const warning = document.createElement('div');
            warning.className = 'limit-warning';
            warning.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
            warning.textContent = 'Maximum limit of 999 records reached. Please delete some records first.';
            modalContent.insertBefore(warning, modalContent.querySelector('form'));
          }
          return;
        }
        
        const result = await window.dataSdk.create(activityBookingData);
        
        if (result.isOk) {
          // Show success message
          const modalContent = document.querySelector('#activityBookingModal .modal-content');
          const successDiv = document.createElement('div');
          successDiv.style.cssText = 'background: #e8f5e9; color: #2d7a4f; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
          successDiv.textContent = '✓ Booking saved! Email client opened to notify instructor.';
          modalContent.insertBefore(successDiv, modalContent.querySelector('form'));
          
          setTimeout(() => {
            closeModal('activityBookingModal');
            successDiv.remove();
          }, 2000);
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Book & Notify Instructor';
        }
      }
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Book & Notify Instructor';
    });

    document.getElementById('closeActivityModal').addEventListener('click', () => closeModal('activityModal'));
    document.getElementById('cancelActivity').addEventListener('click', () => closeModal('activityModal'));

    document.getElementById('activityForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const saveBtn = document.getElementById('saveActivity');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
      
      const activityData = {
        type: 'activity',
        activity_name: document.getElementById('activityName').value,
        activity_price: parseFloat(document.getElementById('activityPrice').value),
        activity_available: document.getElementById('activityAvailable').value === 'true',
        activity_image_url: document.getElementById('activityImageUrl').value,
        activity_description: document.getElementById('activityDescription').value,
        created_at: new Date().toISOString()
      };
      
      if (window.dataSdk) {
        let result;
        if (editingRecord) {
          result = await window.dataSdk.update({ ...editingRecord, ...activityData });
        } else {
          if (allData.length >= 999) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Activity';
            const modalContent = document.querySelector('#activityModal .modal-content');
            const existingWarning = modalContent.querySelector('.limit-warning');
            if (!existingWarning) {
              const warning = document.createElement('div');
              warning.className = 'limit-warning';
              warning.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
              warning.textContent = 'Maximum limit of 999 records reached. Please delete some records first.';
              modalContent.insertBefore(warning, modalContent.querySelector('form'));
            }
            return;
          }
          result = await window.dataSdk.create(activityData);
        }
        
        if (result.isOk) {
          closeModal('activityModal');
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Activity';
        }
      }
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Activity';
    });

    window.editActivity = function(id) {
      const activity = allData.find(d => d.__backendId === id);
      if (activity) {
        editingRecord = activity;
        document.getElementById('activityModalTitle').textContent = 'Edit Activity';
        document.getElementById('activityName').value = activity.activity_name;
        document.getElementById('activityPrice').value = activity.activity_price;
        document.getElementById('activityAvailable').value = activity.activity_available.toString();
        document.getElementById('activityImageUrl').value = activity.activity_image_url || '';
        document.getElementById('activityDescription').value = activity.activity_description;
        openModal('activityModal');
      }
    };

    // Package modal
    const addPackageBtn = document.getElementById('addPackageBtn');
    if (addPackageBtn) {
      addPackageBtn.addEventListener('click', () => {
        editingRecord = null;
        document.getElementById('packageModalTitle').textContent = 'Add Package';
        document.getElementById('packageForm').reset();
        openModal('packageModal');
      });
    }

    document.getElementById('closePackageModal').addEventListener('click', () => closeModal('packageModal'));
    document.getElementById('cancelPackage').addEventListener('click', () => closeModal('packageModal'));

    document.getElementById('packageForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const saveBtn = document.getElementById('savePackage');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
      
      const packageData = {
        type: 'package',
        package_name: document.getElementById('packageName').value,
        package_price: parseFloat(document.getElementById('packagePrice').value),
        package_status: document.getElementById('packageStatus').value,
        package_image_url: document.getElementById('packageImageUrl').value,
        package_description: document.getElementById('packageDescription').value,
        created_at: new Date().toISOString()
      };
      
      if (window.dataSdk) {
        let result;
        if (editingRecord) {
          result = await window.dataSdk.update({ ...editingRecord, ...packageData });
        } else {
          if (allData.length >= 999) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Package';
            const modalContent = document.querySelector('#packageModal .modal-content');
            const existingWarning = modalContent.querySelector('.limit-warning');
            if (!existingWarning) {
              const warning = document.createElement('div');
              warning.className = 'limit-warning';
              warning.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
              warning.textContent = 'Maximum limit of 999 records reached. Please delete some records first.';
              modalContent.insertBefore(warning, modalContent.querySelector('form'));
            }
            return;
          }
          result = await window.dataSdk.create(packageData);
        }
        
        if (result.isOk) {
          closeModal('packageModal');
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Package';
        }
      }
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Package';
    });

    window.editPackage = function(id) {
      const pkg = allData.find(d => d.__backendId === id);
      if (pkg) {
        editingRecord = pkg;
        document.getElementById('packageModalTitle').textContent = 'Edit Package';
        document.getElementById('packageName').value = pkg.package_name;
        document.getElementById('packagePrice').value = pkg.package_price;
        document.getElementById('packageStatus').value = pkg.package_status;
        document.getElementById('packageImageUrl').value = pkg.package_image_url || '';
        document.getElementById('packageDescription').value = pkg.package_description;
        openModal('packageModal');
      }
    };

    // Delete record
    window.deleteRecord = async function(id) {
      const record = allData.find(d => d.__backendId === id);
      if (!record) return;
      
      const deleteButtons = document.querySelectorAll(`button[onclick="deleteRecord('${id}')"]`);
      deleteButtons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span>';
      });
      
      if (window.dataSdk) {
        const result = await window.dataSdk.delete(record);
        if (!result.isOk) {
          deleteButtons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'Delete';
          });
        }
      }
    };

    // Change credentials form handler
    document.getElementById('changeCredentialsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const currentPassword = document.getElementById('currentPassword').value;
      const newUsername = document.getElementById('newUsername').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      const form = document.getElementById('changeCredentialsForm');
      
      // Remove any existing messages
      const existingMsg = form.parentElement.querySelector('.settings-message');
      if (existingMsg) existingMsg.remove();
      
      // Verify current password
      if (currentPassword !== ADMIN_PASSWORD) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'settings-message';
        errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
        errorDiv.textContent = '❌ Current password is incorrect. Please try again.';
        form.parentElement.insertBefore(errorDiv, form);
        return;
      }
      
      // Check if new passwords match
      if (newPassword !== confirmPassword) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'settings-message';
        errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
        errorDiv.textContent = '❌ New passwords do not match. Please try again.';
        form.parentElement.insertBefore(errorDiv, form);
        return;
      }
      
      // Check password length
      if (newPassword.length < 6) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'settings-message';
        errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
        errorDiv.textContent = '❌ New password must be at least 6 characters long.';
        form.parentElement.insertBefore(errorDiv, form);
        return;
      }
      
      // Update credentials
      ADMIN_USERNAME = newUsername;
      ADMIN_PASSWORD = newPassword;
      
      // Save to localStorage
      localStorage.setItem('admin_username', ADMIN_USERNAME);
      localStorage.setItem('admin_password', ADMIN_PASSWORD);
      
      // Update display
      document.getElementById('displayUsername').textContent = ADMIN_USERNAME;
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'settings-message';
      successDiv.style.cssText = 'background: #e8f5e9; color: #2d7a4f; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px;';
      successDiv.textContent = '✅ Credentials updated successfully! Please use your new credentials for future logins.';
      form.parentElement.insertBefore(successDiv, form);
      
      // Reset form
      form.reset();
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        if (successDiv && successDiv.parentNode) {
          successDiv.remove();
        }
      }, 5000);
    });

    // Reset credentials button handler
    document.getElementById('resetCredentialsBtn').addEventListener('click', () => {
      showConfirmModal(
        'Reset Credentials',
        'Are you sure you want to reset your login credentials to the default values? You will need to use the default username and password to log in next time.',
        () => {
          // Reset to defaults
          ADMIN_USERNAME = 'admin';
          ADMIN_PASSWORD = 'uapglamping2024';
          
          // Save to localStorage
          localStorage.setItem('admin_username', ADMIN_USERNAME);
          localStorage.setItem('admin_password', ADMIN_PASSWORD);
          
          // Update display
          document.getElementById('displayUsername').textContent = ADMIN_USERNAME;
          
          // Show success message
          const resetContainer = document.getElementById('resetCredentialsBtn').parentElement;
          const existingMsg = resetContainer.querySelector('.settings-message');
          if (existingMsg) existingMsg.remove();
          
          const successDiv = document.createElement('div');
          successDiv.className = 'settings-message';
          successDiv.style.cssText = 'background: #e8f5e9; color: #2d7a4f; padding: 12px; border-radius: 6px; margin-top: 16px; font-size: 14px;';
          successDiv.textContent = '✅ Credentials reset to default values successfully!';
          resetContainer.appendChild(successDiv);
          
          // Remove success message after 5 seconds
          setTimeout(() => {
            if (successDiv && successDiv.parentNode) {
              successDiv.remove();
            }
          }, 5000);
        }
      );
    });

    // Initialize app
    initializeApp();
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9a409240b1c72441',t:'MTc2NDA2NzY4MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script><iframe height="1" width="1" style="position: absolute; top: 0px; left: 0px; border: none; visibility: hidden;"></iframe>
