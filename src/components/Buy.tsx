import { type FC, useState } from "react";
import { type PreparedTransaction, prepareTransaction, toWei } from "thirdweb";
import { base } from "thirdweb/chains";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { CB_BTC, CB_BTC_IMAGE, client } from "~/constants";
import { api } from "~/utils/api";

type Props = {
  goBack: () => void;
}
export const Buy: FC<Props> = ({ goBack }) => {
  const account = useActiveAccount();
  const { data: etherPrice } = api.ether.getPrice.useQuery();
  const { mutateAsync: getSwapEncodedData } = api.kyberswap.getCheckoutData.useMutation();
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleBuy = async () => {
    if (!account) return;
    const amountInEther = Number(amount) / Number(etherPrice ?? 1);
    const encodedData = await getSwapEncodedData({
      tokensToBuy: [{
        token: CB_BTC,
        amount: toWei(amountInEther.toString()).toString(),
      }],
      chainId: base.id,
      from: account.address,
      to: account.address,
    });
    const data = encodedData[0]?.data;
    if (!data) return;

    return prepareTransaction({
      client,
      to: data.routerAddress as `0x${string}`,
      data: data.data as `0x${string}`,
      value: BigInt(data.amountIn),
      chain: base,
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button 
        className="btn btn-xs btn-secondary"
        onClick={goBack}
      >
        Go back
      </button>
      <label htmlFor="buyAmount" className="text-sm font-medium">
        Amount in USD to buy Bitcoin:
      </label>
      <input
        id="buyAmount"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={handleAmountChange}
        className="input input-lg input-bordered"
        placeholder="Enter amount in USD"
      />
      <TransactionButton
        transaction={async () => await handleBuy() as PreparedTransaction}
        className="btn btn-block btn-primary btn-lg"
        unstyled
        payModal={{
          metadata: {
            name: "Bitcoin",
            image: CB_BTC_IMAGE,
          },
          theme: "light",
        }}
      >
        Buy
      </TransactionButton>
    </div>
  );
};