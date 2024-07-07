import React, { useEffect, useState, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";

interface Currency {
  currency: string;
  date: string;
  price: number;
}

interface SelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

const Selector: React.FC<SelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  isOpen,
  toggleOpen,
}) => {
  const [currencies, setCurrencies] = useState<Currency[] | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [icons, setIcons] = useState<{ [key: string]: string | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data) => {
        const currencyMap: { [key: string]: Currency } = {};
        data.forEach((currency: Currency) => {
          if (!currencyMap[currency.currency]) {
            currencyMap[currency.currency] = currency;
          }
        });
        let uniqueCurrencies = Object.values(currencyMap);

        uniqueCurrencies = uniqueCurrencies.sort((a, b) =>
          a.currency.localeCompare(b.currency)
        );

        setCurrencies(uniqueCurrencies);

        uniqueCurrencies.forEach((currency) => {
          getCurrencyIcon(currency.currency).then((icon) => {
            setIcons((prevIcons) => ({
              ...prevIcons,
              [currency.currency]: icon,
            }));
          });
        });
      });
  }, []);

  const getCurrencyIcon = async (currency: string) => {
    try {
      const icon = await import(`../assets/tokens/${currency}.svg`);
      return icon.default;
    } catch (err) {
      return null;
    }
  };

  const handleSelect = (currency: string) => {
    onCurrencyChange(currency);
    toggleOpen();
    setInputValue("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      toggleOpen();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="w-60 font-medium pl-1" ref={dropdownRef}>
      <div
        onClick={toggleOpen}
        className={`bg-bg dark:bg-dark_bg w-full p-2 flex items-center justify-between rounded ${
          !selectedCurrency && "text-gray-700 dark:text-dark_text"
        } cursor-pointer relative`}
      >
        {selectedCurrency ? (
          <div className="flex items-center">
            {icons[selectedCurrency] && (
              <img
                src={icons[selectedCurrency]}
                alt={selectedCurrency}
                className="w-5 h-5 mr-2"
              />
            )}
            {selectedCurrency}
          </div>
        ) : (
          "Select Token"
        )}
        <BiChevronDown size={20} className={`${isOpen && "rotate-180"}`} />
      </div>
      {isOpen && (
        <ul className="bg-bg dark:bg-dark_bg mt-2 overflow-y-auto max-h-60 absolute w-60 rounded-md z-10 shadow-md">
          <div className="flex items-center px-2 sticky top-0 bg-bg dark:bg-dark_bg rounded-t-md">
            <AiOutlineSearch size={18} className="text-gray-700" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toLowerCase())}
              placeholder="Enter token name"
              className="placeholder:text-gray-700 placeholder:dark:text-gray-200 bg-bg dark:bg-dark_bg p-2 outline-none w-full"
            />
          </div>
          {currencies?.map((currency) => (
            <li
              key={currency.currency}
              className={`p-2 text-sm hover:bg-gray-200 hover:dark:bg-dark_secondary hover: flex items-center ${
                currency.currency.toLowerCase() ===
                  selectedCurrency.toLowerCase() && "bg-select dark:bg-dark_select"
              } ${
                currency.currency.toLowerCase().startsWith(inputValue)
                  ? "block"
                  : "hidden"
              } cursor-pointer`}
              onClick={() => handleSelect(currency.currency)}
            >
              {icons[currency.currency] && (
                <img
                  src={icons[currency.currency]!}
                  alt={currency.currency}
                  className="w-5 h-5 mr-2"
                />
              )}
              {currency.currency}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Selector;
