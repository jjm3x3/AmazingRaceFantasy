import { useState } from "react";
import INavigationItem from "@/app/models/INavigationItem";
export default function NavigationItem({ inputAttr, labelAttr, listAttr, childElements, hasSubpages=false }: INavigationItem) {
    const [isHidden, setIsHidden] = useState(true);
    return (<>
        <input 
            id={inputAttr.id}
            className={inputAttr.classes}
            type="checkbox"
            onChange={(e)=> setIsHidden(!e.target.value)}
        />
        <label 
            htmlFor={inputAttr.id}
            id={labelAttr.id}
            aria-controls={labelAttr?.aria?.controls}
            data-testid={labelAttr.testId}
            className={labelAttr.classes }>{labelAttr.content}</label>
        {hasSubpages && <ul className={listAttr?.classes}  id={listAttr?.id} data-testid={listAttr?.testId} aria-hidden={isHidden} hidden={isHidden}>{childElements}</ul>}
    </>);
}
