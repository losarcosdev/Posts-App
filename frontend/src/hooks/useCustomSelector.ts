import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

export const useCustomSelector: TypedUseSelectorHook<RootState> = useSelector;
