
import { useState, useEffect } from "react";
import INavigationItem from "@/app/models/INavigationItem";
export default function NavigationItem({ 
    inputAttr, 
    labelAttr, 
    listAttr, 
    childElements,
    isExpanded
}: INavigationItem) {
    const [isHidden, setIsHidden] = useState(true);
    useEffect(()=> {
        if(isExpanded){
            setIsHidden(true);
        }
    }, [isExpanded]);
    return (<>
        <input 
            id={inputAttr.id}
            className={inputAttr.classes}
            type="checkbox"
            checked={!isHidden}
            onChange={()=> setIsHidden(!isHidden)}
        />
        <label 
            htmlFor={inputAttr.id}
            id={labelAttr.id}
            aria-controls={labelAttr.aria.controls}
            data-testid={labelAttr.testId}
            className={labelAttr.classes }>{labelAttr.content}</label>
        <ul className={listAttr?.classes}  
            id={listAttr?.id}
            data-testid={listAttr?.testId}
            aria-hidden={isHidden} 
            hidden={isHidden}>{childElements}</ul>
    </>);
}
