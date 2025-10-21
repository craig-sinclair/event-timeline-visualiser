export default async function TimelinePage({ params }: { params: Promise<{ timelineID: string }> }) {
    const { timelineID } = await params;
    return (
        <h1>{timelineID}</h1>
    )
}