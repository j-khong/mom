import {NamespaceToReplace} from "/imports/common/_base.js";

NamespaceToReplace.UI = {};
NamespaceToReplace.UI.Controllers = {};
NamespaceToReplace.UI.Vue = class Vue {
  constructor(timeout) {
    this.timeout = timeout;
    this.currentTpl = new ReactiveVar(null);
    this.errorMsg = new ReactiveVar(null);
    this.msg = new ReactiveVar(null);
  }

  getCurrentTemplate() { return this.currentTpl.get(); }

  setCurrentTemplate(tpl) { return this.currentTpl.set(tpl); }

  getErrorMsg() { return this.errorMsg.get(); }

  getMsg() { return this.msg.get(); }

  resetError() { this.errorMsg.set(null); }

  onError(msg) { this._setTempVal(this.errorMsg, msg); }

  onMsg(msg) { this._setTempVal(this.msg, msg); }

  _setTempVal(reactvar, val) {
    reactvar.set(val);
    Meteor.setTimeout(function() {
      reactvar.set(null);
    }, this.timeout);
  }
};

export {NamespaceToReplace};