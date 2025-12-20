
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const form = document.getElementById('productForm');
            const productsTableBody = document.getElementById('productsTableBody');
            const emptyRow = document.getElementById('emptyRow');
            const toggleFormBtn = document.getElementById('toggleFormBtn');
            const formSection = document.getElementById('formSection');
            const searchInput = document.getElementById('searchInput');
            const refreshTableBtn = document.getElementById('refreshTableBtn');
            const addProductBtn = document.getElementById('addProductBtn');
            const viewProductsBtn = document.getElementById('viewProductsBtn');
            
            // Sample data (initial products)
            let products = [
                {
                    id: 1,
                    name: 'iPhone 15 Pro Max',
                    category: 'Phones',
                    price: '2,100,000',
                    stock: 15,
                    status: 'Active',
                    description: 'Latest iPhone model with advanced camera features'
                },
                {
                    id: 2,
                    name: 'Dell XPS 13 Laptop',
                    category: 'Laptops',
                    price: '1,500,000',
                    stock: 8,
                    status: 'Active',
                    description: 'High-performance laptop with ultra-thin design'
                }
            ];
            
            // Next product ID
            let nextProductId = 3;
            
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
            
            // Format price input as user types
            document.getElementById('productPrice').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value) {
                    value = parseInt(value).toLocaleString();
                }
                e.target.value = value;
            });
            
            // Render products table
            function renderProducts(productsToRender = products) {
                // Clear table body
                productsTableBody.innerHTML = '';
                
                // If no products, show empty state
                if (productsToRender.length === 0) {
                    productsTableBody.appendChild(emptyRow);
                    emptyRow.style.display = '';
                    return;
                }
                
                // Hide empty row
                emptyRow.style.display = 'none';
                
                // Add each product to the table
                productsToRender.forEach(product => {
                    const row = document.createElement('tr');
                    row.dataset.id = product.id;
                    
                    const categoryIcon = getCategoryIcon(product.category);
                    const formattedPrice = formatPrice(product.price);
                    
                    row.innerHTML = `
                        <td class="product-cell">
                            <div class="product-info">
                                <div class="product-icon">
                                    <i class="${categoryIcon}"></i>
                                </div>
                                <div class="product-details">
                                    <div class="product-name">${product.name}</div>
                                    <div class="product-category">${product.category}</div>
                                </div>
                            </div>
                        </td>
                        <td>${product.category}</td>
                        <td class="price-cell">${formattedPrice}</td>
                        <td class="stock-cell">${product.stock}</td>
                        <td class="status-cell"><span class="status ${product.status.toLowerCase().replace(' ', '-')}">${product.status}</span></td>
                        <td class="actions-cell">
                            <div class="actions">
                                <button class="action-btn edit" onclick="editProduct(${product.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    
                    productsTableBody.appendChild(row);
                });
            }
            
            // Add new product
            function addProduct(productData) {
                const newProduct = {
                    id: nextProductId++,
                    name: productData.productName,
                    category: productData.productCategory,
                    price: productData.productPrice,
                    stock: parseInt(productData.productStock),
                    status: productData.stockStatus,
                    description: productData.productDescription || ''
                };
                
                products.push(newProduct);
                renderProducts();
                
                // Show success message
                showNotification(`Product "${newProduct.name}" added successfully!`, 'success');
                
                // Hide form after successful submission
                formSection.classList.remove('active');
                toggleFormBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Show Add Product Form';
                
                // Scroll to table to show the new product
                document.querySelector('.table-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Edit product
            window.editProduct = function(productId) {
                const product = products.find(p => p.id === productId);
                if (!product) return;
                
                // Populate form with product data
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productDescription').value = product.description;
                
                // Set status radio button
                const statusRadio = document.querySelector(`input[name="stockStatus"][value="${product.status}"]`);
                if (statusRadio) statusRadio.checked = true;
                
                // Show form
                formSection.classList.add('active');
                toggleFormBtn.innerHTML = '<i class="fas fa-times"></i> Hide Form';
                
                // Change form header and submit button
                document.querySelector('.form-header h2').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
                document.querySelector('.form-header p').textContent = 'Edit the product details below';
                
                const submitBtn = document.querySelector('.form-actions .btn-primary');
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
                
                // Change form submission to update instead of add
                form.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Update product
                    product.name = document.getElementById('productName').value;
                    product.category = document.getElementById('productCategory').value;
                    product.price = document.getElementById('productPrice').value;
                    product.stock = parseInt(document.getElementById('productStock').value);
                    product.status = document.querySelector('input[name="stockStatus"]:checked').value;
                    product.description = document.getElementById('productDescription').value;
                    
                    renderProducts();
                    
                    // Show success message
                    showNotification(`Product "${product.name}" updated successfully!`, 'success');
                    
                    // Reset form to add mode
                    resetFormToAddMode();
                    
                    // Hide form
                    formSection.classList.remove('active');
                    toggleFormBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Show Add Product Form';
                    
                    return false;
                };
                
                // Scroll to form
                formSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            };
            
            // Delete product
            window.deleteProduct = function(productId) {
                if (confirm('Are you sure you want to delete this product?')) {
                    const productIndex = products.findIndex(p => p.id === productId);
                    if (productIndex === -1) return;
                    
                    const productName = products[productIndex].name;
                    products.splice(productIndex, 1);
                    renderProducts();
                    
                    // Show success message
                    showNotification(`Product "${productName}" deleted successfully!`, 'success');
                }
            };
            
            // Search products
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                if (!searchTerm) {
                    renderProducts();
                    return;
                }
                
                const filteredProducts = products.filter(product => {
                    return (
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm) ||
                        product.status.toLowerCase().includes(searchTerm) ||
                        product.price.includes(searchTerm)
                    );
                });
                
                renderProducts(filteredProducts);
            });
            
            // Refresh table
            refreshTableBtn.addEventListener('click', function() {
                renderProducts();
                searchInput.value = '';
                showNotification('Product table refreshed', 'info');
            });
            
            // Toggle form visibility
            toggleFormBtn.addEventListener('click', function() {
                if (formSection.classList.contains('active')) {
                    formSection.classList.remove('active');
                    toggleFormBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Show Add Product Form';
                    resetFormToAddMode();
                } else {
                    formSection.classList.add('active');
                    toggleFormBtn.innerHTML = '<i class="fas fa-times"></i> Hide Form';
                    
                    // Scroll to form
                    formSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
            
            // Add Product button
            addProductBtn.addEventListener('click', function() {
                formSection.classList.add('active');
                toggleFormBtn.innerHTML = '<i class="fas fa-times"></i> Hide Form';
                resetFormToAddMode();
                
                // Scroll to form
                formSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // View Products button
            viewProductsBtn.addEventListener('click', function() {
                formSection.classList.remove('active');
                toggleFormBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Show Add Product Form';
                
                // Scroll to table
                document.querySelector('.table-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // Reset form to add mode
            function resetFormToAddMode() {
                form.reset();
                
                // Reset form header and submit button
                document.querySelector('.form-header h2').innerHTML = '<i class="fas fa-box-open"></i> Add New Product';
                document.querySelector('.form-header p').textContent = 'Fill in the details below to add a new product to the inventory';
                
                const submitBtn = document.querySelector('.form-actions .btn-primary');
                submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Product to Table';
                
                // Reset form submission to add
                form.onsubmit = function(e) {
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
                        showNotification('Please fill in all required fields', 'error');
                        return;
                    }
                    
                    // Add product
                    addProduct({
                        productName,
                        productCategory,
                        productPrice,
                        productStock,
                        stockStatus,
                        productDescription
                    });
                    
                    // Reset form
                    form.reset();
                    
                    return false;
                };
            }
            
            // Show notification
            function showNotification(message, type = 'info') {
                // Remove any existing notification
                const existingNotification = document.querySelector('.notification');
                if (existingNotification) {
                    existingNotification.remove();
                }
                
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                    <button class="notification-close"><i class="fas fa-times"></i></button>
                `;
                
                // Add styles for notification
                const style = document.createElement('style');
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 15px 20px;
                        border-radius: var(--border-radius);
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        box-shadow: 0 4px 12px var(--shadow);
                        z-index: 1000;
                        animation: slideIn 0.3s ease;
                        max-width: 400px;
                    }
                    
                    .notification.success {
                        background-color: #d4edda;
                        color: #155724;
                        border-left: 4px solid #28a745;
                    }
                    
                    .notification.error {
                        background-color: #f8d7da;
                        color: #721c24;
                        border-left: 4px solid #dc3545;
                    }
                    
                    .notification.info {
                        background-color: #d1ecf1;
                        color: #0c5460;
                        border-left: 4px solid var(--navBar);
                    }
                    
                    .notification-close {
                        background: none;
                        border: none;
                        cursor: pointer;
                        margin-left: auto;
                        color: inherit;
                        opacity: 0.7;
                        transition: var(--transition);
                    }
                    
                    .notification-close:hover {
                        opacity: 1;
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
            }
        });
    