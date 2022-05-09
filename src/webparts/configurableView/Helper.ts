import styles from "./components/ConfigurableView.module.scss";

export const isNullOrWhiteSpace = (str: string): boolean => {
    if (undefined === str || null === str) return true;
    //if ('string' !== typeof str) throw 'Invalid type';
    if ((/^\s*$/g).test(str)) return true;
    return false;
};

/**
 * return class name for col responsive
 * @param columns 
 * @returns 
 */
export const getClassNameCol = (columns: number): string => {
    if( columns>=1 && columns <= 5)
        return styles[`gridCol${columns}`];
    return styles.gridCol6;
};