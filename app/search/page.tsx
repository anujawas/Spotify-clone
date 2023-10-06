import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import getSongsByAuthor from "@/actions/getSongsByAuthor";
import { Song } from "@/types";

interface SearchProps {
    searchParams: {
        title: string;
    }
}
export const revalidate = 0;
const Search = async ({ searchParams }: SearchProps) => {

    const songsTitle = await getSongsByTitle(searchParams.title);
    const songsAuthor = await getSongsByAuthor(searchParams.title);
    const songs = Array<Song>();
    for (let i = 0; i < songsTitle.length; i++) {
        songs.push(songsTitle[i]);
    }
    for (let i = 0; i < songsAuthor.length; i++) {
        let found = false;
        for (let j = 0; j < songs.length; j++) {
            if (songs[j].id === songsAuthor[i].id) {
                found = true;
                break;
            }
        }
        if (!found) {
            songs.push(songsAuthor[i]);
        }
    }



    return (
        <div className="
        bg-neutral-900
        rounded-lg
        h-full w-full overflow-hidden
        overflow-y-auto
        ">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        Search
                    </h1>
                    <SearchInput />
                </div>
            </Header>
            <SearchContent songs={songs} />
        </div>
    )
}
export default Search;