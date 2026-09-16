import PlayButton from "@/components/PlayButton";
import SongList from "@/components/SongsList";
import { getplaylistData, homePageData } from "@/services/dataAPI";

const page = async ({ params }) => {
  const playlistData = await getplaylistData(params.playlistId);

  return (
    <div className="w-11/12 m-auto mt-16">
      <div className=" flex flex-col lg:flex-row items-center">
        <img
          className="rounded-full object-cover shadow-2xl"
          referrerPolicy="no-referrer"
          src={playlistData?.image?.[2]?.url || playlistData?.image?.[1]?.url || playlistData?.image?.[0]?.url || "https://i.ytimg.com/vi/sDne5fEsxec/hqdefault.jpg"}
          alt={playlistData?.name || playlistData?.title}
          width={300}
          height={300}
        />

        <div className="lg:ml-10 text-gray-100 mt-12 flex flex-col gap-2 items-center md:items-start">
          <h1 className=" text-xl lg:text-4xl font-bold">
            {playlistData?.name}
          </h1>
          <ul className="flex items-center text-center flex-col gap-3 text-gray-300">
            <li className="text-sm font-semibold">
              {playlistData?.description}
            </li>
          </ul>
          <PlayButton songList={playlistData} />
        </div>
      </div>
      <div className="mt-10 text-gray-200">
        <h1 className="text-3xl font-bold">Songs</h1>
        <SongList SongData={playlistData?.songs} loading={false} />
      </div>
    </div>
  );
};

export default page;

// 4 hour
export const revalidate = 14400;

export async function generateStaticParams() {
  try {
    const res = await homePageData(["english", "hindi", "punjabi"]);
    if (Array.isArray(res?.charts)) {
      return res.charts.map((playlist) => ({
        playlistId: playlist?.id?.toString(),
      }));
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
