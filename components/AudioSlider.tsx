"use"
const AudioSlider = () => {
    return (
        <input className="h-[6px] w-[98%] bg-green fixed bottom-[80px] right-[1%]  rounded-md" placeholder="audio-range" type={'range'} value={50} id="progress" />
    );
}

export default AudioSlider;