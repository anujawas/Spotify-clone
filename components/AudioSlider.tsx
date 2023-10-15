"use client"

import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";

interface AudioSliderProps {
    duration: number | null;
    isPlaying: boolean;
}
const AudioSlider: React.FC<AudioSliderProps> = ({ duration, isPlaying }) => {

    const player = usePlayer();
    if (isPlaying) {
        setTimeout(() => {
            player.setCurrValue(player.currValue + 0.2);
        }, 200);
    }

    if (duration != null && Math.floor(player.currValue) >= Math.floor(duration / 1000)) {
        player.setCurrValue(0);
    }
    const toHHMMSS = (sec_num: number) => {
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours < 10) { hours = parseInt("0" + hours); }
        if (minutes < 10) {
            if (seconds < 10) {
                return '0' + minutes + ':' + '0' + seconds;
            } else {
                return '0' + minutes + ':' + seconds;
            }
        }
        if (seconds < 10) {
            return minutes + ':0' + seconds;
        }
        return minutes + ':' + seconds;
    }
    return (
        <div className="w-full h-full flex items-center gap-x-2 justify-center hover-div">
            <p className="text-sm font-bold text-white">{!duration ? "00:00" : toHHMMSS(Math.floor(player.currValue))}</p>
            <input placeholder="audio-range" type={'range'} value={player.currValue} min={0} step={1} max={!duration ? 100 : Math.ceil(duration / 1000)} id="progress" readOnly />
            <p className="text-sm font-bold text-white">{!duration ? "00:00" : toHHMMSS(Math.floor(duration / 1000) - 5)}</p>
        </div>
    );
}

export default AudioSlider;