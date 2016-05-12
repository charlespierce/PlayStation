'use strict';
var PS = PS || {};

// Get the value of parameter 'param' off of obj. If that is actually a method, instead call that method
// If the resultant value is a string, HTML encode it so that it doesn't wind up generating actual HTML
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

// Replace all {{param}} blocks in the template string with the actual value of obj.param
PS.fillTemplate = function (obj, template) {
    if (obj && template) {
        return template.replace(/{{(.*?)}}/g, function (match, p1) {
            return PS.getValueFromObject(obj, p1);
        });
    }
    return null;
};
