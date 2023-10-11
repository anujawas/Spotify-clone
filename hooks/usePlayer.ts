
import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    currValue: number;
    activeId?: string;
    isShuffle: boolean;
    isRepeat: boolean;
    isPaused: boolean;
    setIsPaused: (isPaused: boolean) => void;
    setCurrValue: (currValue: number) => void;
    setIsRepeat: (isRepeat: boolean) => void;
    setIsShuffle: (isShuffle: boolean) => void;
    setId: (id: string) => void;
    setIds: (ids: string[]) => void;
    reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    activeId: undefined,
    isShuffle: false,
    isRepeat: false,
    currValue: 0,
    isPaused: false,
    setIsPaused: (isPaused: boolean) => set({ isPaused: isPaused }),
    setCurrValue: (currValue: number) => set({ currValue: currValue }),
    setIsRepeat: (isRepeat: boolean) => set({ isRepeat: isRepeat }),
    setIsShuffle: (isShuffle: boolean) => set({ isShuffle: isShuffle }),
    setId: (id: string) => set({ activeId: id }),
    setIds: (ids: string[]) => set({ ids: ids }),
    reset: () => set({ ids: [], activeId: undefined })
}))

export default usePlayer;