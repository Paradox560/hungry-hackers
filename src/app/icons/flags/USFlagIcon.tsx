export default function USFlagIcon({ width, height }: { width: number; height: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 7410 3900" // The standard aspect ratio of the US flag (3:5)
            width={width}
            height={height}
        >
            <rect width="7410" height="3900" fill="#b22234" />
            <path d="M0,450H7410m0,600H0m0,600H7410m0,600H0m0,600H7410m0,600H0" stroke="#fff" strokeWidth="300" />
            <rect width="2964" height="2100" fill="#3c3b6e" />
                <use xlinkHref="#s18" x="988" />
                <use xlinkHref="#s9" x="1976" />
                <use xlinkHref="#s5" x="2470" />
        </svg>
    );
}