import INavigationItem from '@/app/models/INavigationItem';
export default function NavigationItem({ attrs, children, hasSubpages }: INavigationItem) {
    const { inputAttr, labelAttr, listAttr } = attrs;
    return (<>
        <input 
            id={inputAttr.id}
            className={inputAttr.classes}
            type="checkbox"
        />
        <label 
            htmlFor={inputAttr.id}
            id={labelAttr.id}
            aria-controls={labelAttr.aria.controls}
            data-testid={labelAttr.testId}
            className={labelAttr.classes }>{labelAttr.content}</label>
        {hasSubpages && <ul className={listAttr.classes}  id={listAttr.id} data-testid={listAttr.testId}>{children}</ul>}
    </>)
}
