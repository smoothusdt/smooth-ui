export function TextBlock(props: { title: string; children: any }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4 text-xl">
                {props.title}
            </div>
            <div className="space-y-2">
                <p className="text-gray-400">{props.children}</p>
            </div>
        </div>
    );
}