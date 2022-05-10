export interface IFieldParams {
    name: string;
    subName: string;
    // FieldName:html, FieldName:url, FieldName:description, FieldName:image
    fieldType: string;
    value: any;
    
    // replace placeholder {{value}} with field value
    // es. /_layouts/15/userphoto.aspx?size=S&accountname=i:0#.f|membership|albertob@sgart.onmicrosoft.com
    // es. Author/Name|/_layouts/15/userphoto.aspx?size=S&accountname={{value}}
    formatValue: string;
}
