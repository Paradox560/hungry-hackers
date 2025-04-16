export default function FrenchFlagIcon({ width, height }: { width: number; height: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 900 600"
        >
            <rect width="300" height="600" fill="#002654" />
            <rect x="300" width="300" height="600" fill="#FFFFFF" />
            <rect x="600" width="300" height="600" fill="#CE1126" />
        </svg>
    );
}