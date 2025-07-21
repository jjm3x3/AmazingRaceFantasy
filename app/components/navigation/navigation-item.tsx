
import { useState, useEffect, useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import INavigationItem from "@/app/models/INavigationItem";
export default function NavigationItem({ inputAttr, labelAttr, listAttr, childElements }: INavigationItem) {
    const [isHidden, setIsHidden] = useState(true);
    const { isLoggedIn } = useContext(SessionContext);
    useEffect(()=> {
        if(isLoggedIn){
            setIsHidden(!isHidden);
        }
    }, [isLoggedIn]);
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
