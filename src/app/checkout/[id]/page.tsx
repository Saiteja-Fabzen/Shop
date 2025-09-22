'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { ApiProduct } from '@/types/api';
import { apiService } from '@/services/api';
import CustomLoader from '@/components/CustomLoader';
import LoadingSpinner from '@/components/LoadingSpinner';

const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh', 
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export default function Checkout({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [currentStep, setCurrentStep] = useState(1);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dialingCode: '+91',
    houseNo: '',
    buildingName: '',
    roadName: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });

  const balance = 0; // This would come from user context/state
  const required = product ?
    (selectedVariation ?
      product.variations.find(v => v.name === selectedVariation)?.price || product.price
      : product.price) * quantity
    : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProductById(resolvedParams.id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmitOrder = async () => {
    if (!product) return;

    setSubmitting(true);
    try {
      const orderData = {
        userDetails: {
          dialingCode: formData.dialingCode,
          username: formData.name,
          mobileNumber: formData.phone
        },
        shippingAddress: {
          houseNo: formData.houseNo,
          buildingName: formData.buildingName,
          roadNameArea: formData.roadName,
          landmark: formData.landmark,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state
        },
        products: [{
          productid: product._id,
          quantity: quantity,
          variationId: selectedVariation || 'default',
          pricePerUnit: selectedVariation ?
            product.variations.find(v => v.name === selectedVariation)?.price || product.price
            : product.price
        }]
      };

      const response = await apiService.submitOrder(orderData);

      if (response.status === 'success') {
        alert('Order submitted successfully!');
        router.push('/'); // Redirect to home or order confirmation page
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTopUp = () => {
    console.log('Top up clicked');
    // For now, just submit the order directly
    handleSubmitOrder();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step <= currentStep ? 'bg-[#212464] text-white border-2 border-purple-400' : 'bg-[#000E4E] text-purple-300 border-2 border-purple-700'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? 'bg-[#212464]' : 'bg-purple-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-between mb-8 text-sm">
      <div className="text-center">
        <p className={currentStep >= 1 ? 'text-white font-medium' : 'text-purple-300'}>
          Basic<br />Details
        </p>
      </div>
      <div className="text-center">
        <p className={currentStep >= 2 ? 'text-white font-medium' : 'text-purple-300'}>
          Address
        </p>
      </div>
      <div className="text-center">
        <p className={currentStep >= 3 ? 'text-white font-medium' : 'text-purple-300'}>
          Summary
        </p>
      </div>
    </div>
  );

  const renderBasicDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="text-white text-sm mb-2 block">Your Name</label>
        <input
          type="text"
          placeholder="Enter your Your Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Email ID</label>
        <input
          type="email"
          placeholder="Enter your Email ID"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Phone Number</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600" size={16} />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full bg-white rounded-lg p-4 pl-12 text-gray-900 border border-purple-200 focus:border-purple-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="space-y-4">
      <div>
        <label className="text-white text-sm mb-2 block">House No. / Building Name</label>
        <input
          type="text"
          placeholder="Enter your House No. / Building Name"
          value={formData.houseNo}
          onChange={(e) => handleInputChange('houseNo', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Building Name</label>
        <input
          type="text"
          placeholder="Enter your Building Name"
          value={formData.buildingName}
          onChange={(e) => handleInputChange('buildingName', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Road Name / Area / Colony</label>
        <input
          type="text"
          placeholder="Enter your Road Name / Area / Colony"
          value={formData.roadName}
          onChange={(e) => handleInputChange('roadName', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Landmark (Optional)</label>
        <input
          type="text"
          placeholder="Enter your Landmark (Optional)"
          value={formData.landmark}
          onChange={(e) => handleInputChange('landmark', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Pincode</label>
        <input
          type="text"
          placeholder="Enter your Pincode"
          value={formData.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value)}
          className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="text-white text-sm mb-2 block">City</label>
          <input
            type="text"
            placeholder="Enter your City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full bg-white rounded-lg p-4 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
          />
        </div>
        <div className="flex-1 relative">
          <label className="text-white text-sm mb-2 block">State</label>
          <button
            onClick={() => setShowStateDropdown(!showStateDropdown)}
            className="w-full bg-white rounded-lg p-4 text-left text-gray-900 border border-purple-200 focus:border-purple-400 focus:outline-none"
          >
            {formData.state || 'Select State'}
          </button>
          {showStateDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-lg mt-1 max-h-40 overflow-y-auto z-10 border border-purple-200 shadow-lg">
              {indianStates.map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    handleInputChange('state', state);
                    setShowStateDropdown(false);
                  }}
                  className="w-full text-left p-3 text-gray-900 hover:bg-purple-50 text-sm border-b border-purple-100 last:border-b-0"
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!product) return null;

    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

    return (
      <div className="space-y-6">
        {/* Product Summary */}
        <div className="bg-white rounded-lg p-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <img
              src={primaryImage?.url}
              alt={primaryImage?.altText || product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.png';
              }}
            />
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center"
          >
            -
          </button>
          <span className="text-white text-lg font-bold">Qty: {quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Variation Selector */}
        {product.variations.length > 0 && (
          <div>
            <label className="text-white text-sm mb-2 block">Select Variation</label>
            <select
              value={selectedVariation}
              onChange={(e) => setSelectedVariation(e.target.value)}
              className="w-full bg-white rounded-lg p-4 text-gray-900 border border-purple-200 focus:border-purple-400 focus:outline-none"
            >
              <option value="">Default - ₹{product.price.toLocaleString()}</option>
              {product.variations.map((variation, index) => (
                <option key={index} value={variation.name}>
                  {variation.name} - ₹{variation.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-white text-xl font-bold mb-2">{product.name}</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-purple-900">₹</span>
            </div>
            <span className="text-white font-bold text-2xl">
              {required.toLocaleString()}
            </span>
            {quantity > 1 && (
              <span className="text-gray-400 text-sm ml-2">
                (₹{(required / quantity).toLocaleString()} each)
              </span>
            )}
          </div>
        </div>

      {/* Delivery Address */}
      <div className="border-t border-purple-700 pt-6">
        <p className="text-white font-bold mb-1">DELIVER TO:</p>
        <div className="bg-[#000E4E] rounded-lg p-4 border border-purple-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">{formData.name || 'Deepanjal Mitra'}</span>
            <span className="text-purple-200">{formData.phone}</span>
            <button className="text-purple-300 hover:text-white">
              <ArrowLeft className="rotate-45" size={16} />
            </button>
          </div>
          <p className="text-purple-200 text-sm">
            {formData.houseNo && `${formData.houseNo}, `}
            {formData.roadName && `${formData.roadName}, `}
            {formData.city && `${formData.city}, `}<br />
            {formData.state && `${formData.state}, `}
            {formData.pincode}
          </p>
        </div>
      </div>

      {/* Balance Status */}
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-500 mr-2">⚠</span>
          <span className="text-yellow-500 font-medium">Insufficient balance</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-white">
        <span>Balance: {balance}</span>
        <span>Required: {required.toLocaleString()}</span>
      </div>
    </div>
  );
  };

  if (loading) {
    return <CustomLoader fullScreen text="Loading checkout..." size="lg" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-3 text-white bg-[#212464] z-10 border-b border-purple-700/30 h-16">
          <div className="flex items-start h-full">
            <button onClick={handleBack} className="p-2 -ml-2 mt-1 flex-shrink-0">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-bold flex-1 text-center mx-2 leading-tight line-clamp-2 overflow-hidden">
              {product?.name}
            </h1>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="pt-16 pb-24 overflow-y-auto">
        <div className="px-4 py-6">
          {renderStepIndicator()}
          {renderStepLabels()}

          {currentStep === 1 && renderBasicDetails()}
          {currentStep === 2 && renderAddress()}
          {currentStep === 3 && renderSummary()}
        </div>
        </div>

        {/* Fixed Action Button */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-[#002E74]">
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-button text-black font-bold py-4 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleTopUp}
              disabled={submitting}
              className="w-full bg-gradient-button text-black font-bold py-4 px-6 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="secondary" />
                  <span>Submitting Order...</span>
                </div>
              ) : (
                `Submit Order ₹${required.toLocaleString()} →`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}