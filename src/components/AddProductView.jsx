import { useState } from 'react';
import { Plus, Calendar, Bell, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTodayString } from '../utils/productUtils';

export default function AddProductView() {
  const { scannedProduct, addProduct, setScannedProduct, setCurrentView } = useApp();
  const [expiryDate, setExpiryDate] = useState('');
  const [reminderDays, setReminderDays] = useState(3);

  if (!scannedProduct) {
    setCurrentView('fridge');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!expiryDate) return;

    const newProduct = {
      ...scannedProduct,
      expiryDate,
      reminderDays: parseInt(reminderDays),
      addedDate: new Date().toISOString()
    };

    addProduct(newProduct);
    setScannedProduct(null);
    setCurrentView('fridge');
  };

  const handleCancel = () => {
    setScannedProduct(null);
    setCurrentView('fridge');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Product Info Card */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 flex items-center gap-3">
          <CheckCircle className="w-6 h-6" />
          <h2 className="text-lg font-bold">Product Found!</h2>
        </div>
        
        <div className="p-6">
          {scannedProduct.image && (
            <div className="mb-5">
              <img 
                src={scannedProduct.image} 
                alt={scannedProduct.name}
                className="w-full h-48 object-contain bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4"
              />
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {scannedProduct.name}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Brand:</span>
              <span>{scannedProduct.brand}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Quantity:</span>
              <span>{scannedProduct.quantity}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Barcode:</span>
              <span className="font-mono text-xs">{scannedProduct.barcode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expiration Form Card */}
      <form onSubmit={handleSubmit} className="card">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Set Expiration Details
          </h3>
          
          <div className="space-y-5">
            {/* Expiry Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Expiration Date *
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={getTodayString()}
                required
                className="input"
              />
            </div>

            {/* Reminder Days */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Bell className="w-4 h-4" />
                Remind Me (days before)
              </label>
              <select
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                className="input appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEgNGgxMHoiIGZpbGw9IiM2YjcyODAiLz48L3N2Zz4=')] bg-[length:12px] bg-[position:right_12px_center] bg-no-repeat pr-10"
              >
                <option value="1">1 day before</option>
                <option value="2">2 days before</option>
                <option value="3">3 days before</option>
                <option value="5">5 days before</option>
                <option value="7">7 days before</option>
                <option value="10">10 days before</option>
                <option value="14">14 days before</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!expiryDate}
                className="btn btn-primary flex-1"
              >
                <Plus className="w-5 h-5" />
                <span>Add to Fridge</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
