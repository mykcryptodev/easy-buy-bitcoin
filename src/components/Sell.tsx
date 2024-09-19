import { type FC, useMemo, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import { parseEther, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { base } from "viem/chains";
import { Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from "@coinbase/onchainkit/transaction";
import { env } from "~/env";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";

type Props = {
  goBack: () => void;
};

export const Sell: FC<Props> = ({ goBack }) => {
  const account = useAccount();

  const { data: etherPrice } = api.chainlink.getAssetPrice.useQuery({
    asset: "ETH",
  });
  const { data: btcPrice } = api.chainlink.getAssetPrice.useQuery({
    asset: "BTC",
  });

  const [amount, setAmount] = useState<string>("");
  const debouncedAmount = useDebounce(amount, 500);
  const debouncedAmountInEther = useMemo(() => {
    if (!etherPrice || !debouncedAmount) return "0";
    const amountInEther = parseFloat(debouncedAmount) / Number(etherPrice);
    return parseEther(amountInEther.toString() ?? "0").toString();
  }, [debouncedAmount, etherPrice]);

  // the amount equates to how much USD the user wants to receive
  // in order to receive that much, they will need to sell btc
  // so we need to calculate how much btc they need to sell
  const debouncedAmountInBtc = useMemo(() => {
    if (!btcPrice || !debouncedAmount) return "0";
    const amountInBtc = parseFloat(debouncedAmount) / Number(btcPrice);
    return amountInBtc.toString();
  }, [debouncedAmount, btcPrice]);

  const { data: encodedData, isLoading: encodedDataIsLoading } =
    api.kyberswap.getCheckoutData.useQuery(
      {
        chainId: base.id,
        from: account?.address ?? zeroAddress,
        to: account?.address ?? zeroAddress,
        tokensToBuy: [
          {
            token: NATIVE_TOKEN_ADDRESS,
            amount: debouncedAmountInBtc,
          },
        ],
      },
      {
        enabled:
          !!account &&
          !!debouncedAmountInBtc &&
          debouncedAmountInBtc !== "0",
      },
    );

  const calls = useMemo(() => {
    return (
      encodedData?.map(({ data }) => ({
        to: data.routerAddress as `0x${string}`,
        data: data.data as `0x${string}`,
        value: BigInt(data.amountIn),
      })) ?? []
    );
  }, [encodedData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button className="btn btn-secondary btn-xs" onClick={goBack}>
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
      <Transaction 
        chainId={base.id} 
        calls={calls}
        capabilities={{
          paymasterService: {
            url: env.NEXT_PUBLIC_CDP_PAYMASTER_URL,
          }
        }}
      >
        <TransactionButton
          text={`${encodedDataIsLoading ? "Loading..." : `Buy ${Number(amount).toLocaleString([], { style: "currency", currency: "USD" })} of Bitcoin`}`}
          disabled={encodedDataIsLoading}
          className="bg-none! hover:bg-none! p-0 text-primary-content! btn btn-primary btn-lg"
        />
        <TransactionToast>
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </TransactionToast>
      </Transaction>
    </div>
  );
};
