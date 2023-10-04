import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
    return (
        <button type="button" title="play" className="transition
        opacity-0
        rounded-full
        flex
        items-center
        bg-green-500
        p-4
        drop-shadow-md
        translate
        group-hover:opacity-100
        group-hover:translate-y-0
        hover:scale-110
        ">
            <FaPlay className="text-black" />
        </button>
    );
}

export default PlayButton;