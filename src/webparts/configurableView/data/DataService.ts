import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { isNullOrWhiteSpace } from "../Helper";
import { IListParams } from "./IListParam";
import { IItem, IItemImage, IResult } from "./IItem";
import { escape } from "@microsoft/sp-lodash-subset";
import { IFieldParams } from "./IFieldParams";
//import * as strings from "ConfigurableViewWebPartStrings";

//NONISV|CompanyName|AppName/Version
//const X_USERAGENT = 'NONISV|sgart.it|spfx.ConfigurableView/1';

const _httpOptionsGet: ISPHttpClientOptions = {
    headers: {
        'odata-version': '3.0',
        'accept': 'application/json;odata=nometadata',
    }
};

const STATIC_TEXT_PREFIX = '#';
const FIELD_TYPE_SEPARATOR = ':';
const SUBFIELD_SEPARATOR = '/';
const FORMAT_SEPARATOR = '|';
const ERROR_PREFIX = 'Custom error: ';

let _context: WebPartContext = undefined;
let _locale: string = 'en-US';
const _localeDateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
const _localeTimeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }; //, second: '2-digit' };
const _localeDateTimeOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }; //, second: '2-digit' };

export const initDataService = (context: WebPartContext): void => {
    _context = context;
    _locale = _context.pageContext.cultureInfo.currentCultureName;
};

const getWebRelativeUrl = (webRelativeUrl: string): string => {
    let url = webRelativeUrl;
    if (url === undefined || url === null || url === '')
        url = _context.pageContext.web.serverRelativeUrl;
    if (url === '/')
        return '';
    return url;
};

// name example: #StaticText, FiledName, FiledName/FieldName, FiledName:image, FiledName:date, FiledName/FieldName|http://www?q={{value}}
const getFieldParams = (item: object, name: string): IFieldParams | undefined => {
    if (undefined === name || null === name || name.length === 0) return undefined;

    let str: string = name;

    const p: IFieldParams = {
        name: str,
        subName: undefined,
        fieldType: undefined,
        value: undefined,
        formatValue: undefined
    };

    if (str[0] === STATIC_TEXT_PREFIX) {
        p.value = str.substring(1);
    } else {
        // format
        const iFormat = str.indexOf(FORMAT_SEPARATOR);
        if (iFormat >= 0) {
            p.formatValue = str.substring(iFormat + 1);
            str = str.substring(0, iFormat);
        }

        // type
        const iType = str.indexOf(FIELD_TYPE_SEPARATOR);
        if (iType > 0) {
            p.fieldType = str.substring(iType + 1).toLocaleLowerCase();
            str = str.substring(0, iType);
        }

        const iSubfield: number = p.name.indexOf(SUBFIELD_SEPARATOR);
        if (iSubfield > 0) {
            p.subName = str.substring(iSubfield + 1);
            p.name = str.substring(0, iSubfield);
            p.value = (item as any)[p.name][p.subName];
        } else {
            p.value = (item as any)[p.name];
        }
    }
    if (p === null) return undefined;
    return p;
};

const getString = (item: object, name: string): string | undefined => {
    try {
        const p = getFieldParams(item, name);
        if (undefined === p || null === p || undefined === p.value || null === p.value) return undefined;

        let value = null;
        switch (p.fieldType) {
            case 'html':
                value = p.value;
                break;
            case 'url':
                //value = p.value['Url'];
                value = p.value.Url;
                break;
            case 'description':
                //value = escape(p.value['Description']);
                value = escape(p.value.Description);
                break;
            case 'image':
                if (p.value[0] === '{') {
                    const j = JSON.parse(p.value);
                    value = j.serverRelativeUrl;
                } else {
                    value = p.value;
                }
                break;
            default:
                value = escape(p.value);
                break;
        }
        // /_layouts/15/userphoto.aspx?size=S&accountname=i:0#.f|membership|xxx@nnnn.onmicrosoft.com
        // /_layouts/15/userphoto.aspx?size=S&accountname={{value}}
        if (p.formatValue !== undefined && p.formatValue !== null) {
            return p.formatValue.replace(/\{\{value\}\}/gi, p.value);
        }
        return value;
    } catch (error) {
        console.error('getString', error);
        return undefined;
    }
};

const getImage = (item: object, name: string): IItemImage => {
    try {
        const value = getString(item, name);
        return {
            src: value,
            isIcon: undefined === value || null === value ? false : value.indexOf('/') === -1
        };
    } catch (error) {
        console.error('getImage', error);
        return {
            src: null,
            isIcon: false
        };
    }
};

const getDate = (item: object, name: string): string | undefined => {
    try {
        const p = getFieldParams(item, name);
        if (undefined === p || null === p || undefined === p.value || null === p.value) return undefined;

        if (p.name.length > 0 && p.name[0] === STATIC_TEXT_PREFIX)
            return p.value;

        //let fieldName = p.name;
        let format = '';

        const i = name.indexOf(':');
        if (i > 0) {
            //fieldName = name.substring(0, i);
            format = name.substring(i + 1).toLocaleLowerCase();
        }
        const value = p.value;

        if (undefined === value || null === value) return undefined;

        if (format === 'iso' || format === 'string')
            return value;

        const date = new Date(value);

        switch (format) {
            case 'date':
                return date.toLocaleString(_locale, _localeDateOptions);
            case 'time':
                return date.toLocaleString(_locale, _localeTimeOptions);
            default:
                return date.toLocaleString(_locale, _localeDateTimeOptions).replace(',', '');
        }
    } catch (error) {
        console.error('getDate', error);
        return undefined;
    }
};

const getBoolean = (item: object, name: string): boolean => {
    try {
        const p = getFieldParams(item, name);
        if (undefined === p || null === p || undefined === p.value || null === p.value) return null;

        return p.value === true || p.value === 'true';
    } catch (error) {
        console.error('getBoolean', error);
        return false;
    }
};

export async function loadList(params: IListParams): Promise<IResult> {
    const result: IResult = {
        success: false,
        items: [],
        responseJson: undefined,
        error: 'not initialized',
        url: undefined
    };

    try {
        const {
            webRelativeUrl, listName, filters, orderBy, top, fields
        } = params;

        const fieldsName = [
            fields.title,
            fields.description,
            fields.date,
            fields.user,
            fields.image,
            fields.url,
            fields.targetBlank,
            fields.inEvidence,
            fields.buttonText
        ];
        const validFields = fieldsName.filter(name => !isNullOrWhiteSpace(name) && name[0] !== STATIC_TEXT_PREFIX);

        let selectParams = '*';
        if (validFields.length > 0) {
            selectParams = 'Id,' + validFields
                .map(name => {
                    const iSep = name.indexOf(FIELD_TYPE_SEPARATOR);
                    const iFormat = name.indexOf(FORMAT_SEPARATOR);
                    let i = -1;
                    if (iSep >= 0)
                        i = iSep;
                    if (iFormat >= 0 && (i === -1 || iFormat < iSep))
                        i = iFormat;
                    if (i !== -1)
                        return name.substring(0, i);

                    else
                        return name;
                })
                .join(',');
        } else {
            fields.title = 'Title';
        }

        const expandFields: string[] = [];
        validFields.forEach(field => {
            if (isNullOrWhiteSpace(field) === false) {
                const i = field.indexOf(SUBFIELD_SEPARATOR);
                if (i > 0) {
                    expandFields.push(field.substring(0, i));
                }
            }
        });

        const relativeUrl = getWebRelativeUrl(webRelativeUrl);
        let urlPart: string = '';
        if (isNullOrWhiteSpace(listName)) {
            urlPart = 'web/webinfos';
        } else {
            const isUrl = listName.length > 1 && listName[0] === '/';
            if (isUrl) {
                const listNameLower = listName.toLowerCase();
                if (listNameLower === '/lists' || listNameLower === '/folders' || listNameLower === '/webinfos') {
                    urlPart = 'web/' + listNameLower;
                } else {
                    urlPart = `web/GetList('${relativeUrl}${listName}')/items`;
                }
            } else {
                //{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
                const isGuid = listName.length === 38 && listName[0] === '{' && listName[37] === '}';
                if (isGuid) {
                    urlPart = `web/lists(guid'${listName.substring(1, listName.length - 1)}')/items`;
                } else {
                    urlPart = `web/lists/GetByTitle('${listName}')/items`;
                }
            }
        }

        result.url = relativeUrl + '/_api/' + urlPart
            //+ (isGuid ? `(guid'${listName.substring(1, listName.length - 1)}')` : `/GetByTitle('${listName}')`)
            + `?$select=${selectParams}`
            + (expandFields.length === 0 ? '' : '&$expand=' + expandFields.join(','))
            + (isNullOrWhiteSpace(filters) ? '' : '&$filter=' + filters)
            + (isNullOrWhiteSpace(orderBy) ? '' : '&$orderby=' + orderBy)
            + '&$top=' + top;

        const response: SPHttpClientResponse = await _context.spHttpClient.get(result.url, SPHttpClient.configurations.v1, _httpOptionsGet);
        result.responseJson = await response.json();

        if (result.responseJson['odata.error'] !== undefined) {
            //result.error = ERROR_PREFIX + result.responseJson['odata.error']['message']['value'];
            result.error = ERROR_PREFIX + result.responseJson['odata.error'].message.value;
        } else {
            const spItems = result.responseJson.value;

            if (spItems === undefined) {
                result.error = `${ERROR_PREFIX}Response 'value' undefined, please check parameters and generated URL`;
            } else {
                result.items = spItems.map((item: any): IItem => {
                    const title = getString(item, fields.title);
                    return {
                        id: item.Id,
                        title: isNullOrWhiteSpace(title) || title === '-' ? '' : title,
                        description: getString(item, fields.description),
                        date: getDate(item, fields.date),
                        user: getString(item, fields.user),
                        image: getImage(item, fields.image),
                        url: getString(item, fields.url),
                        targetBlank: getBoolean(item, fields.targetBlank),
                        inEvidence: getBoolean(item, fields.inEvidence),
                        buttonText: getString(item, fields.buttonText)
                    };
                });

                result.success = true;
                result.error = undefined;
            }
        }

    } catch (error) {
        console.error(`${ERROR_PREFIX}DataService.loadList: ${params.listName}`, error);
        result.success = false;
        result.error = error;
    }
    return result;

}


