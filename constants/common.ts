import { IPaymentDetails } from "../interfaces/IPayment";

export const DEFAULT_DECIMALS = 6;
const TEST_USD_CONTRACT_ADDRESS = "0x96a2C26142715633cd3C0a343fd8B7Fdfb17Cd3a";
const OWNER_ADDRESS = "0x5Cb289b2604120022A6C6A188B14b1c74365289A";

const amounts = {
  1: 10000,
  2: 20000,
  3: 30000,
};

export const TEST_ADDRESSES = {
  1: "0x2F8C6C5D12391F8D6AcE02A63a579f391F04b40f",
  2: "0xF9ee7f3e841B98Eb6895a2905564F50bcfA39DfB",
  3: "0xe2A2C2bB5014Ed1922F0c93f30CAd1e3af0ed60B",
  4: "0x9fCCaf1654B0fA5DBBf2A40617a3CAF952Db166D",
  5: "0x6F5744B20A60A3A6aCF73bfBee6C2BaCE4Ed1140",
  6: "0x75B59c086D31B4c8BbbD26DA29B1100c2928410A",
  7: "0xDEcaEFb18B535cAEEd79B36EE5D4F6ba06F5756B",
};

export const PAYMENT_DETAILS: IPaymentDetails = {
  decimals: DEFAULT_DECIMALS,
  payments: {
    [OWNER_ADDRESS]: amounts[1],
    "0x863592E345ca6b414043a091Ad526e0767Cce151": amounts[2],
    "0x8F187b0B55d09a5d9f669392517a7117c2800dcd": amounts[3],
  },
};

export const NETWORK_CONTEXT_NAME = "NETWORK";