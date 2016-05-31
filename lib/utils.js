/* global ENV_PROD */
var WebColor = require("webcolor"),
    TiApp = require('Titanium/TiApp'),
    UIDevice = require("UIKit/UIDevice"),
    UIForceTouchCapabilityAvailable = require("UIKit").UIForceTouchCapabilityAvailable,
    NSDate = require("Foundation/NSDate"),
    NSDateFormatter = require("Foundation/NSDateFormatter"),
    NSTimeZone = require("Foundation/NSTimeZone"),
    NSLocale = require("Foundation/NSLocale"),
    NSNumericSearch = require("Foundation").NSNumericSearch,
    NSOrderedAscending = require("Foundation").NSOrderedAscending;

/**
 Converts date to UTC format.
 @param date The input date.
 @return The date string in UTC format.
 */
function UTCDateForDate(date, locale) {

    // TODO: Use ENSURE_TYPE(date, NSDate)
    if (!date.isKindOfClass(NSDate.class())) {
        Ti.API.error("The 'data' argument needs to be a NSDate");
        return;
    }

    return _getDateFormatterWithLocale(locale).stringFromDate(date);
}

/**
 Converts string in UTC format into a date.
 @param date The date string in UTC format.
 @return The converted date.
 */
function dateForUTCDate(date, locale) {

    // TODO: Use ENSURE_TYPE(date, String)
    if (!String(date)) {
        Ti.API.error("The 'data' argument needs to be a String");
        return;
    }

    return _getDateFormatterWithLocale(locale).dateFromString(date);
}

/**
 Returns current date in UTC format.
 @return The date string in UTC format.
 */
function UTCDate() {
    return UTCDateForDate(NSDate.date());
}

/**
 Converts different webcolor formats to a native `UIColor`
 @param value The webcolor e.g. #fff, white and rgba(255, 255, 255, 1.0)
 @return The color representated as a UIColor
 */
function colorValue(value) {
    return WebColor.webColorNamed(value);
}

/**
 Whether or not the current OS version is equal to or greater than 7.0.
 @return `true` if the current OS version is equal to or greater than 7.0, `false` otherwise.
 */
function isIOS7OrGreater() {
    return isiOSGreaterOrEqualTo("7.0");
}

/**
 Whether or not the current OS version is equal to or greater than 8.0.
 @return `true` if the current OS version is equal to or greater than 8.0, `false` otherwise.
 */
function isIOS8OrGreater() {
    return isiOSGreaterOrEqualTo("8.0");
}

/**
 Whether or not the current OS version is equal to or greater than 9.0.
 @return `true` if the current OS version is equal to or greater than 9.0, `false` otherwise.
 */
function isIOS9OrGreater() {
    return isiOSGreaterOrEqualTo("9.0");
}

/**
 Whether or not the current OS version is equal to or greater than 10.0.
 @return `true` if the current OS version is equal to or greater than 10.0, `false` otherwise.
 */
function isIOSXOrGreater() {
    return isiOSGreaterOrEqualTo("10.0");
}

/**
 Whether or not the current OS version is equal to or greater than the input
 @param version The iOS version to validate
 @return `true` if the current OS version is equal to or greater than the input, `false` otherwise.
 */
function isiOSGreaterOrEqualTo(version) {
    return UIDevice.currentDevice().systemVersion.compareOptions(version, NSNumericSearch) != NSOrderedAscending;
}

/**
 Checks the force touch capability of the current device.
 @return `true` if the device supports force touch, `false`.
 */
function isForceTouchSupported() {
    if (!isIOS9OrGreater())  {
        return false;
    }

    return TiApp.app().window.traitCollection.forceTouchCapability == UIForceTouchCapabilityAvailable;
}

function _getDateFormatterWithLocale(locale) {
    var dateFormatter = new NSDateFormatter();
    var timezone = NSTimeZone.timeZoneWithName("UTC");

    dateFormatter.setTimeZone(timezone);
    dateFormatter.setLocale(NSLocale.alloc().initWithLocaleIdentifier(locale || "en_US"));
    dateFormatter.setDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'SSS+0000");

    return dateFormatter;
}

/**
 Converts a given String into a slug without special characters
 Credit: http://stackoverflow.com/a/5782563/5537752
 @param {String} str The string to slugify
 @return The slugified String
 */
function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, '');
	// trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
	var to = "aaaaaeeeeeiiiiooooouuuunc------";
	for (var i = 0,
	    l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '')// remove invalid chars
	.replace(/\s+/g, '-')// collapse whitespace and replace by -
	.replace(/-+/g, '-');
	// collapse dashes

	return str;
}; 

/**
 Converts degrees to radians.
 @param {Number} degrees The numer of degrees.
 @return The converted number of radians.
 */
function DEGREES_TO_RADIANS(degrees) {
	return (Number(degrees) / 180.0 * Math.PI);
};

/*
 *	Public API's
 */
exports.UTCDateForDate = UTCDateForDate;
exports.dateForUTCDate = dateForUTCDate;
exports.UTCDate = UTCDate;
exports.colorValue = colorValue;
exports.isIOS7OrGreater = isIOS7OrGreater;
exports.isIOS8OrGreater = isIOS8OrGreater;
exports.isIOS9OrGreater = isIOS9OrGreater;
exports.isIOSXOrGreater = isIOSXOrGreater;
exports.isiOSGreaterOrEqualTo = isiOSGreaterOrEqualTo;
exports.DEGREES_TO_RADIANS = DEGREES_TO_RADIANS;
exports.slugify = slugify;