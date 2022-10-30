import styles from "./components/ConfigurableView.module.scss";
import { ViewModel } from "./components/ViewModelEnum";

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
    switch (columns) {
        case 1: return styles.gridCol1;
        case 2: return styles.gridCol2;
        case 3: return styles.gridCol3;
        case 4: return styles.gridCol4;
        case 5: return styles.gridCol5;
        case 6: return styles.gridCol6;
        default: return styles.gridCol6 + ` _unknow--${columns}_`;
    }  
};

/**
 * 
 * @param columns return class name for view model
 * @returns 
 */
export const getClassViewModel = (name: ViewModel): string => {
    switch (name) {
        case ViewModel.Base: return styles.viewModelBase;
        case ViewModel.Button: return styles.viewModelButtonIcon;   // ??? serve una classe specifica ???
        case ViewModel.ButtonIcon: return styles.viewModelButtonIcon;
        case ViewModel.ImageFull: return styles.viewModelButtonImageFull;
        case ViewModel.ButtonMax: return styles.viewModelButtonMax;
        case ViewModel.ButtonMini: return styles.viewModelButtonMini;
        case ViewModel.Card: return styles.viewModelCard;
        case ViewModel.ListAlternate: return styles.viewModelListAlternate;
        case ViewModel.UserMini: return styles.viewModelUserMini;
        default: return styles.viewModelBase + ` _unknow--${name}_`;
    }  
};
