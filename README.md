This is a small JavaScript library that can be used with the
[LForms](https://lhncbc.nlm.nih.gov/project/lforms) form rendering widget to
allow it to display forms from the [National Institutes of
Health](https://www.nih.gov) (NIH) [Common Data Elements
(CDE)](https://www.nlm.nih.gov/cde/) Initiative.  The input format is a
[JSON](http://json.org)-based form definition from the [NIH CDE
Repository](https://cde.nlm.nih.gov/), and the output is the LForms-style form
definition which can be given to LForms.

## Installation
This package installs using the [bower](http://bower.io) package manager.

    bower install lforms-converter  

## Usage
The following example assumes you have also installed
[LForms](https://github.com/lhncbc/lforms).

```JavaScript
var converter = new LFormsConverter();

converter.convert(urlToCDEForm,
  function(lfData) {
    scope.lfData = new LFormsData(lfData);
    scope.$apply(scope.lfData);
  },
  function(err) {
    scope.error = err;
  }
);
```

In the call to the convert function, the first argument is a URL for obtaining
the CDE form definition which is to be converted to the LForms format.  These
URLs are in the form:

    https://cde.nlm.nih.gov/form/[tinyId]

where [tinyId] is replaced by the tinyId attribute of the form.  You can see
tinyIds in the URLs of [forms](https://cde.nlm.nih.gov/form/search) in the NIH
CDE Repository.

The second argument is a callback with the translated form definition for
LForms.  The example shows that if you are using this with LForms, you would
then constuct an LFormsData object from the form definition and assign it to the
(AngularJS) scope's lfData variable, and then tell AngularJS to notice the
change.

The final argument is a callback used in case of an error ocurring.  Its
argument is an object with the following fields (as documented in
[oboe](http://oboejs.com/api#fail-event)):

* thrown -  if an error was thrown, this will contain that
* statusCode - the status code, if the request got that far
* body - the response body for the error, if any
* jsonBody - if the server’s error response was JSON, the parsed body

## License
See [LICENSE.md](LICENSE.md).
