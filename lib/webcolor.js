/* global ENV_PROD */
var UIColor = require("UIKit/UIColor"),
    CGColorGetComponents = require("CoreGraphics").CGColorGetComponents,
    NSString = require("Foundation/NSString"),
    NSMakeRange = require("Foundation").NSMakeRange,
    NSLiteralSearch = require("Foundation").NSLiteralSearch,
    NSNotFound = require("Foundation").NSNotFound,
    colorLookup;

/*
 *	Constructor
 */
(function constructor() {
    colorLookup = generateColorLookup();
})();

/**
 Converts different webcolors into a `UIColor`
 @param colorName The webcolor e.g. #fff, white and rgba(255, 255, 255, 1.0)
 @return The color representated as a UIColor
 */
function webColorNamed(colorName) {
    if (!String(colorName)) {
        return UIColor.clearColor();
    }

    colorName = colorName.trim().toLowerCase();

    if (colorName.indexOf("#") == 0) {
        colorName = colorName.substring(1, colorName.length);
    }

    var result = colorLookup[colorName];

    if (result) {
        return result;
    }

    result = colorForHex(colorName);

    if (!result) {
        result = colorForRGBFunction(colorName);
    }

    if (result) {
        colorLookup[colorName] = result;
    } else {
        return UIColor.clearColor();
    }

    return result;
};

/**
 Converts a hex-color into a `UIColor`
 @param hexCode The hex-color e.g. `#fff` or `#ffffff`
 @return The color representated as a UIColor
 */
function colorForHex(hexCode) {
    // RegEx: http://stackoverflow.com/a/5624139/5537752
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexCode = hexCode.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);

    if (result) {
        return RGBACOLOR(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1);
    }

    Ti.API.warn("Hex color passed looks invalid: " + hexCode);
    return null;
};

/**
 Converts a rgba-color into a `UIColor`
 @param functionString The rgba-color e.g. `rgba(255, 255, 255, 1.0)``
 @return The color representated as a UIColor
 */
function colorForRGBFunction(functionString) {
    var res = functionString.split("rgba");

    if (!res || res.length != 2) {
        return null;
    } else {
        res = res[1];
    }

    res = res.split("(");
    if (!res || res.length != 2) {
        return null;
    } else {
        res = res[1];
    }

    res = res.split(")");
    if (!res || !res[0]) {
        return null;
    } else {
        res = res[0];
    }

    res = res.split(",");

    return RGBACOLOR(res[0] / 255, res[1] / 255, res[2] / 255, (res.length == 4 ? res[3] : 1.0));
};

/**
 Detects if the `UIColor` is dark or not
 @param color The color to validate
 @return `true` is the color is dark, `false` otherwise
 */
function isDarkColor(color) {
    var components = CGColorGetComponents(color.CGColor());
    var red = components[0];
    var green = components[1];
    var blue = components[2];

    return ((red * 299) + (green * 587) + (blue * 114) / 1000) < 125;
};

function generateColorLookup() {
    var white = UIColor.whiteColor();
    var black = UIColor.blackColor();

    return {
        "black": black,
        "gray": UIColor.grayColor(),
        "darkgray": UIColor.darkGrayColor(),
        "lightgray": UIColor.lightGrayColor(),
        "white": white,
        "red": UIColor.redColor(),
        "green": UIColor.greenColor(),
        "blue": UIColor.blueColor(),
        "cyan": UIColor.cyanColor(),
        "yellow": UIColor.yellowColor(),
        "magenta": UIColor.magentaColor(),
        "orange": UIColor.orangeColor(),
        "purple": UIColor.purpleColor(),
        "brown": UIColor.brownColor(),
        "transparent": UIColor.clearColor(),
        "stripped": UIColor.groupTableViewBackgroundColor(),
        "aqua": colorForHex("0ff"),
        "fuchsia": colorForHex("f0f"),
        "lime": colorForHex("0f0"),
        "maroon": colorForHex("800"),
        "pink": colorForHex("FFC0CB"),
        "navy": colorForHex("000080"),
        "silver": colorForHex("c0c0c0"),
        "olive": colorForHex("808000"),
        "teal": colorForHex("008080"),
        "fff": white,
        "ffff": white,
        "ffffff": white,
        "ffffffff": white,
        "000": black,
        "0000": black,
        "000000": black,
        "00000000": black,
    };
};

function RGBACOLOR(r, g, b, a) {
    return UIColor.colorWithRedGreenBlueAlpha(r, g, b, a);
}

/*
 *	Public API's
 */
exports.webColorNamed = webColorNamed;
exports.isDarkColor = isDarkColor;