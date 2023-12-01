import ms from 'ms';

export function seconds(msValue: string): number {
  return ms(msValue) / 1000;
}

export const sleep = (timeout: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
};
