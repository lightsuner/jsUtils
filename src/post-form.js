define([
  "./core"
], function(jsUtils) {
  'use strict';

  /**
   * Emulate browser's post request with redirect to passed uri
   *
   * @param uri
   * @param data hash
   */
  jsUtils.prototype.postForm = function (uri, data) {
    uri || (uri = '');
    data || (data = {});
    var method = 'post',
      form = document.createElement("form");


    form.setAttribute("method", method);
    form.setAttribute("action", uri);
    form.style.display = 'none';

    generateHiddenElements(form, '', data);

    document.body.appendChild(form);
    form.submit();


  };

  function generateHiddenElements(form, parentName, value) {
    // if value is not scalar - run function recursively
    if (value instanceof Object) {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          var nextName = key;
          if (parentName) {
            nextName = parentName + '[' + nextName + ']';
          }
          generateHiddenElements(form, nextName, value[key]);
        }
      }
      return;
    }

    // else create hidden element
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", parentName);
    hiddenField.setAttribute("value", value);

    form.appendChild(hiddenField);
  }

  return jsUtils;

});