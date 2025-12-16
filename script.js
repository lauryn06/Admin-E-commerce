const login = document.querySelector('.AdminLogin');

const text = document.querySelector('.message');
const username = document.querySelector('.names');
const password = document.querySelector('.passwords');

login.addEventListener('click', () => {
    if (username.value === "admin" && password.value === "admin123") {
        text.textContent = "Login Successful";
        text.style.color = "green";
        location.href = "dashboard.html";
    } else {
        text.textContent = "Login Failed! Try Again.";
        text.style.color = "red";
    }
});

// Form submission and preview functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productForm');
    const previewBtn = document.getElementById('previewBtn');
    const newProductPreview = document.getElementById('newProductPreview');
    
    // Get appropriate icon for product category
    function getCategoryIcon(category) {
        const icons = {
            'Phones': 'fas fa-mobile-alt',
            'Laptops': 'fas fa-laptop',
            'Tablets': 'fas fa-tablet-alt',
            'Accessories': 'fas fa-headphones',
            'Wearables': 'fas fa-watch'
        };
        
        return icons[category] || 'fas fa-box';
    }
    
    // Format price with MWK and commas
    function formatPrice(price) {
        // Remove non-digit characters and format with commas
        const numericPrice = price.replace(/\D/g, '');
        if (!numericPrice) return 'MWK 0';
        
        const formattedPrice = parseInt(numericPrice).toLocaleString();
        return `MWK ${formattedPrice}`;
    }
    
    // Get status class based on stock status
    function getStatusClass(status) {
        const classes = {
            'Active': 'active',
            'Inactive': 'inactive',
            'Out of Stock': 'out-of-stock'
        };
        
        return classes[status] || 'active';
    }
    
    // Update preview with form data
    function updatePreview() {
        const productName = document.getElementById('productName').value;
        const productCategory = document.getElementById('productCategory').value;
        const productPrice = document.getElementById('productPrice').value;
        const productStock = document.getElementById('productStock').value;
        const stockStatus = document.querySelector('input[name="stockStatus"]:checked').value;
        
        // If any required field is empty, show placeholder
        if (!productName || !productCategory || !productPrice || !productStock) {
            newProductPreview.innerHTML = `
                <td colspan="6" class="preview-placeholder">
                    <div class="placeholder-content">
                        <i class="fas fa-arrow-left"></i>
                        <p>Fill out the form to see a preview of your new product here</p>
                    </div>
                </td>
            `;
            return;
        }
        
        // Create preview row
        const formattedPrice = formatPrice(productPrice);
        const statusClass = getStatusClass(stockStatus);
        const categoryIcon = getCategoryIcon(productCategory);
        
        newProductPreview.innerHTML = `
            <td class="product-cell">
                <div class="product-info">
                    <div class="product-icon">
                        <i class="${categoryIcon}"></i>
                    </div>
                    <div class="product-details">
                        <div class="product-name">${productName}</div>
                        <div class="product-category">${productCategory}</div>
                    </div>
                </div>
            </td>
            <td>${productCategory}</td>
            <td class="price">${formattedPrice}</td>
            <td>${productStock}</td>
            <td><span class="status ${statusClass}">${stockStatus}</span></td>
            <td class="actions">
                <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add styles for other statuses
        const style = document.createElement('style');
        style.textContent = `
            .status.inactive {
                background-color: rgba(128, 128, 128, 0.1);
                color: #666;
            }
            .status.out-of-stock {
                background-color: rgba(255, 0, 0, 0.1);
                color: #ff4444;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Format price input as user types
    document.getElementById('productPrice').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value).toLocaleString();
        }
        e.target.value = value;
        updatePreview();
    });
    
    // Update preview when form fields change
    form.addEventListener('input', updatePreview);
    form.addEventListener('change', updatePreview);
    
    // Preview button click
    previewBtn.addEventListener('click', function() {
        updatePreview();
        
        // Scroll to preview section
        document.querySelector('.preview-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight preview section briefly
        const previewSection = document.querySelector('.preview-section');
        previewSection.style.boxShadow = '0 0 0 3px var(--warning)';
        setTimeout(() => {
            previewSection.style.boxShadow = '';
        }, 1000);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const productName = document.getElementById('productName').value;
        const productCategory = document.getElementById('productCategory').value;
        const productPrice = document.getElementById('productPrice').value;
        const productStock = document.getElementById('productStock').value;
        const stockStatus = document.querySelector('input[name="stockStatus"]:checked').value;
        const productDescription = document.getElementById('productDescription').value;
        
        // Validate required fields
        if (!productName || !productCategory || !productPrice || !productStock) {
            alert('Please fill in all required fields');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For this example, we'll just show a success message
        const successMessage = `
            Product added successfully!
            
            Details:
            - Name: ${productName}
            - Category: ${productCategory}
            - Price: MWK ${productPrice}
            - Stock: ${productStock}
            - Status: ${stockStatus}
            
            The product has been added to the database.
        `;
        
        alert(successMessage);
        
        // Reset form after successful submission
        form.reset();
        updatePreview();
        
        // Show confirmation in preview area
        newProductPreview.innerHTML = `
            <td colspan="6" class="preview-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-check-circle" style="color: green;"></i>
                    <p>Product "${productName}" has been added successfully!</p>
                    <small>Fill out the form again to add another product</small>
                </div>
            </td>
        `;
    });
    
    // Reset form button
    form.addEventListener('reset', function() {
        // Clear preview after a short delay to allow form reset to complete
        setTimeout(updatePreview, 10);
    });
    
    // Initialize preview with placeholder
    updatePreview();
});