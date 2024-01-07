import trailerImg from "data-base64:~/assets/images/trailer.png";


export const TrailerButton = ({ trailerUrl }) => {
    const handleClick = () => {
        // Open a YouTube video with the trailer of a specific movie
        window.open(`https://www.youtube.com/results?search_query=${trailerUrl}+trailer`);
    }

    return (
        <button onClick={handleClick}  type="button" className="trailer-button">
        <img src={trailerImg} alt="Trailer" style={{ width: '25px', height: '25px' }} />
        <span style={{fontSize:"10px"}}>Watch Trailer </span>
        </button>
    );
}