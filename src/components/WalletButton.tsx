'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import Image from 'next/image';

interface WalletButtonProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function WalletButton({
  size = 'medium',
  className = ''
}: WalletButtonProps) {
  const [balance, setBalance] = useState<string>('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const walletData = await apiService.getWallet();
        setBalance(walletData.shop);
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        setBalance('0.00');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          icon: 'w-4 h-4',
          iconSize: 16,
          spacing: 'mr-1',
          text: 'font-semibold text-sm'
        };
      case 'large':
        return {
          container: 'px-4 py-3',
          icon: 'w-8 h-8',
          iconSize: 32,
          spacing: 'mr-3',
          text: 'font-bold text-lg'
        };
      default: // medium
        return {
          container: 'px-3 py-2',
          icon: 'w-6 h-6',
          iconSize: 24,
          spacing: 'mr-2',
          text: 'font-bold'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center border border-yellow-300 bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-400 rounded-full ${sizeClasses.container} ${className}`}>
      <div className={sizeClasses.icon}>
        <Image
          src="/images/gems.png"
          alt="Gems"
          width={sizeClasses.iconSize}
          height={sizeClasses.iconSize}
          className="w-full h-full object-contain"
        />
      </div>
      <span className={`${sizeClasses.text} text-orange-800`}>
        {loading ? '...' : balance}
      </span>
    </div>
  );
}