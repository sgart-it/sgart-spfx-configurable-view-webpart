import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { isNullOrWhiteSpace } from "../Helper";
import { IListParams } from "./IListParam";
import { IItem, IItemImage, IResult } from "./IItem";
import { escape } from "@microsoft/sp-lodash-subset";
import { IFieldParams } from "./IFieldParams";

//NONISV|CompanyName|AppName/Version
//const X_USERAGENT = 'NONISV|sgart.it|spfx.ConfigurableView/1';

const _httpOptionsGet: ISPHttpClientOptions = {
    headers: {
        'odata-version': '3.0',
        'accept': 'application/json;odata=nometadata',
    }
};

const STATIC_TEXT_PREFIX = '#';
const FORMAT_SEPARATOR = ':';
const SUBFIELD_SEPARATOR = '/';
const ERROR_PREFIX = 'Custom error: ';

let _context: WebPartContext = null;
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
    if (url == null || url === '')
        url = _context.pageContext.web.serverRelativeUrl;
    if (url === '/')
        return '';
    return url;
};

export const loadList = async (params: IListParams): Promise<IResult> => {
    const result: IResult = {
        success: false,
        items: [],
        responseJson: null,
        error: 'not initialized',
        url: null
    };

    try {
        const {
            webRelativeUrl,
            listName,
            filters,
            orderBy,
            top,
            fields
        } = params;

        const fieldsName = [
            fields.title,
            fields.description,
            fields.date,
            fields.user,
            fields.image,
            fields.url,
            fields.targetBlank,
            fields.inEvidence
        ];
        const validFields = fieldsName.filter(name => !isNullOrWhiteSpace(name) && name[0] !== STATIC_TEXT_PREFIX);

        let selectParams = '*';
        if (validFields.length > 0) {
            selectParams = 'Id,' + validFields
                .map(name => {
                    const i = name.indexOf(FORMAT_SEPARATOR);
                    if (i !== -1)
                        return name.substring(0, i);
                    else
                        return name;
                })
                .join(',');
        } else {
            fields.title = 'Title';
        }

        const expandFields = [];
        validFields.forEach(field => {
            if (isNullOrWhiteSpace(field) === false) {
                const i = field.indexOf(SUBFIELD_SEPARATOR);
                if (i > 0) {
                    expandFields.push(field.substring(0, i));
                }
            }
        });

        const relativeUrl = getWebRelativeUrl(webRelativeUrl);
        let urlPart = '';
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
                const isGuid = listName.length == 38 && listName[0] === '{' && listName[37] === '}';
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
            + '&$top=' + top
            ;

        const response: SPHttpClientResponse = await _context.spHttpClient.get(result.url, SPHttpClient.configurations.v1, _httpOptionsGet);
        result.responseJson = await response.json();

        if (result.responseJson['odata.error'] !== undefined) {
            result.error = ERROR_PREFIX + result.responseJson['odata.error']['message']['value'];
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
                        inEvidence: getBoolean(item, fields.inEvidence)
                    };
                });

                result.success = true;
                result.error = null;
            }
        }

    } catch (error) {
        console.error(`${ERROR_PREFIX}DataService.loadList: ${params.listName}`, error);
        result.success = false;
        result.error = error;
    }
    return result;

};

const getFieldParams = (item: object, name: string): IFieldParams => {
    if (undefined === name || null === name || name.length === 0) return null;

    const p: IFieldParams = {
        name: name,
        subName: null,
        format: '',
        value: null
    };

    if (p.name[0] === STATIC_TEXT_PREFIX) {
        p.value = name.substring(1);
    } else {

        const i1 = p.name.indexOf(FORMAT_SEPARATOR);
        if (i1 > 0) {
            p.name = p.name.substring(0, i1);
            p.format = name.substring(i1 + 1).toLocaleLowerCase();
        }

        const i2 = p.name.indexOf(SUBFIELD_SEPARATOR);
        if (i2 > 0) {
            p.subName = p.name.substring(i2 + 1);
            p.name = p.name.substring(0, i2);
            p.value = item[p.name][p.subName];
        } else {
            p.value = item[p.name];
        }
    }
    return p;
};

const getString = (item: object, name: string): string | null => {
    try {
        const p = getFieldParams(item, name);
        if (null === p || undefined === p.value || null === p.value) return null;

        switch (p.format) {
            case 'html':
                return p.value;
            case 'url':
                return p.value['Url'];
            case 'description':
                return escape(p.value['Description']);
            case 'image':
                if (p.value[0] === '{') {
                    var j = JSON.parse(p.value);
                    return j.serverRelativeUrl;
                }
                return p.value;
            default:
                return escape(p.value);
        }
    } catch (error) {
        console.error('getString', error);
        return null;
    }
};

const getImage = (item: object, name: string): IItemImage => {
    try {
        const value = getString(item, name);
        return {
            src: value,
            isIcon: value === null ? false : value.indexOf('/') === -1
        };
    } catch (error) {
        console.error('getImage', error);
        return {
            src: null,
            isIcon: false
        };
    }
};

const getDate = (item: object, name: string): string | null => {
    try {
        const p = getFieldParams(item, name);
        if (null === p || undefined === p.value || null === p.value) return null;

        if (p.name.length > 0 && p.name[0] === STATIC_TEXT_PREFIX)
            return p.value;

        let fieldName = p.name;
        let format = '';

        const i = name.indexOf(':');
        if (i > 0) {
            fieldName = name.substring(0, i);
            format = name.substring(i + 1).toLocaleLowerCase();
        }
        const value = p.value;

        if (undefined === value || null === value) return null;

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
        return null;
    }
};

const getBoolean = (item: object, name: string): boolean => {
    try {
        const p = getFieldParams(item, name);
        if (null === p || undefined === p.value || null === p.value) return null;

        return p.value === true || p.value === 'true';
    } catch (error) {
        console.error('getBoolean', error);
        return false;
    }
};