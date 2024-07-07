import React, { useState, useEffect } from "react";
import Selector from "./components/Selector";
import Input from "./components/Input";
import useDarkMode from "./hooks/useDarkMode.tsx";
import { IoSwapVertical } from "react-icons/io5";
import { CgDarkMode } from "react-icons/cg";

const App: React.FC = () => {
  const [openSelector, setOpenSelector] = useState<number | null>(null);
  const [sellCurrency, setSellCurrency] = useState<string>("");
  const [buyCurrency, setBuyCurrency] = useState<string>("");
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [lastChanged, setLastChanged] = useState<"sell" | "buy" | null>(null);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data) => {
        const priceMap: { [key: string]: number } = {};
        data.forEach((entry: { currency: string; price: number }) => {
          priceMap[entry.currency] = entry.price;
        });
        setPrices(priceMap);
      });
  }, []);

  const convertSellToBuy = (
    sellValue: string,
    sellCurr: string,
    buyCurr: string
  ) => {
    if (sellCurr && buyCurr && sellValue) {
      const sellPrice = prices[sellCurr];
      const buyPrice = prices[buyCurr];
      const amount = parseFloat(sellValue);
      const convertedAmount = (amount * sellPrice) / buyPrice;
      setBuyAmount(convertedAmount.toFixed(6));
    }
  };

  const convertBuyToSell = (
    buyValue: string,
    sellCurr: string,
    buyCurr: string
  ) => {
    if (sellCurr && buyCurr && buyValue) {
      const sellPrice = prices[sellCurr];
      const buyPrice = prices[buyCurr];
      const amount = parseFloat(buyValue);
      const convertedAmount = (amount * buyPrice) / sellPrice;
      setSellAmount(convertedAmount.toFixed(6));
    }
  };

  const handleSellAmountChange = (value: string) => {
    setSellAmount(value);
    setLastChanged("sell");
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      convertSellToBuy(value, sellCurrency, buyCurrency);
    }, 500);
    setTypingTimeout(timeout);
  };

  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value);
    setLastChanged("buy");
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      convertBuyToSell(value, sellCurrency, buyCurrency);
    }, 500);
    setTypingTimeout(timeout);
  };

  const handleSellCurrencyChange = (currency: string) => {
    setSellCurrency(currency);
    if (lastChanged === "sell") {
      convertSellToBuy(sellAmount, currency, buyCurrency);
    } else {
      convertBuyToSell(buyAmount, currency, buyCurrency);
    }
  };

  const handleBuyCurrencyChange = (currency: string) => {
    setBuyCurrency(currency);
    if (lastChanged === "sell") {
      convertSellToBuy(sellAmount, sellCurrency, currency);
    } else {
      convertBuyToSell(buyAmount, sellCurrency, currency);
    }
  };

  const toggleSelector = (index: number) => {
    setOpenSelector((prevOpenSelector) =>
      prevOpenSelector === index ? null : index
    );
  };

  const swapValues = () => {
    const tempSellCurrency = sellCurrency;
    const tempSellAmount = sellAmount;

    setSellCurrency(buyCurrency);
    setSellAmount(buyAmount);

    setBuyCurrency(tempSellCurrency);
    setBuyAmount(tempSellAmount);

    if (lastChanged === "sell") {
      convertSellToBuy(buyAmount, buyCurrency, tempSellCurrency);
    } else {
      convertBuyToSell(sellAmount, tempSellCurrency, buyCurrency);
    }
  };

  return (
    <div className="App min-h-screen bg-bg text-black dark:bg-dark_bg dark:text-dark_text flex flex-col items-center justify-start pt-0">
      <Header />
      <div className="flex items-center justify-between mt-4 w-128 px-5 py-5 rounded-md bg-secondary dark:bg-dark_secondary">
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-4">
            <h2 className="mr-4 w-20">Amount to send</h2>
            <Input value={sellAmount} onChange={handleSellAmountChange} />
            <Selector
              selectedCurrency={sellCurrency}
              onCurrencyChange={handleSellCurrencyChange}
              isOpen={openSelector === 0}
              toggleOpen={() => toggleSelector(0)}
            />
          </div>
          <div className="flex items-center">
            <h2 className="mr-4 w-20">Amount to receive</h2>
            <Input value={buyAmount} onChange={handleBuyAmountChange} />
            <Selector
              selectedCurrency={buyCurrency}
              onCurrencyChange={handleBuyCurrencyChange}
              isOpen={openSelector === 1}
              toggleOpen={() => toggleSelector(1)}
            />
          </div>
        </div>
        <button
          className="ml-4 p-2 bg-button dark:bg-dark_button text-white rounded-full"
          onClick={swapValues}
        >
          <IoSwapVertical size={24} />
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="w-full bg-bg text-text dark:bg-dark_bg dark:text-dark_text p-4 flex items-center justify-between font-bold">
      <div className="flex-1 flex justify-center">
        <h1 className="text-center text-2xl">Token Swap</h1>
      </div>
      <ThemeIcon />
    </header>
  );
};

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode} className="cursor-pointer">
      <CgDarkMode className="size-6" />
    </span>
  );
};

export default App;
