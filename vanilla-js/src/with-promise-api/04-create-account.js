import { ApiPromise } from '@polkadot/api';
import {
  ALICE, BOB, createElement, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/05/
export default async (provider) => {
  // const wrapper = createWrapper('create-account');
  // const api = await ApiPromise.create(provider);

  // A fixed seed from a 32 chars string
  const SEED1 = new TextEncoder().encode('The big brown fox jumped over me!');
  const pair1 = new Keyring().addFromSeed(SEED1);
  console.log(`Address 1\t ${pair1.address()}\t Seed: ${u8aToHex(SEED1)}`);
  // A fixed seed from an array
  const SEED2 = new Uint8Array([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 0, 0
  ]);
  const pair2 = new Keyring().addFromSeed(SEED2);
  console.log(`Address 2\t ${pair2.address()}\t Seed: ${u8aToHex(SEED2)}`);

  // A random seed
  const SEED3 = new Uint8Array(32);

  for (let i = 3; i < 13; i++) {
    Buffer.from(crypto.randomFillSync(SEED3));
    const pair3 = new Keyring().addFromSeed(SEED3);
    console.log(`Address ${i}\t ${pair3.address()}\t Seed: ${u8aToHex(SEED3)}`);
  }

  console.log(SEED1, SEED2, SEED3);
  // createElement(`SubsciptionId: ${subscriptionId}`, wrapper);
};
