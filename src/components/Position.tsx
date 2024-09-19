import { type FC } from "react";
import { ZERO_ADDRESS } from "thirdweb";
import { base } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { CB_BTC } from "~/constants";
import { api } from "~/utils/api";

export const Position: FC = () => {
  const account = useActiveAccount();
  const { data } = api.moralis.getPortfolioPositions.useQuery({
    address: account?.address ?? ZERO_ADDRESS,
    chainId: base.id,
    tokenAddresses: [CB_BTC],
  }, {
    enabled: !!account,
  });
  const { data: performance } = api.moralis.getWalletPerformance.useQuery({
    address: account?.address ?? ZERO_ADDRESS,
    chainId: base.id,
    tokens: [CB_BTC],
  }, {
    enabled: !!account,
  });
  
  console.log({ position: data, performance });
  return (
    <div>
      Position
    </div>
  )
};