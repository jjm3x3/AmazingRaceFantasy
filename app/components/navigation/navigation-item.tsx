
import { useState, useEffect } from "react";
import INavigationItem from "@/app/models/INavigationItem";
export default function NavigationItem({ 
    inputAttr, 
    labelAttr, 
    listAttr, 
    childElements,
    isExpanded
}: INavigationItem) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    useEffect(()=> {
        if(isExpanded){
            setIsCollapsed(true);
        }
    }, [isExpanded]);
    return (<>
        <input 
            id={inputAttr.id}
            className={inputAttr.classes}
            type="checkbox"
            checked={!isCollapsed}
            onChange={()=> setIsCollapsed(!isCollapsed)}
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
            aria-hidden={isCollapsed} 
            hidden={isCollapsed}>{childElements}</ul>
    </>);
}
