import { createContext, useContext } from "react";

// Two contexts so the 4 Hz time updates do not re-render every player consumer.
// PlayerContext: { queue, index, track, status, direction, shuffle, repeat, actions }
// TimeContext:   { position, duration, buffered }
export const PlayerContext = createContext(null);
export const TimeContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);
export const usePlayerTime = () => useContext(TimeContext);
