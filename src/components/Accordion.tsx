import { QuestionMarkCircleIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function Accordion(props: any) {
    return (
        <div className="border-none rounded-sm lg:rounded-lg mb-3 ">
            <button
                className={`w-full p-4 text-left bg-red-100 font-medium
                           hover:bg-red-100 transition duration-300 text-sm lg:text-lg ${props.isOpen ? "rounded-t lg:rounded-t-lg": "rounded lg:rounded-lg"}`}
                onClick={props.toggleAccordion}
            >
                <QuestionMarkCircleIcon className="w-5 h-5 lg:h-6 lg:w-6 text-red-500 inline-block mr-2" />{props.title}
                <span
                    className={`float-right transform ${props.isOpen ? "rotate-180" : "rotate-0"} 
                                 transition-transform duration-300`}
                >
                   <ChevronUpIcon className="w-5 h-5 lg:h-6 lg:w-6 text-red-500" />
                </span>
            </button>
            {props.isOpen && <div className="p-4 bg-red-50 text-neutral-600 text-sm lg:text-base rounded lg:rounded-b-lg">{props.data}</div>}
        </div>
    );
}
