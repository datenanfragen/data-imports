const findPhoneNumbersInText = require('libphonenumber-js/max').findPhoneNumbersInText;

function formatFirstPhoneNumberInText(phone_number_string, country) {
    if (!phone_number_string) return undefined;
    try {
        const found_numbers = findPhoneNumbersInText(phone_number_string, (country || '').toUpperCase());
        if (!found_numbers || found_numbers.length < 1) return undefined;
        return found_numbers[0].number.formatInternational();
    } catch (_) {
        return undefined;
    }
}

module.exports = { formatFirstPhoneNumberInText };
