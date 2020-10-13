function cleanUpRecord(record) {
    // Adapted after: https://github.com/datenanfragen/company-json-generator/blob/ad600d72b01d1e9d3cd47dcacefeddfea7cdd7cc/src/app.js#L175-L180
    Object.keys(record).forEach((key) => {
        if (typeof record[key] === 'string') record[key] = record[key].trim();
        if (record[key] === undefined || record[key].length === 0) delete record[key];
    });
    if (record.address) {
        record.address = record.address
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => !!l)
            .join('\n');
    }
    return record;
}

module.exports = { cleanUpRecord };
