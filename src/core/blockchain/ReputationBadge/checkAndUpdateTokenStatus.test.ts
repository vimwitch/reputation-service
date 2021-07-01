import createMockTokenObject from "src/mocks/createMockToken";
import Token from "src/models/tokens/Token.model";
import { TokenStatus } from "src/models/tokens/Token.types";
import * as isTransactionConfirmed from "src/utils/crypto/isTransactionConfirmed";
import {
  connect,
  dropDatabaseAndDisconnect,
  clearDatabase,
} from "src/utils/server/testDatabase";
import checkAndUpdateTokenStatus from "./checkAndUpdateTokenStatus";
import TwitterBadgeContract from "./TwitterBadgeContract";

jest.mock("./TwitterBadgeContract", () => ({
  exists: jest.fn(),
  getTransferEvent: jest.fn(),
}));

describe("checkAndUpdateTokenStatus", () => {
  beforeAll(async () => {
    await connect();
    // @ts-ignore: mocked above
    TwitterBadgeContract.exists.mockImplementation(() => false);
  });

  afterAll(async () => await dropDatabaseAndDisconnect());

  afterEach(async () => {
    await clearDatabase();
  });

  it("should return undefined if no tokens were passed", async () => {
    // @ts-expect-error: argument not provided
    expect(await checkAndUpdateTokenStatus()).toBeUndefined();
  });

  it("should throw if a token has no decimalId", async () => {
    const token = new Token(createMockTokenObject({ decimalId: undefined }));

    expect(checkAndUpdateTokenStatus([token])).rejects.toThrowError(
      `Token with id ${token.id} has no decimalId`
    );
  });

  it("should update MINT_PENDING -> MINTED", async () => {
    // @ts-ignore: mocked above
    TwitterBadgeContract.exists.mockImplementationOnce(() => true);

    const token = new Token(
      createMockTokenObject({ status: TokenStatus.MINT_PENDING })
    );

    await checkAndUpdateTokenStatus([token]);

    const tokenSaved = await Token.findById(token.id);

    expect(tokenSaved?.status).toEqual(TokenStatus.MINTED);
  });

  it("should not update if the status is NOT_MINTED", async () => {
    const token = new Token(
      createMockTokenObject({ status: TokenStatus.NOT_MINTED })
    );
    await token.save();

    await checkAndUpdateTokenStatus([token]);

    const tokenSaved = await Token.findById(token.id);

    expect(tokenSaved?.status).toEqual(TokenStatus.NOT_MINTED);
  });

  it("should not update if the status is REVOKED", async () => {
    const token = new Token(
      createMockTokenObject({ status: TokenStatus.REVOKED })
    );
    await token.save();

    await checkAndUpdateTokenStatus([token]);

    const tokenSaved = await Token.findById(token.id);

    expect(tokenSaved?.status).toEqual(TokenStatus.REVOKED);
  });

  it("should update MINT_PENDING -> NOT_MINTED", async () => {
    jest
      .spyOn(isTransactionConfirmed, "isTransactionConfirmed")
      .mockResolvedValueOnce(true);

    const token = new Token(
      createMockTokenObject({
        status: TokenStatus.MINT_PENDING,
        mintTransactions: [
          {
            response: {
              hash:
                "0x86170358b3fc6c27d281c48a089cd383a2b7507544e76713834ab141cc2d6929",
              chainId: 33137,
            },
          },
        ],
      })
    );
    await token.save();

    await checkAndUpdateTokenStatus([token]);

    const tokenSaved = await Token.findById(token.id);

    expect(tokenSaved?.status).toEqual(TokenStatus.NOT_MINTED);
  });

  it("should still be MINT_PENDING if a transaction is pending", async () => {
    jest
      .spyOn(isTransactionConfirmed, "isTransactionConfirmed")
      .mockResolvedValueOnce(false);
    const token = new Token(
      createMockTokenObject({
        status: TokenStatus.MINT_PENDING,
        mintTransactions: [
          {
            response: {
              hash:
                "0x86170358b3fc6c27d281c48a089cd383a2b7507544e76713834ab141cc2d6929",
              chainId: 33137,
            },
          },
        ],
      })
    );
    await token.save();

    await checkAndUpdateTokenStatus([token]);

    const tokenSaved = await Token.findById(token.id);

    expect(tokenSaved?.status).toEqual(TokenStatus.MINT_PENDING);
  });

  it("should update if token was burned", async () => {
    // @ts-ignore: mocked above
    TwitterBadgeContract.getTransferEvent.mockImplementationOnce(() =>
      Promise.resolve([{ mock: "event" }])
    );

    const token = new Token(
      createMockTokenObject({ status: TokenStatus.MINTED })
    );

    await checkAndUpdateTokenStatus([token]);

    expect(token.status).toEqual(TokenStatus.BURNED);
  });

  it("should throw if no burn event was found", async () => {
    // @ts-ignore: mocked above
    TwitterBadgeContract.getTransferEvent.mockImplementationOnce(() =>
      Promise.reject(new Error("Can't find events"))
    );

    const token1 = new Token(
      createMockTokenObject({ status: TokenStatus.MINTED })
    );

    const token2 = new Token(
      createMockTokenObject({ status: TokenStatus.MINT_PENDING })
    );

    const check = () => checkAndUpdateTokenStatus([token1, token2]);

    expect(check()).rejects.toThrowError("Can't find events");
  });
});