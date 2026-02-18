import { registerPlugin } from '@capacitor/core';
const SumUp = registerPlugin('SumUp', {
    web: () => import('./web').then((m) => new m.SumUpWeb()),
});
export * from './definitions';
export { SumUp };
