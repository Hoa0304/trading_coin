// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BitcoinTrading
 * @dev Smart contract đơn giản để mô phỏng trading Bitcoin
 * Lưu trữ số dư BTC và USD (wei) cho mỗi user
 */
contract BitcoinTrading {
    // Struct để lưu portfolio của user
    struct Portfolio {
        uint256 btcBalance;  // Số dư BTC (wei - 1 BTC = 10^18 wei)
        uint256 usdBalance;  // Số dư USD (wei - 1 USD = 10^18 wei)
    }

    // Mapping từ address đến portfolio
    mapping(address => Portfolio) public portfolios;

    // Struct để lưu transaction
    struct Transaction {
        address user;
        bool isBuy;        // true = buy, false = sell
        uint256 btcAmount;
        uint256 usdAmount;
        uint256 btcPrice;  // Giá BTC tại thời điểm trade (wei)
        uint256 timestamp;
        string ipfsCID;    // CID của metadata trên IPFS
    }

    // Array để lưu transactions
    Transaction[] public transactions;

    // Events
    event TradeExecuted(
        address indexed user,
        bool isBuy,
        uint256 btcAmount,
        uint256 usdAmount,
        uint256 btcPrice,
        uint256 timestamp,
        string ipfsCID
    );

    event PortfolioUpdated(
        address indexed user,
        uint256 btcBalance,
        uint256 usdBalance
    );

    /**
     * @dev Constructor - Khởi tạo với $10,000 USD cho mỗi user mới
     */
    constructor() {
        // Không cần làm gì, portfolio sẽ được tạo khi user trade lần đầu
    }

    /**
     * @dev Khởi tạo portfolio cho user mới với $10,000 USD
     */
    function initializePortfolio() external {
        require(portfolios[msg.sender].btcBalance == 0 && portfolios[msg.sender].usdBalance == 0, "Portfolio already initialized");
        portfolios[msg.sender].usdBalance = 10000 * 10**18; // $10,000 USD
        emit PortfolioUpdated(msg.sender, 0, 10000 * 10**18);
    }

    /**
     * @dev Mua Bitcoin
     * @param btcAmount Số lượng BTC muốn mua (wei)
     * @param btcPrice Giá BTC hiện tại (wei per BTC)
     * @param ipfsCID CID của metadata trên IPFS (có thể để rỗng nếu chưa upload)
     */
    function buyBitcoin(uint256 btcAmount, uint256 btcPrice, string memory ipfsCID) public {
        require(btcAmount > 0, "BTC amount must be greater than 0");
        require(btcPrice > 0, "BTC price must be greater than 0");

        // Tính USD cần chi
        uint256 usdAmount = (btcAmount * btcPrice) / 10**18;

        // Kiểm tra số dư USD
        require(portfolios[msg.sender].usdBalance >= usdAmount, "Insufficient USD balance");

        // Cập nhật portfolio
        portfolios[msg.sender].btcBalance += btcAmount;
        portfolios[msg.sender].usdBalance -= usdAmount;

        // Lưu transaction với IPFS CID
        transactions.push(Transaction({
            user: msg.sender,
            isBuy: true,
            btcAmount: btcAmount,
            usdAmount: usdAmount,
            btcPrice: btcPrice,
            timestamp: block.timestamp,
            ipfsCID: ipfsCID
        }));

        emit TradeExecuted(msg.sender, true, btcAmount, usdAmount, btcPrice, block.timestamp, ipfsCID);
        emit PortfolioUpdated(msg.sender, portfolios[msg.sender].btcBalance, portfolios[msg.sender].usdBalance);
    }

    /**
     * @dev Mua Bitcoin (backward compatibility - không có CID)
     * @param btcAmount Số lượng BTC muốn mua (wei)
     * @param btcPrice Giá BTC hiện tại (wei per BTC)
     */
    function buyBitcoin(uint256 btcAmount, uint256 btcPrice) external {
        buyBitcoin(btcAmount, btcPrice, "");
    }

    /**
     * @dev Bán Bitcoin
     * @param btcAmount Số lượng BTC muốn bán (wei)
     * @param btcPrice Giá BTC hiện tại (wei per BTC)
     * @param ipfsCID CID của metadata trên IPFS (có thể để rỗng nếu chưa upload)
     */
    function sellBitcoin(uint256 btcAmount, uint256 btcPrice, string memory ipfsCID) public {
        require(btcAmount > 0, "BTC amount must be greater than 0");
        require(btcPrice > 0, "BTC price must be greater than 0");

        // Kiểm tra số dư BTC
        require(portfolios[msg.sender].btcBalance >= btcAmount, "Insufficient BTC balance");

        // Tính USD sẽ nhận
        uint256 usdAmount = (btcAmount * btcPrice) / 10**18;

        // Cập nhật portfolio
        portfolios[msg.sender].btcBalance -= btcAmount;
        portfolios[msg.sender].usdBalance += usdAmount;

        // Lưu transaction với IPFS CID
        transactions.push(Transaction({
            user: msg.sender,
            isBuy: false,
            btcAmount: btcAmount,
            usdAmount: usdAmount,
            btcPrice: btcPrice,
            timestamp: block.timestamp,
            ipfsCID: ipfsCID
        }));

        emit TradeExecuted(msg.sender, false, btcAmount, usdAmount, btcPrice, block.timestamp, ipfsCID);
        emit PortfolioUpdated(msg.sender, portfolios[msg.sender].btcBalance, portfolios[msg.sender].usdBalance);
    }

    /**
     * @dev Bán Bitcoin (backward compatibility - không có CID)
     * @param btcAmount Số lượng BTC muốn bán (wei)
     * @param btcPrice Giá BTC hiện tại (wei per BTC)
     */
    function sellBitcoin(uint256 btcAmount, uint256 btcPrice) external {
        sellBitcoin(btcAmount, btcPrice, "");
    }

    /**
     * @dev Lấy portfolio của user
     */
    function getPortfolio(address user) external view returns (uint256 btcBalance, uint256 usdBalance) {
        return (portfolios[user].btcBalance, portfolios[user].usdBalance);
    }

    /**
     * @dev Lấy số lượng transactions
     */
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    /**
     * @dev Lấy transaction theo index
     */
    function getTransaction(uint256 index) external view returns (
        address user,
        bool isBuy,
        uint256 btcAmount,
        uint256 usdAmount,
        uint256 btcPrice,
        uint256 timestamp,
        string memory ipfsCID
    ) {
        require(index < transactions.length, "Transaction index out of bounds");
        Transaction memory transaction = transactions[index];
        return (transaction.user, transaction.isBuy, transaction.btcAmount, transaction.usdAmount, transaction.btcPrice, transaction.timestamp, transaction.ipfsCID);
    }

    /**
     * @dev Lấy tất cả transactions của user
     */
    function getUserTransactions(address user) external view returns (uint256[] memory) {
        uint256 count = 0;
        // Đếm số transactions của user
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].user == user) {
                count++;
            }
        }

        // Tạo array và lưu indices
        uint256[] memory indices = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].user == user) {
                indices[index] = i;
                index++;
            }
        }

        return indices;
    }
}

