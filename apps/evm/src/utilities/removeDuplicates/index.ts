const removeDuplicates = <TItem extends string | number>(items: TItem[]) => [...new Set(items)];
export default removeDuplicates;
