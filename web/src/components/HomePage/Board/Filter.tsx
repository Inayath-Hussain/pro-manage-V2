import { getTasksFilterValues } from "@/store/slices/filterSlice";

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowIcon from "@/assets/icons/down-arrow.svg"
import { routes } from "@/routes";
import { getTaskService } from "@/services/api/task/getTask";
import { NetworkError, UnauthorizedError, UserOfflineError } from "@/services/api/errors";
import { filterSelector, updateFilter } from "@/store/slices/filterSlice";
import { renewTaskAction } from "@/store/slices/taskSlice";

import styles from "./Filter.module.css"


type OptionValues = typeof getTasksFilterValues[number]

const Filter: React.FC = () => {

    const selectedFilter = useSelector(filterSelector);

    // state to display and hide filter options
    const [open, setOpen] = useState(false);

    const filterContainerRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {

        const handleClose = (e: MouseEvent) => {
            // if user clicks outside of options container then closes the options
            if (filterContainerRef.current && !e.composedPath().includes(filterContainerRef.current)) setOpen(false)
        }

        document.addEventListener("click", handleClose)

        return () => {
            document.removeEventListener("click", handleClose)
        }
    }, [])


    const handleOpen = () => {
        setOpen(!open)
    }


    const handleFilterChange = async (value: OptionValues) => {

        // abort signalRef
        // signalRef.current.abort();
        // renewController();

        // make call
        try {
            const result = await getTaskService(value)
            // check values of result and do necessary tasks

            // 1. success
            // 2. Unauthorized Error
            // 3. Network Error
            // 4. User offline Error

            switch (true) {
                case (result instanceof UserOfflineError):
                    toast(result.message, { autoClose: 5000, type: "error" })
                    break;

                case (result instanceof UnauthorizedError):
                    toast(result.message, { autoClose: 5000, type: "error" })
                    break;

                case (result instanceof NetworkError):
                    toast(result.message, { autoClose: 5000, type: "error" })
                    break;

                default:
                    dispatch(renewTaskAction(result))

                    // and then change selectedFilter

                    dispatch(updateFilter(value))
            }

        }
        catch (ex) {
            console.log("CATCH >>>> ")
            switch (true) {
                case (ex === false):
                    toast("Please login again", { autoClose: 5000, type: "error" })
                    navigate(routes.user.login)
                    break;

                case (ex instanceof NetworkError):
                    toast(ex.message, { autoClose: 5000, type: "error" })
                    // Check your network and try again toast
                    break;


                default:
                    toast("Something went wrong try again later", { autoClose: 5000, type: "error" })
                    console.log(ex)
                // something went wrong try again later toast
            }
        }
    }




    interface Ioptions {
        value: OptionValues
        displayText: string
    }

    const options: Ioptions[] = [
        { displayText: "Today", value: "day" },
        { displayText: "This Week", value: "week" },
        { displayText: "This Month", value: "month" }
    ]


    const displayText = options.find(o => o.value === selectedFilter)?.displayText

    return (
        <>

            <div className={styles.filter_container} onClick={handleOpen} ref={filterContainerRef}>
                {displayText}

                <img src={ArrowIcon} alt="" />



                {open &&
                    <div className={styles.options_container}>


                        {options.map(o => (
                            <option className={styles.option} onClick={() => handleFilterChange(o.value)}
                                title={o.displayText} key={o.value}>
                                {o.displayText}
                            </option>
                        ))}

                    </div>
                }

            </div>

        </>
    );
}

export default Filter;