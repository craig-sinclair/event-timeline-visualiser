import TimelinesTable from "@/app/components/ui/timelines-table"

export default function ProfileSetupPage() {
    return(
        <div className="flex items-center justify-center w-full flex-col">
            <h1 className="mb-3 mt-3 text-2xl font-bold">Explore all Available Timelines</h1>
            <TimelinesTable/>
        </div>
    )
};