# Imports for the Datenanfragen.de company database

> Quick-and-dirty scripts to import existing datasets or scrape records from websites for the Datenanfragen.de company database.

The Datenanfragen.de [company database](https://www.datarequests.org/company/) is a CC0-licensed collection of contact information for privacy-related requests to companies and other organizations under the scope of the GDPR ([repo here](https://github.com/datenanfragen/data/)). In addition to the manually collected and verified records, we also import existing datasets and scrape websites.  
The scripts to prepare this data for the company database schema are in this repo.

Note that these scripts are not exactly clean. That's fine as they are only intended to be run once.

## Imported data sources

### German churches

We want to support the German churches on Datenanfragen.de. See [datenanfragen/data#579](https://github.com/datenanfragen/data/issues/579) for details. So far, we have scripts for the following datasets:

### Protestant church

* Evangelisch-lutherische Landeskirche in Braunschweig ([source](https://www.landeskirche-braunschweig.de/gemeinden/propsteien/))

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.

We warmly welcome issues and pull requests through GitHub. As mentioned before, these scripts are only run once. Thus, it doesn't really make sense to edit scripts once their respective data has been imported. This of course doesn't apply if you have found an error in a script that causes the generated records to contain wrong information.  
We are very grateful for new scripts to import data from new sources. Please note that we can only import data that we can publish under a CC0 license.

Please be aware that by contributing, you agree for your work to be released under a Creative Commons CC0 1.0 Universal license, as specified in the `LICENSE` file.

If you are interested in contributing to the Datenanfragen.de project in other ways, have a look at our [contribute page](https://www.datarequests.org/contribute) for more details.
