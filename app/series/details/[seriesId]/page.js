import MediaDetailsContainer from "@/Components/MediaDetailsContainer/MediaDetailsContainer"
import SeriesNavbar from "@/Components/SeriesNavbar/SeriesNavbar"
import { getInfo, getVideoInfo, getCastList, getReviews, getRecommended, getSimilar, getOnTheAir } from "@/app/Api/api";


const page = async ({ params }) => {
  const seriesId = parseInt(params.seriesId);

  if (isNaN(seriesId)) {
    return <NotFoun />
  }

  try {
    const movieData = await Promise.all([
      getInfo(seriesId, "tv"),
      getVideoInfo(seriesId, "tv"),
      getCastList(seriesId, "tv"),
      getReviews(seriesId, "tv"),
      getRecommended(seriesId, "tv"),
      getSimilar(seriesId, "tv"),
      getOnTheAir(),
    ]);

    const [seriesInfo, videoInfo, castList, seriesReviews, recommendedSeries, similarSeries, upcomingSeries] = movieData;

    return (
      <>
<div className="pt-[65px] dark:bg-customDark bg-customWhite">
        <SeriesNavbar h="[115px]" />
        <MediaDetailsContainer
          movieInfo={seriesInfo}
          videoInfo={videoInfo}
          castList={castList}
          movieReviews={seriesReviews}
          recommendedMovies={recommendedSeries}
          similarMovies={similarSeries}
          upcomingMovies={upcomingSeries}
          type="Series"
        />


</div>

      </>

    );
  } catch (error) {
    console.error("Error fetching data:", error);

  }
};

export default page;
