import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NFTMintingDeployment", (m) => {
  const nftMinting = m.contract("NFTMinting");

  return { nftMinting };
});