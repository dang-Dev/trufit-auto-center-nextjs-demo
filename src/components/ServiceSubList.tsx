import { SubServices } from "@/context";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function ServiceSubList({ subServices }: { subServices: SubServices }) {
    return (
        <ul className="space-y-2">
            {subServices.list.map((e) => (
                <li key={e}>
                    <div className="flex items-center gap-x-3">
                        <CheckBadgeIcon className={`h-6 w-6 ${subServices.checkBoxColor}`} />
                        <label className="block text-sm font-medium leading-6 text-gray-900">{e}</label>
                    </div>
                </li>
            ))}
        </ul>
    );
}
