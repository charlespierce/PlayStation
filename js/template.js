'use strict';
var PS = PS || {};

PS.getValueFromObject = function (obj, param) {
    if (obj && param) {
        var value = obj[param];
        if (typeof value === 'function') {
            value = value.call(obj);
        }
        if (value && value.replace) {
            value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
        return value;
    }
    return null;
};

PS.fillTemplate = function (obj, template) {
    if (obj && template) {
        return template.replace(/{{(.*?)}}/g, function (match, p1) {
            return PS.getValueFromObject(obj, p1);
        });
    }
    return null;
};
