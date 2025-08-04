
import { useState, useEffect } from "react";
import INavigationItem from "@/app/models/INavigationItem";
export default function NavigationItem({ 
    inputAttr, 
    labelAttr, 
    listAttr, 
    childElements,
    navigationClose
}: INavigationItem) {
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(()=> {
        if(navigationClose){
            setIsExpanded(false);
        }
    }, [navigationClose]);
    return (<>
        <input 
            id={inputAttr.id}
            className={inputAttr.classes}
            type="checkbox"
            checked={isExpanded}
            onChange={()=> setIsExpanded(!isExpanded)}
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
            aria-hidden={!isExpanded} 
            hidden={!isExpanded}>{childElements}</ul>
    </>);
}
