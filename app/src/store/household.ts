import { create } from "zustand";
import {
  computeHousehold,
  defaultHousehold,
  type HouseholdInput,
  type HouseholdResult,
} from "@/lib/calc";

type HouseholdState = HouseholdInput & {
  result: HouseholdResult;
  setField: <K extends keyof HouseholdInput>(key: K, value: HouseholdInput[K]) => void;
  setName: (index: 0 | 1 | 2 | 3, value: string) => void;
  reset: () => void;
};

function withResult(input: HouseholdInput): Pick<HouseholdState, keyof HouseholdInput | "result"> {
  return { ...input, result: computeHousehold(input) };
}

export const useHousehold = create<HouseholdState>()((set, get) => ({
  ...withResult(defaultHousehold),
  setField: (key, value) => {
    const next = { ...get(), [key]: value } as HouseholdInput;
    set(withResult(next));
  },
  setName: (index, value) => {
    const names = [...get().names] as HouseholdInput["names"];
    names[index] = value;
    set(withResult({ ...get(), names }));
  },
  reset: () => set(withResult(defaultHousehold)),
}));
