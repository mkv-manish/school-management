type Props = {
    totalStudents: number;
    totalPresent: number;
    totalAbsent: number;
    attendancePercentage: number;
};

export default function AdminAttendanceSummaryCards({
    totalStudents,
    totalPresent,
    totalAbsent,
    attendancePercentage,
}: Props) {
    const cards = [
        { label: "Total Students", value: totalStudents },
        { label: "Present", value: totalPresent },
        { label: "Absent", value: totalAbsent },
        { label: "Attendance %", value: `${attendancePercentage}%` },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border bg-white shadow-sm p-5"
                >
                    <div className="text-sm text-slate-500 font-medium">
                        {card.label}
                    </div>
                    <div className="mt-3 text-2xl font-bold text-slate-900">
                        {card.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
