# Change Log

This log documents the significant changes for each release.
This project follows [Semantic Versioning](http://semver.org/).

## [3.3.0] - 2017-05-22
### Changed
- Instead of overwriting, the caller supplied additionalFields argument to convert() is deep-merged into lforms output.

## [3.2.1] - 2017-05-01
### Fixed
- Convert default answer in conformance to lforms 11.2.1.

## [3.2.0] - 2017-03-06
### Added
- Added functionality to parse default answer from CDE forms.

## [3.1.0] - 2017-02-22
### Added
- Changed default answer layout from pull down list to two column radio or checkboxes.

## [3.0.0] - 2016-12-09
### Added
- Added functionality to parse boolean expressions in skip logic condition from CDE forms
- Added LForms name space to the converter.

## [2.3.1] - 2016-11-21
### Fixed
- Fixed empty skip logic condition problem.

## [2.3.0] - 2016-09-15
### Added
- Support for display of answer list items in a matrix of radio/checkbox controls.

### Changed
- This also changes the lforms display by putting labels on top of input boxes.

## [2.2.0] - 2016-09-14
### Added
- Support for multi-valued fields
- Support for the CDE format's nested forms

