"use client"

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import VolumeSlider from "./VolumeSlider";
import usePlayer from "@/hooks/usePlayer";

import { BsPauseFill, BsPlayFill, BsRepeat, BsRepeat1 } from 'react-icons/bs'
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2'
import { FaShuffle } from 'react-icons/fa6'

import { KeyboardEvent, useEffect, useState } from 'react';
import { useSound } from 'use-sound'
import AudioSlider from "./AudioSlider";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currIndex = player.ids.findIndex((id) => id === player.activeId);
        const randomIndex = (Math.ceil(Math.random() * player.ids.length)) - 1;
        const nextSong = player.isRepeat ? player.ids[currIndex] : player.isShuffle ? player.ids[randomIndex === currIndex ? currIndex + 1 : randomIndex] : player.ids[currIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }
        if (player.isRepeat) {
            stop();
            play();

        }
        player.setId(nextSong);

    }

    const onPlayPrevious = () => {

        if (player.ids.length === 0) {
            return;
        }
        const currIndex = player.ids.findIndex((id) => id === player.activeId);
        const prevSong = player.isRepeat ? player.ids[currIndex] : player.ids[currIndex - 1];
        if (!prevSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }
        if (player.isRepeat) {
            stop();
            play();
        }
        player.setId(prevSong);

    }

    const [play, { stop, pause, sound, duration }] = useSound<any>(
        songUrl, {
        volume: volume,
        onplay: () => setIsPlaying(true),
        onend: () => {
            setIsPlaying(false);
            onPlayNext();
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3']
    }
    );

    useEffect(() => {
        player.setCurrValue(0);
        sound?.play();

        return () => {
            sound?.unload();
        }
    }, [sound, player.activeId]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    }
    const handleShuffle = () => {
        if (player.isShuffle) {
            player.setIsShuffle(false);
        } else {
            player.setIsShuffle(true);
        }
    }
    const handleRepeat = () => {
        if (player.isRepeat) {
            player.setIsRepeat(false);
        } else {
            player.setIsRepeat(true);
        }
    }
    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    }


    const RepeatIcon = player.isRepeat ? BsRepeat1 : BsRepeat;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>
            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                    <Icon size={30} className="text-black" />
                </div>
            </div>
            <div className=" flex flex-col">
                <div className="hidden h-[70%] md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                    <FaShuffle className={player.isShuffle ? "text-green-600 brightness-90 hover:brightness-200 hover:text-green-500 cursor-pointer" : "text-neutral-400 hover:text-white cursor-pointer"} size={23}
                        onClick={handleShuffle} />
                    <AiFillStepBackward
                        onClick={onPlayPrevious}
                        size={30}
                        className="text-neutral-400 hover:text-white cursor-pointer transition"
                    />
                    <div onClick={handlePlay}
                        className="
                flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} className="text-black" />
                    </div>
                    <AiFillStepForward
                        onClick={onPlayNext}
                        size={30}
                        className="text-neutral-400 hover:text-white cursor-pointer transition"
                    />
                    <RepeatIcon size={24}
                        className={player.isRepeat ? "text-green-600 hover:brightness-200 cursor-pointer font-bold" : "text-neutral-400 hover:text-white cursor-pointer font-bold"}
                        onClick={handleRepeat}
                    />
                </div>
                <AudioSlider duration={duration} isPlaying={isPlaying}
                />
            </div>

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                        size={34}
                        onClick={toggleMute}
                        className="cursor-pointer"
                    />
                    <VolumeSlider
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;