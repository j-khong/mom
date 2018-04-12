DevUtil = {
  isSet: function(obj) {
    return !(_.isUndefined(obj) || _.isNull(obj));
  },
  isNotSet: function(obj) {
    return !DevUtil.isSet(obj);
  },
  isOneNotSet: function(memberNames, data) {
    var ret = false;
    memberNames.forEach(function(member) {
      if( DevUtil.isNotSet(data[member]) ) {
        ret = true;
        return;
      }
    });
    return ret;
  },
  isAllSet: function(memberNames, data) { return !DevUtil.isOneNotSet(memberNames, data); },
  isBlank: function(string) {
    return (!DevUtil.isSet(string) || string.trim().length === 0);
  },
  isArrayEmpty: function(array) {
    return (!DevUtil.isSet(array) || array.length === 0);
  },
  isInArray(o) {
    var index = o.arr.indexOf(o.val);
    return index > -1;
  },
  getField(struct, fieldname, defval) {
    if( DevUtil.isSet(struct) && DevUtil.isSet(struct[fieldname]) ) {
      return struct[fieldname];
    }
    return defval;
  },
  getFieldFromArray(array, indexValue, fieldname, defval) {
    if( !Array.isArray(array) ) { return defval; }

    if( DevUtil.isSet(array)
      && DevUtil.isSet(array[indexValue])
      && DevUtil.isSet(array[indexValue][fieldname]) ) {
      return array[indexValue][fieldname];
    }
    return defval;
  }
};