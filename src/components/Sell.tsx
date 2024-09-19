import { type FC, useState } from "react";

type Props = {
  goBack: () => void;
};

export const Sell: FC<Props> = ({ goBack }) => {
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button 
        className="btn btn-xs btn-secondary"
        onClick={goBack}
      >
        Go back
      </button>
      <label htmlFor="sellAmount" className="text-sm font-medium">
        Amount of Bitcoin to sell:
      </label>
      <input
        id="sellAmount"
        type="number"
        min="0"
        step="0.00000001"
        value={amount}
        onChange={handleAmountChange}
        className="input input-bordered"
        placeholder="Enter amount in BTC"
      />
      {/* Add a button or additional logic here for processing the sale */}
    </div>
  );
};
