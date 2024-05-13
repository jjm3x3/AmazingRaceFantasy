'use client';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import INavigationItem from '@/app/models/INavigationItem';
export default function NavigationItem({ inputAttr, labelAttr, listAttr, children, hasSubpages }: INavigationItem) {
    const [isHidden, setIsHidden] = useState(true);
    const pathname = usePathname();
    useEffect(()=> {
        if(!isHidden){
            setIsHidden(true);
        }
    }, [pathname]);
    return (<>
        <input 
            id={inputAttr.id}
            className={inputAttr.classes}
            type="checkbox"
            onChange={(e)=> setIsHidden(!isHidden)}
            checked={!isHidden}
        />
        <label 
            htmlFor={inputAttr.id}
            id={labelAttr.id}
            aria-controls={labelAttr.aria.controls}
            data-testid={labelAttr.testId}
            className={labelAttr.classes }>{labelAttr.content}</label>
        {hasSubpages && <ul className={listAttr.classes}  id={listAttr.id} data-testid={listAttr.testId} aria-hidden={isHidden} hidden={isHidden}>{children}</ul>}
    </>)
}
