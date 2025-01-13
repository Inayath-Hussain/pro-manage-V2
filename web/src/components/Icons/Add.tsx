import { memo } from "react";


const Add = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
            <path
                d="M8 1v14M1 8h14"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const AddLogo = memo(Add);
export default AddLogo;