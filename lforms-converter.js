/**
 *
 * Uses a json streaming parser (oboe) to fetch and transform the input from
 * a specified source.
 */
'use strict';

/**
 *
 * Class definition
 */

var   LFormsConverter = function() {};

_.extend(LFormsConverter.prototype, {

  /**
   *  API to initiate the parsing
   *
   *  @param {String} inputSource - The URL for obtaining the CDE-style form definition which is to
   *  be translated into an LForms form definition.
   *  @param {function} successCallback - Handler to capture converted object.
   *  @param {function} failCallback - Error handler.
   *  @param {Object}  additionalFields - Optionals fields to add or override to the converted form.
   */
  convert: function(inputSource, successCallback, failCallback, additionalFields) {
    var self = this;

    // Called when the oboe parsing is successful
    function success(json) {
      // Do final adjustments to the structure.
      json.code = json._id;
      json.type = 'CDE';
      delete json.stewardOrg;
      json.template = '';
      renameKey(json, 'naming', 'name');
      renameKey(json, 'formElements', 'items');
      // Convert skip logic.
      doSkipLogic(json);
      // Remove any undefined
      removeArrayElements(json, undefined);
      addAdditionalFields(json, additionalFields);
      successCallback(json);
      parser.removeListener('done', success);
      parser.removeListener('fail', failed);
    }

    // Called when the oboe parsing fails
    function failed(errorReport) {
      // Something is wrong. Abort further parsing and throw the error
      errorReport.statusCode = errorReport.statusCode ? errorReport.statusCode :
                               (errorReport.thrown ? errorReport.thrown.statusCode : 500);
      errorReport.body = errorReport.body || (errorReport.thrown ?
        errorReport.thrown.message : undefined);
      parser.abort();
      if(failCallback) {
        failCallback(errorReport);
      }
      parser.removeListener('done', success);
      parser.removeListener('fail', failed);
    }

    // Setup handlers based on json path expressions.
    var parser = oboe(inputSource)
      .node({
        'noRenderAllowed': this.handleNoRenderAllowed.bind(this),
        'formElements.*': this.handleFormElement.bind(this),
        'naming': this.handleNaming.bind(this),
        'answers.*': this.handleAnswers.bind(this),
        'uoms.*': this.handleUnits.bind(this),
        // List out ignorables
        '__v': oboe.drop,
        'attachments': oboe.drop,
        'classification': oboe.drop,
        'comments': oboe.drop,
        'created': oboe.drop,
        'createdBy': oboe.drop,
        'hideLabel': oboe.drop,
        'history': oboe.drop,
        'isCopyrighted': oboe.drop,
        'properties': oboe.drop,
        'referenceDocuments': oboe.drop,
        'registrationState': oboe.drop
      })
      .done(success)
      .fail(failed);
  },


  /**
   ************************************************************************
   ************ Oboe Node Handlers ****************************************
   ************************************************************************
   * All handlers have the following signature.
   * @param: param Object representing node resulting from jsonpath expression.
   * Any modification to param reflects in the output json.
   *
   * @param path: Array of path elements to this param.
   *
   * @return: Any return value replaces param in the result json tree.
   ************************************************************************
   */

  /**
   * Look for noRenderAllowed flag. If present throw forbidden error.
   *
   * Some of the CDE forms are not allowed to render for reasons such as
   * copyrights issues.
   *
   * CDE web interface generally avoids sending the traffic for these forms.
   * However somebody could still use the id of such forms to render them,
   * hence the check here.
   *
   * @param {boolean} param - noRenderAllowed
   * @param {Array} path - path of param
   *
   */
  handleNoRenderAllowed: function(param, path) {
    if(param) {
      var err = new Error('Form not allowed to render');
      err.statusCode = 403;
      delete err.stack; // Suppress error stack
      throw err;
    }
  },


  /**
   * Handle form name
   * @param {Object} param - naming
   * @param {Array} path - path of param
   */
  handleNaming: function(param, path) {
    if(param && param.length > 0) {
      return param[0].designation;
    }
    else {
      return oboe.drop();
    }
  },


  /**
   * formElement => item
   * @param param {Object} param - formElements.*
   * @param path {Array} path - path of param
   */
  handleFormElement: function(param, path) {
    try {
      // Makeup a code
      var code = createQuestionCode(param);
      if (code === null) {
        // Can't create code if the element does not meet minimum requirements.
        return oboe.drop();
      }

      param.questionCode = code.questionCode;
      param.questionCodeSystem = code.questionCodeSystem;
      // cde question is different than item.question.
      var q = param.question;
      // cde label is item.question
      param.question = param.label;
      delete param.label;

      // cde element type determines item.header
      param.header = param.elementType === 'section' || param.elementType === 'form';
      delete param.elementType;

      // Map datatype
      param.dataType = createDataType(q);
      // Move all answerlists to its own hash
      if (q) {
        if (q.answers && q.answers.length > 0) {
          param.answers = q.answers;
        }
        // Handle units
        if (q.uoms && q.uoms.length > 0) {
          param.units = q.uoms;
          // Make first unit the default.
          param.units[0].default = true;
        }

        // Handle answerCardinality/required flag
        param.answerCardinality = createAnswerCardinality(q);

        // Handle restrictions/datatypeNumber
        if(q.datatypeNumber) {
          param.restrictions = createRestrictions(q.datatypeNumber);
        }
      }

      // Handle instructions
      renameKey(param, 'instructions', 'codingInstructions');

      if(param.codingInstructions) {
        param.codingInstructions = param.codingInstructions.value;
        if(param.codingInstructions.valueFormat) {
          param.codingInstructionsFormat = param.codingInstructions.valueFormat;
        }
      }

      // Content of param are already changed. Change the key names if any
      renameKey(param, 'cardinality', 'questionCardinality');
      renameKey(param, 'formElements', 'items');

      return param;
    }
    catch(err) {
      err.param = JSON.stringify(param, null, '  ');
      err.path = path;
      throw err;
    }
  },


  /**
   * Units
   *
   * @param {Object} param - uoms.*
   * @param {Array} path - path of param
   */
  handleUnits: function(param, path) {
    var ret = {};
    ret.name = param;
    return ret;
  },


  /**
   * Handle answerlist
   *
   * @param {Object} param - answers.*
   * @param {Array} path - path of param
   */
  handleAnswers: function(param, path) {
    renameKey(param, 'permissibleValue', 'code');
    renameKey(param, 'valueMeaningName', 'text');
    return param;
  }

});

/**
 ****************************************************************************
 * Some utility functions
 ****************************************************************************
 */


/**
 * Add or overwrite optional form fields.
 *
 * @param json - Parsed lforms object
 * @param options {Object}
 */
function addAdditionalFields(json, options) {
  if(options) {
    Object.keys(options).forEach(function(k) {
      json[k] = options[k];
    });
  }
}


/**
 * @param {Object} obj - Object whose keys are renamed.
 * @param {String} oldkey
 * @param {String} newkey
 * @returns none
 */
function  renameKey(obj, oldkey, newkey) {
  if(obj.hasOwnProperty(oldkey)) {
    obj[newkey] = obj[oldkey];
    delete obj[oldkey];
  }
}


/**
 * Create restrictions array.
 *   For now, we know only number restrictions.
 * @param datatypeNumber - Object from cde
 * @returns {Array} - LForms array of restriction objects.
 *   Returns null if input doesn't exists.
 */
function createRestrictions(datatypeNumber) {
  var ret = null;
  if(datatypeNumber) {
    ret = [];
    if(typeof datatypeNumber.minValue !== 'undefined') {
      ret.push({
        name: 'minInclusive',
        value: datatypeNumber.minValue
      });
    }

    if(typeof datatypeNumber.maxValue !== 'undefined') {
      ret.push({
        name: 'maxInclusive',
        value: datatypeNumber.maxValue
      });
    }
  }

  return ret;
}


/**
 * Create answer cardinality based on required flag.
 *
 * @param {object} q A hash from the CDE format, containing keys for "required"
 *  (a boolean) and "multiselect" (another boolean).
 * @returns {object} lforms answerCardinality object.
 *   Returns null if input doesn't exist.
 */
function createAnswerCardinality(q) {
  return {
    min: q.required ? "1": "0",
    max: q.multiselect ? "*" : "1"
  };
}


/**
 * Use tinyId for question code. Section headers do not have
 * an id.
 *
 * @param {Object} param - formElement
 */
function createQuestionCode(param) {
  var ret = {};
  if(param.elementType === 'section' || param.elementType === 'form') {
    // No id for headers. Make up something.
    ret.questionCodeSystem = null;
    ret.questionCode = param.label.replace(/\s/g, '_');
  }
  else if (param.elementType === 'question') {
    var idList = param.question.cde.ids;
    for(var i = 0; idList && i < idList.length; i++) {
      if(idList[i].source === "LOINC") {
        ret.questionCodeSystem = idList[i].source;
        ret.questionCode = idList[i].id;
        break;
      }
    }

    if(!ret.questionCode) {
      ret.questionCodeSystem = null;
      ret.questionCode = param.question.cde.tinyId;
    }
  }
  else {
    ret = null;
  }
  return ret;
}


/**
 * Convert known data types
 * @param {Object} question - formElement.question
 */
function createDataType(question) {
  var ret = 'ST';
  if(question && question.datatype) {
    switch(question.datatype.toLowerCase()) {
      case 'character':
        ret = 'ST';
        break;
      case 'value list':
        ret = 'CNE';
        break;
      case 'integer':
        ret = 'INT';
        break;
      case 'number':
        ret = 'REAL';
        break;
      case 'float':
        ret = 'REAL';
        break;
      case 'date':
        ret = 'DT';
        break;
      default:
        ret = 'ST';
        break;
    }
  }
  return ret;
}


/**
 * Convert skip logic object to our format.
 *
 * @param {Object} root - The object returned after 'oboe' parsing.
 * @returns {undefined}
 */
function doSkipLogic(root) {

  traverseItems(root, function(item, ancestors) {
    if(item.skipLogic) {
      // This is target item. Parse 'condition' to look for source item
      var tokens = item.skipLogic.condition.split('=');
      tokens = _.each(tokens, function(a, ind, arr) {
        arr[ind] = a.replace(/^[\s\"]*|[\s\"]*$/g, '');
      });
      var text = tokens[0];
      var value = tokens[1];

      traverseItemsUpside(item, function(sourceItem) {
        var stopLooking = false;
        if(sourceItem.question === text) {
          item.skipLogic = createSkipLogic(value, sourceItem);
          stopLooking = true;
        }
        return stopLooking;
      }, ancestors);

    }

    return false; // Continue traversal for all skipLogic nodes
  }, []);
}


/**
 * Create skipLogic object based on datatype.
 *
 * @param {String|Number|Date|Object} value - Type depends on the dataType
 * @param {Object} sourceItem - Source of skip logic to get data type and code.
 * @returns {Object} Skip logic object
 */
function createSkipLogic(value, sourceItem) {
  // Build skip logic object
  var ret = {action: 'show', conditions: [{source: sourceItem.questionCode, trigger: {} }]};

  switch(sourceItem.dataType) {
    case 'CWE':
    case 'CNE':
      ret.conditions[0].trigger.text = value;
      break;
    case 'REAL':
      ret.conditions[0].trigger.value = parseFloat(value);
      break;
    case 'DT':
      ret.conditions[0].trigger.value = value.toString();
      break;
    default:
      ret.conditions[0].trigger.value = value;
  }

  return ret;
}


/**
 * Utility to remove any array elements, traversing in a tree.
 *
 * Mainly intended to remove undefined in arrays generated out of oboe.drop during its
 * parsing. See http://oboejs.com/api#dropping-nodes on why it does that. This is
 * a change from version 2.0.2 to 2.1.2.
 *
 * @param {Object} obj - Tree from which to weed out the 'elem'
 * @param elem -
 */
function removeArrayElements(obj, elem) {
  traverse(obj).forEach(function(x) {
    if(x instanceof Array) {
      _.remove(x, function(n) {
        if(n === elem) {
          return true;
        }
//        return n === elem;
      });
    }
  });
}


/**
 * Utility to check url for oboe. Oboe supports only http and https urls.
 *
 * @param aUrl {String}
 * @returns {boolean}
 */
function isHttpUrl(aUrl) {
  var ret = true;
  if (aUrl.search(/https?:\/\//) !== 0) {
    ret = false;
  }

  return ret;
}


/**
 * A pre-order traversing for item (equivalent to node of tree) of lforms definition.
 * @param {Object} item - LForms item node
 * @callback visitCallback
 *   Call back method after visiting the node with following arguments
 *     @param {Object} visited item
 *     @param {Array} Array of ancestor objects.
 *     @return {boolean} true if want to stop further traversal.
 *   Ancestor definition: {parent: parentItem, index: indexOfThisItem}
 *     where parentItem is an item defined in lforms definition and
 *     indexOfThisItem is this item's zero based index among its siblings.
 */
function traverseItems(item, visitCallback, ancestors) {
  var ancestors = ancestors || [];
  var stop = visitCallback(item, ancestors);
  if(stop !== true && item.items && item.items.length > 0) {
    item.items.forEach(function(subItem, ind) {
      ancestors.push({parent: item, thisIndex: ind});
      traverseItems(subItem, visitCallback, ancestors);
      ancestors.pop();
    });
  }
}

/**
 * Traverse from node in a tree towards ancestral nodes with the following order.
 * The traversal continues, until callback returns true to stop.
 *
 * . Visit the starting node.
 * . Visit the previous siblings of the starting node, closest to farthest.
 * . Visit next siblings of starting node, closest to farthest.
 * . Visit parent node and repeat the above order.
 * . Repeat the above order until reaching root.
 *
 * This is intended to reach source item from target item in lforms definition.
 *
 * @param {Object} startingItem - Starting item node to start the backward traversal.
 * @callback visitCallback
 *   Call back method after visiting the node with following arguments
 *     @param {Object} visited item
 *     Ancestor definition: {parent: parentItem, index: arrayIndexOfparentItem}
 *     @return {boolean} Return true to stop further traversal.
 * @param {Array} ancestorsPath - Array of ancestors
 *   Ancestor definition: {parent: parentItem, index: arrayIndexOfparentItem}
 *     where parentItem is an item defined in lforms definition
 */
function traverseItemsUpside(startingItem, visitCallback, ancestorsPath) {
  var stop = visitCallback(startingItem);
  var ancestors = ancestorsPath.slice();
  var prevAncestor = ancestors.pop();
  if(stop !== true && prevAncestor) {
    var parent = prevAncestor.parent;
    var index = prevAncestor.thisIndex;

    // Go through siblings first
    if(!parent.items) {
      throw new TypeError('Invalid ancestral path');
    }

    if(typeof(index) !== 'undefined' && index > 0) { // Root exception
      parent.items.slice(0, index).reverse().some(function(sibling) {
        stop = visitCallback(sibling);
        return stop;
      });

      if(!stop) {
        parent.items.slice(index+1).some(function(sibling) {
          stop = visitCallback(sibling);
          return stop;
        });
      }
    }

    if(!stop) {
      // Recurse through ancestors
      traverseItemsUpside(parent, visitCallback, ancestors);
    }
  }
}
