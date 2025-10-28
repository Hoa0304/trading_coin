import { useState, useEffect } from 'react';

export function useBitcoinPrice() {
  const [price, setPrice] = useState(67234.50);
  const [change24h, setChange24h] = useState(2.34);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    const generatePriceHistory = () => {
      const history = [];
      let basePrice = price;
      for (let i = 24; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * 2000;
        history.push(basePrice + variation);
      }
      return history;
    };

    setPriceHistory(generatePriceHistory());

    const interval = setInterval(() => {
      setPrice(prev => {
        const change = (Math.random() - 0.5) * 100;
        const newPrice = prev + change;
        setPriceHistory(prevHistory => [...prevHistory.slice(1), newPrice]);
        return newPrice;
      });
      setChange24h((Math.random() - 0.4) * 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { price, change24h, priceHistory };
}
