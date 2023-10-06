"use client"
const AudioSlider = () => {
    return (
        <div className="h-[4px] w-full bg-white fixed mb-10">
            <input className="w-full" placeholder="audio-range" type={'range'} value={50} id="progress" />
        </div>
    );
}

export default AudioSlider;