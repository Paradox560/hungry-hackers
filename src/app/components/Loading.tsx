import { Nunito } from "next/font/google";

const nunito = Nunito({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#E8F5E9]">
            <div className="flex p-4">
                <div className="animate-[bounce_1s_ease-in-out_300ms_infinite] bg-[#E13318] rounded-full h-9 w-9 m-1"></div>
                    <div className="animate-[bounce_1s_ease-in-out_500ms_infinite] bg-[#E13318] rounded-full h-9 w-9 m-1"></div>
                <div className="animate-[bounce_1s_ease-in-out_700ms_infinite] bg-[#E13318] rounded-full h-9 w-9 m-1"></div>
            </div>
            <div className={`${nunito.className} text-black text-2xl text-center`}>
                <h1 className="text-black text-3xl text-center font-bree-serif">
                    Loading
                </h1>
                <h1 className="text-black text-3xl text-center font-bree-serif">
                    Please wait...
                </h1>
            </div>
        </div>
    );
};

export default Loading;