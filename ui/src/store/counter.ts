import { create } from "zustand";
import { produce } from "immer";

type CounterState = {
  count: number;
  nestedCount: { count: number; cool: boolean };
};

type CounterActions = {
  increment: () => void;
  decrement: () => void;
  incrementDeep: () => void;
};

export const useCounterStore = create<CounterState & CounterActions>((set) => ({
  count: 0,
  nestedCount: { count: 0, cool: true },
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () =>
    set((state) => ({ count: state.count ? state.count - 1 : state.count })),
  incrementDeep: () =>
    set(
      produce((state: CounterState) => {
        ++state.nestedCount.count;
      })
    ),
}));
