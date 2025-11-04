// Fetch product info from Open Food Facts API
export async function fetchProductInfo(barcode) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    
    if (data.status === 1) {
      return {
        barcode: barcode,
        name: data.product.product_name || 'Unknown Product',
        brand: data.product.brands || 'Unknown Brand',
        image: data.product.image_url || null,
        quantity: data.product.quantity || 'N/A',
        categories: data.product.categories || 'N/A',
        nutriments: data.product.nutriments || {}
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Try alternative endpoint as fallback
    try {
      const response2 = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data2 = await response2.json();
      
      if (data2.status === 1) {
        return {
          barcode: barcode,
          name: data2.product.product_name || 'Unknown Product',
          brand: data2.product.brands || 'Unknown Brand',
          image: data2.product.image_url || null,
          quantity: data2.product.quantity || 'N/A',
          categories: data2.product.categories || 'N/A',
          nutriments: data2.product.nutriments || {}
        };
      }
    } catch (error2) {
      console.error('Fallback fetch failed:', error2);
    }
    
    return null;
  }
}

// Get days until expiry
export function getDaysUntilExpiry(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

// Get expiry status with color and icon
export function getExpiryStatus(days) {
  if (days < 0) {
    return { 
      color: 'badge-danger', 
      icon: '💀', 
      text: `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago` 
    };
  }
  if (days === 0) {
    return { color: 'badge-danger', icon: '⚠️', text: 'Expires today!' };
  }
  if (days === 1) {
    return { color: 'badge-danger', icon: '⚠️', text: 'Expires tomorrow' };
  }
  if (days <= 2) {
    return { color: 'badge-danger', icon: '🔴', text: `${days} days left` };
  }
  if (days <= 5) {
    return { color: 'badge-warning', icon: '🟠', text: `${days} days left` };
  }
  if (days <= 10) {
    return { color: 'badge-warning', icon: '🟡', text: `${days} days left` };
  }
  return { color: 'badge-success', icon: '🟢', text: `${days} days left` };
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

// Get today's date in YYYY-MM-DD format
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}
