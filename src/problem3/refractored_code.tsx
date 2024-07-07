// Assume complete import statements

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;
}

class Datasource {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    const response = await fetch(this.url);
    const data = await response.json();
    const prices: Record<string, number> = {};
    data.forEach((item: { currency: string; price: number }) => {
      prices[item.currency] = item.price;
    });
    return prices;
  }
}

interface Props extends BoxProps {} // Assume proper extension from appropriate import
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances(); // Assume useWalletBalances() hook is defined and sets blockchain
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const datasource = new Datasource(
          "https://interview.switcheo.com/prices.json"
        );
        const prices = await datasource.getPrices();
        setPrices(prices);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrices();
  }, []);

  const blockchainPriorities: { [key: string]: number } = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };

  const getPriority = (blockchain: string): number => {
    return blockchainPriorities[blockchain] ?? -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(5), // Assuming 5 decimal point
    };
  });

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
