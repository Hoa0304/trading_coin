import { useState, useEffect } from 'react';

/**
 * Hook để lấy giá Bitcoin thời gian thực từ CoinGecko API
 * Sử dụng API công khai không cần API key
 */
export function useBitcoinPrice() {
  const [price, setPrice] = useState(67234.50);
  const [change24h, setChange24h] = useState(0);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy giá Bitcoin hiện tại và thay đổi 24h từ CoinGecko API
   * Sử dụng proxy endpoint để tránh CORS và rate limit
   */
  const fetchBitcoinPrice = async () => {
    try {
      // Sử dụng proxy endpoint từ backend server
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      const response = await fetch(
        `${API_URL}/api/bitcoin/price`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.bitcoin && data.bitcoin.usd) {
        const newPrice = data.bitcoin.usd;
        const newChange24h = data.bitcoin.usd_24h_change || 0;

        setPrice(newPrice);
        setChange24h(newChange24h);

        // Cập nhật lịch sử giá (giữ tối đa 25 điểm dữ liệu)
        setPriceHistory((prevHistory) => {
          const updated = [...prevHistory, newPrice];
          // Giữ tối đa 25 điểm dữ liệu để hiển thị biểu đồ
          return updated.length > 25 ? updated.slice(-25) : updated;
        });

        setError(null);
      }
    } catch (err) {
      console.error('Error fetching Bitcoin price:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price';
      setError(errorMessage);
      
      // Nếu là lỗi network, không hiển thị error để không làm gián đoạn UI
      // App sẽ sử dụng giá mặc định (67234.50) đã set trong useState
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') ||
        err.message.includes('ERR_CONNECTION_CLOSED') ||
        err.message.includes('NetworkError') ||
        err.name === 'AbortError'
      )) {
        console.warn('CoinGecko API không khả dụng, sử dụng giá mặc định');
        setError(null); // Không hiển thị error cho user
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tạo lịch sử giá mẫu dựa trên giá hiện tại
   * Sử dụng khi không lấy được từ API
   */
  const generateMockHistory = (basePrice: number) => {
    if (basePrice > 0) {
      const mockHistory: number[] = [];
      let currentPrice = basePrice;
      
      // Tạo 25 điểm dữ liệu với variation hợp lý
      for (let i = 24; i >= 0; i--) {
        // Variation ±2% để tạo biểu đồ tự nhiên
        const variation = (Math.random() - 0.5) * (basePrice * 0.02);
        const newPrice = Math.max(basePrice * 0.95, currentPrice + variation); // Đảm bảo không quá thấp
        mockHistory.push(newPrice);
        currentPrice = newPrice;
      }
      setPriceHistory(mockHistory);
    }
  };

  /**
   * Lấy lịch sử giá 24h từ CoinGecko (để hiển thị biểu đồ)
   * Sử dụng proxy endpoint để tránh CORS và rate limit
   */
  const fetchPriceHistory = async () => {
    try {
      // Sử dụng proxy endpoint từ backend server
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${API_URL}/api/bitcoin/history`
      );

      if (!response.ok) {
        // Nếu lỗi 401 (cần API key) hoặc các lỗi khác, tạo mock data
        if (response.status === 401) {
          console.warn('CoinGecko API requires API key for market_chart. Using mock data instead.');
          // Sử dụng giá hiện tại hoặc giá mặc định
          generateMockHistory(price || 67234.50);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.prices && Array.isArray(data.prices)) {
        // Lấy giá từ mảng [timestamp, price]
        // Nếu có nhiều điểm, lấy 25 điểm gần nhất
        const allPrices = data.prices.map((item: [number, number]) => item[1]);
        const history = allPrices.length > 25 
          ? allPrices.slice(-25) 
          : allPrices;
        setPriceHistory(history);
      } else {
        // Nếu không có data, tạo mock
        generateMockHistory(price || 67234.50);
      }
    } catch (err) {
      console.error('Error fetching price history:', err);
      // Tạo dữ liệu mẫu dựa trên giá hiện tại hoặc giá mặc định
      generateMockHistory(price || 67234.50);
    }
  };

  useEffect(() => {
    // Lấy giá ngay lập tức
    fetchBitcoinPrice().then(() => {
      // Sau khi có giá, mới fetch history để có thể tạo mock data nếu cần
      fetchPriceHistory();
    });

    // Cập nhật giá mỗi 15 giây (proxy server có cache 10s)
    const interval = setInterval(() => {
      fetchBitcoinPrice();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return { price, change24h, priceHistory, loading, error };
}
