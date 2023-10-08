"use client"

import { useState } from "react";

interface AudioSliderProps {
    duration: number | null;
    isPlaying: boolean
}
const AudioSlider: React.FC<AudioSliderProps> = ({ duration, isPlaying }) => {
    const [currValue, setCurrValue] = useState<number>(0);

    if (isPlaying) {
        setTimeout(() => {
            setCurrValue(currValue + 0.2);
        }, 200);
    }

    if (!duration) {
        return (
            <></>
        )
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
            <p className="text-sm font-bold">{toHHMMSS(Math.floor(currValue))}</p>
            <input placeholder="audio-range" type={'range'} value={currValue} min={0} step={1} max={Math.ceil(duration / 1000)} id="progress" />
            <p className="text-sm font-bold">{toHHMMSS(Math.ceil(duration / 1000))}</p>
        </div>
    );
}

export default AudioSlider;