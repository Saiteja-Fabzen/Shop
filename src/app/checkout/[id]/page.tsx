'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { ApiProduct } from '@/types/api';
import { apiService } from '@/services/api';
import CustomLoader from '@/components/CustomLoader';
import LoadingSpinner from '@/components/LoadingSpinner';
import WalletButton from '@/components/WalletButton';

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
  const [quantityError, setQuantityError] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletLoading, setWalletLoading] = useState(true);
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

  const balance = walletBalance;
  const required = product ?
    (selectedVariation ?
      product.variations.find(v => v.name === selectedVariation)?.price || product.price
      : product.price) * quantity
    : 0;

  const isBalanceSufficient = balance >= required;
  const shortfall = required - balance;

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

    const fetchWalletBalance = async () => {
      try {
        setWalletLoading(true);
        const walletData = await apiService.getWallet();
        setWalletBalance(parseFloat(walletData.shop));
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        setWalletBalance(0);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchProduct();
    fetchWalletBalance();
  }, [resolvedParams.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityIncrease = () => {
    if (!product) return;

    if (quantity < product.stock) {
      setQuantity(quantity + 1);
      setQuantityError('');
    } else {
      setQuantityError(`Only ${product.stock} left`);
      // Clear error after 3 seconds
      setTimeout(() => setQuantityError(''), 3000);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setQuantityError('');
    }
  };

  const validateBasicDetails = () => {
    const { name, email, phone } = formData;

    if (!name.trim()) {
      alert('Please enter your name');
      return false;
    }

    if (!email.trim()) {
      alert('Please enter your email');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }

    // Basic phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const validateAddress = () => {
    const { houseNo, city, state, pincode } = formData;

    if (!houseNo.trim()) {
      alert('Please enter your house number/building name');
      return false;
    }

    if (!city.trim()) {
      alert('Please enter your city');
      return false;
    }

    if (!state.trim()) {
      alert('Please select your state');
      return false;
    }

    if (!pincode.trim()) {
      alert('Please enter your pincode');
      return false;
    }

    // Basic pincode validation (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const isBasicDetailsComplete = () => {
    const { name, email, phone } = formData;
    const isNameValid = name.trim().length > 0;
    const isEmailValid = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const cleanPhone = phone.replace(/\D/g, '');
    const isPhoneValid = cleanPhone.length >= 10;

    console.log('Validation check:', { name: isNameValid, email: isEmailValid, phone: isPhoneValid, cleanPhone });

    return isNameValid && isEmailValid && isPhoneValid;
  };

  const isAddressComplete = () => {
    const { houseNo, city, state, pincode } = formData;
    const isHouseNoValid = houseNo.trim().length > 0;
    const isCityValid = city.trim().length > 0;
    const isStateValid = state.trim().length > 0;
    const cleanPincode = pincode.replace(/\D/g, '');
    const isPincodeValid = cleanPincode.length >= 6;

    console.log('Address validation:', { houseNo: isHouseNoValid, city: isCityValid, state: isStateValid, pincode: isPincodeValid, cleanPincode });

    return isHouseNoValid && isCityValid && isStateValid && isPincodeValid;
  };

  const canProceedToNext = () => {
    if (currentStep === 1) {
      return isBasicDetailsComplete();
    } else if (currentStep === 2) {
      return isAddressComplete();
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateBasicDetails()) {
        return;
      }
    } else if (currentStep === 2) {
      if (!validateAddress()) {
        return;
      }
    }

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

    // Check balance before submitting
    if (!isBalanceSufficient) {
      alert(`Insufficient balance! You need ₹${shortfall.toLocaleString()} more to complete this order.`);
      return;
    }

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

      if (response.success === true) {
        alert('Order submitted successfully!');
        router.push('/orders'); // Redirect to orders page
      } else {
        console.error('Order submission failed:', response);
        alert(`Failed to submit order: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        alert(`Error submitting order: ${error.message}`);
      } else {
        console.error('Unknown error:', error);
        alert('Unknown error submitting order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTopUp = () => {
    // If balance is sufficient, submit order
    if (isBalanceSufficient) {
      handleSubmitOrder();
    } else {
      // Show message about insufficient balance
      alert(`Insufficient balance! You need ₹${shortfall.toLocaleString()} more to complete this order.`);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Basic Details' },
      { number: 2, label: 'Address' },
      { number: 3, label: 'Summary' }
    ];

    return (
      <div className="mb-8">
        {/* Step circles and connecting lines */}
        <div className="flex items-center justify-center mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.number <= currentStep
                  ? 'bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-400 border-2 border-yellow-300 text-orange-800'
                  : 'bg-[#000E4E] text-purple-300 border-2 border-[#002E74]'
              }`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step.number < currentStep
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-300'
                    : 'bg-[#002E74]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step labels aligned with circles */}
        <div className="flex justify-between px-1">
          {steps.map((step) => (
            <div key={step.number} className="text-center flex-1">
              <p className={`text-xs leading-tight ${
                currentStep >= step.number
                  ? 'text-yellow-400 font-medium'
                  : 'text-purple-300'
              }`}>
                {step.label.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && step.label.includes('\n') && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full bg-white rounded-lg p-4 pl-12 text-gray-900 placeholder-gray-500 border border-purple-200 focus:border-purple-400 focus:outline-none"
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
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleQuantityDecrease}
              disabled={quantity <= 1}
              className={`w-10 h-10 text-[25px] rounded-full flex items-center justify-center ${
                quantity <= 1
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              -
            </button>
            <span className="text-white text-lg font-bold">Qty: {quantity}</span>
            <button
              onClick={handleQuantityIncrease}
              disabled={product && quantity >= product.stock}
              className={`w-10 h-10 text-[25px] rounded-full flex items-center justify-center ${
                product && quantity >= product.stock
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              +
            </button>
          </div>
          {quantityError && (
            <div className="text-center">
              <p className="text-red-400 text-sm font-medium">{quantityError}</p>
            </div>
          )}
          {product && (
            <div className="text-center">
              <p className="text-purple-300 text-xs">
                {product.stock} available in stock
              </p>
            </div>
          )}
        </div>

        {/* Variation Selector */}
        {product.variations.length > 1 && (
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
            <WalletButton size="large" className="text-white" />
          </div>
          <div className="text-center mb-4">
            <span className="text-white font-bold text-2xl">
              Required: {required.toLocaleString()}
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
        <div
          onClick={() => setCurrentStep(2)}
          className="bg-[#000E4E] rounded-lg p-4 border border-purple-700/30 cursor-pointer hover:bg-[#001155] transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setCurrentStep(2);
            }
          }}
          title="Click to edit address"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">{formData.name || 'Deepanjal Mitra'}</span>
            <span className="text-purple-200">{formData.phone}</span>
            <div className="text-purple-300">
              <ArrowLeft className="rotate-45" size={16} />
            </div>
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
      {walletLoading ? (
        <div className="bg-gray-500/20 border border-gray-500 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">⏳</span>
            <span className="text-gray-500 font-medium">Checking balance...</span>
          </div>
        </div>
      ) : isBalanceSufficient ? (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-green-500 font-medium">Sufficient balance</span>
          </div>
        </div>
      ) : (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center flex-col space-y-2">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              <span className="text-red-500 font-medium">Insufficient balance</span>
            </div>
            <div className="text-red-400 text-sm">
              You need ₹{shortfall.toLocaleString()} more to complete this order
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-white">
        <span>Balance: {walletLoading ? '...' : `₹${balance.toLocaleString()}`}</span>
        <span>Required: ₹{required.toLocaleString()}</span>
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
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 text-white bg-[#212464] z-10 border-b border-purple-700/30 h-16">
          <div className="flex items-center justify-between h-full">
            <button onClick={handleBack} className="p-2 -ml-2 flex-shrink-0">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center mx-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {product?.name}
            </h1>
            <WalletButton size="small" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="pt-16 pb-24 overflow-y-auto">
        <div className="px-4 py-6">
          {renderStepIndicator()}

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
              disabled={!canProceedToNext()}
              className={`w-full font-bold py-4 px-6 rounded-full transition-opacity ${
                canProceedToNext()
                  ? 'bg-gradient-button text-black hover:opacity-90'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleTopUp}
              disabled={submitting || walletLoading}
              className={`w-full font-bold py-4 px-6 rounded-full transition-opacity disabled:opacity-50 ${
                walletLoading ? 'bg-gray-500 text-white'
                : isBalanceSufficient ? 'bg-gradient-button text-black hover:opacity-90'
                : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="secondary" />
                  <span>Submitting Order...</span>
                </div>
              ) : walletLoading ? (
                'Checking Balance...'
              ) : isBalanceSufficient ? (
                `Submit Order ₹${required.toLocaleString()} →`
              ) : (
                `Insufficient Balance (₹${shortfall.toLocaleString()} short)`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}