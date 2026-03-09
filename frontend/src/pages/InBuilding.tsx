import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type InBuildingProps = {
    name?: string;
};
export default function InBuilding({ name }: InBuildingProps) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen">
                <Header name={name || "Room"} />
                <div className="flex min-h-screen bg-background">
                    <div className="flex-1 flex flex-col min-h-screen">
                        <div className="flex-1 flex items-center justify-center">
                            <h1 className="text-3xl font-bold text-foreground">Page in building</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}