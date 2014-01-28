var isValid = true;
    
	  var till = inputParams.till;
    
    if (isNaN(parseInt(till))) {
      isValid = false;
    }
    
    if (till.indexOf('-') >= 0) {
      isValid = false;
    }
    
    if (5 < till.length) {
      isValid = false;
    }
    
    if (till.indexOf('0') == 0) {
      isValid = false;
    }

	  return { switchId: (isValid ? 'valid' : 'invalid') };