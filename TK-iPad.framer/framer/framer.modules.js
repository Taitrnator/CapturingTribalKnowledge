require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}],"symbols/Symbol":[function(require,module,exports){
var copySourceToTarget, copyStatesFromTarget, removeIds, useGA,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

useGA = function(bool) {
  var s;
  if (bool == null) {
    bool = true;
  }
  if (bool === true) {
    s = document.createElement('script');
    s.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=UA-122141681-1');
    s.setAttribute('async', '');
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      return dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'UA-122141681-1');
    if (window.location.href.includes('framer.cloud')) {
      return window.gtag('event', 'Cloud', {
        'event_category': 'Visitors'
      });
    } else {
      return window.gtag('event', 'Non-Cloud', {
        'event_category': 'Visitors'
      });
    }
  }
};

useGA(true);

removeIds = function(htmlString) {
  var i, id, ids, len;
  ids = Utils.getIdAttributesFromString(htmlString);
  for (i = 0, len = ids.length; i < len; i++) {
    id = ids[i];
    htmlString = htmlString.replace(/ id="(.*?)"/g, "");
  }
  return htmlString;
};

copySourceToTarget = function(source, target) {
  var i, len, ref, results, subLayer, svgCopy;
  if (target == null) {
    target = false;
  }
  if (source.children.length > 0) {
    ref = source.descendants;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subLayer = ref[i];
      if (subLayer.constructor.name === "SVGLayer") {
        if ((subLayer.html != null) && (subLayer.svg != null)) {
          delete subLayer.svg;
        }
        subLayer.html = removeIds(subLayer.html);
        target[subLayer.name] = subLayer.copy();
      } else if (subLayer.constructor.name === "SVGPath" || subLayer.constructor.name === "SVGGroup") {
        svgCopy = subLayer._svgLayer.copy();
        target[subLayer.name] = svgCopy;
      } else {
        target[subLayer.name] = subLayer.copySingle();
      }
      target[subLayer.name].name = subLayer.name;
      if (subLayer.parent === source) {
        target[subLayer.name].parent = target;
      } else {
        target[subLayer.name].parent = target[subLayer.parent.name];
      }
      if (target[subLayer.name].constructor.name !== "SVGLayer") {
        target[subLayer.name].constraintValues = subLayer.constraintValues;
        target[subLayer.name].layout();
      }
      results.push(target[subLayer.name]._instance = target);
    }
    return results;
  }
};

copyStatesFromTarget = function(source, target, stateName, animationOptions, ignoredProps, stateProps) {
  var descendantProp, descendantVal, i, ignoredProp, ignoredVal, j, layer, len, len1, ref, ref1, stateProp, stateVal, subLayer, targets;
  if (animationOptions == null) {
    animationOptions = false;
  }
  if (ignoredProps == null) {
    ignoredProps = false;
  }
  if (stateProps == null) {
    stateProps = false;
  }
  targets = [];
  ref = target.descendants;
  for (i = 0, len = ref.length; i < len; i++) {
    layer = ref[i];
    if (layer.constraintValues) {
      layer.frame = Utils.calculateLayoutFrame(layer.parent.frame, layer);
    }
    targets[layer.name] = layer;
  }
  ref1 = source.descendants;
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    subLayer = ref1[j];
    if (subLayer.constructor.name === "SVGLayer") {
      delete targets[subLayer.name].states["default"].html;
    }
    if (subLayer.constructor.name === "SVGPath" || subLayer.constructor.name === "SVGGroup") {
      subLayer._svgLayer.states["" + stateName] = targets[subLayer.name]._svgLayer.states["default"];
    }
    if (ignoredProps) {
      for (ignoredProp in ignoredProps) {
        ignoredVal = ignoredProps[ignoredProp];
        if (targets[subLayer.name].name === ignoredProp) {
          for (descendantProp in ignoredVal) {
            descendantVal = ignoredVal[descendantProp];
            targets[subLayer.name].states["default"][descendantProp] = descendantVal;
          }
        }
      }
    }
    if (stateProps) {
      for (stateProp in stateProps) {
        stateVal = stateProps[stateProp];
        if (targets[subLayer.name].name === stateProp) {
          for (descendantProp in stateVal) {
            descendantVal = stateVal[descendantProp];
            targets[subLayer.name].states["default"][descendantProp] = descendantVal;
          }
        }
      }
    }
    if (stateName !== "default" || (subLayer.constructor.name === "SVGPath" || subLayer.constructor.name === "SVGGroup" || subLayer.constructor.name === "SVGLayer")) {
      subLayer.states["" + stateName] = targets[subLayer.name].states["default"];
    }
    if (animationOptions) {
      subLayer.states["" + stateName].animationOptions = animationOptions;
      if (subLayer.constructor.name === "SVGPath" || subLayer.constructor.name === "SVGGroup") {
        subLayer._svgLayer.states["" + stateName].animationOptions = animationOptions;
      }
    }
    if (targets[subLayer.name].constructor.name !== "SVGPath" || targets[subLayer.name].constructor.name !== "SVGGroup") {
      targets[subLayer.name].layout();
    }
  }
  return target.destroy();
};

Layer.prototype.replaceWithSymbol = function(symbol) {
  return Utils.throwInStudioOrWarnInProduction("Error: layer.replaceWithSymbol(symbolInstance) is deprecated - use symbolInstance.replaceLayer(layer) instead.");
};

exports.Symbol = function(layer, states, events) {
  var Symbol;
  if (states == null) {
    states = false;
  }
  if (events == null) {
    events = false;
  }
  return Symbol = (function(superClass) {
    extend(Symbol, superClass);

    function Symbol(options) {
      var action, actionProps, base, base1, base2, base3, blacklist, child, descendant, i, j, k, key, l, len, len1, len2, len3, newStates, prop, props, ref, ref1, ref2, ref3, ref4, stateName, stateProps, trigger, triggerName, val, value;
      this.options = options != null ? options : {};
      if ((base = this.options).x == null) {
        base.x = 0;
      }
      if ((base1 = this.options).y == null) {
        base1.y = 0;
      }
      if ((base2 = this.options).replaceLayer == null) {
        base2.replaceLayer = false;
      }
      if ((base3 = this.options).initialState == null) {
        base3.initialState = false;
      }
      blacklist = ['parent', 'replaceLayer'];
      this.ignoredProps = {};
      ref = this.options;
      for (key in ref) {
        val = ref[key];
        this.ignoredProps[key] = val;
      }
      for (i = 0, len = blacklist.length; i < len; i++) {
        prop = blacklist[i];
        delete this.ignoredProps[prop];
      }
      Symbol.__super__.constructor.call(this, _.defaults(this.options, layer.props));
      this.customProps = this.options.customProps;
      this.initialState = this.options.initialState;
      copySourceToTarget(layer, this);
      copyStatesFromTarget(this, layer, 'default', false, this.ignoredProps);
      if (this.options.replaceLayer) {
        this.replaceLayer(this.options.replaceLayer);
      }
      ref1 = this.descendants;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        child = ref1[j];
        this[child.name] = child;
        ref2 = this.options;
        for (key in ref2) {
          props = ref2[key];
          if (key === child.name) {
            for (prop in props) {
              value = props[prop];
              this[key][prop] = value;
            }
          }
        }
      }
      if (states) {
        newStates = _.cloneDeep(states);
        for (stateName in newStates) {
          stateProps = newStates[stateName];
          if (stateName === "animationOptions") {
            this.animationOptions = stateProps;
            ref3 = this.descendants;
            for (k = 0, len2 = ref3.length; k < len2; k++) {
              descendant = ref3[k];
              descendant.animationOptions = this.animationOptions;
            }
          } else {
            if (!stateProps.template) {
              stateProps.template = layer;
            }
            this.addSymbolState(stateName, stateProps.template, stateProps.animationOptions, this.ignoredProps, stateProps);
          }
        }
      }
      if (events) {
        for (trigger in events) {
          action = events[trigger];
          if (_.isFunction(action)) {
            if (Events[trigger]) {
              this.on(Events[trigger], action);
            }
          } else {
            if (this[trigger]) {
              for (triggerName in action) {
                actionProps = action[triggerName];
                if (Events[triggerName]) {
                  this[trigger].on(Events[triggerName], actionProps);
                }
              }
            }
          }
        }
      }
      ref4 = this.descendants;
      for (l = 0, len3 = ref4.length; l < len3; l++) {
        child = ref4[l];
        if (child.constructor.name === "SVGLayer" || child.constructor.name === "SVGPath" || child.constructor.name === "SVGGroup") {
          child.stateSwitch("default");
        }
      }
      this.on(Events.StateSwitchStart, function(from, to) {
        var len4, m, ref5, results;
        if (from === to) {
          return;
        }
        ref5 = this.descendants;
        results = [];
        for (m = 0, len4 = ref5.length; m < len4; m++) {
          child = ref5[m];
          if (child.constructor.name === "TextLayer") {
            child.states[to].text = child.text;
            child.states[to].textAlign = child.props.styledTextOptions.alignment;
            if (child.template && Object.keys(child.template).length > 0) {
              child.states[to].template = child.template;
            }
          } else {
            if (child.image && (child.states[to].image !== child.image)) {
              child.states[to].image = child.image;
            }
          }
          results.push(child.animate(to));
        }
        return results;
      });
      if (states) {
        for (stateName in states) {
          stateProps = states[stateName];
          if (stateProps.template) {
            stateProps.template.destroy();
          }
        }
      }
      layer.destroy();
      if (this.options.initialState) {
        if (this.states[this.options.initialState]) {
          this.stateSwitch(this.options.initialState);
        } else {
          Utils.throwInStudioOrWarnInProduction("The supplied initialState '" + this.options.initialState + "' is undefined");
        }
      }
    }

    Symbol.prototype.addSymbolState = function(stateName, target, animationOptions, ignoredProps, stateProps) {
      var descendant, i, j, k, len, len1, len2, newTarget, prop, ref, ref1, ref2, stateProp, stateVal, targets;
      if (animationOptions == null) {
        animationOptions = false;
      }
      if (ignoredProps == null) {
        ignoredProps = false;
      }
      if (stateProps == null) {
        stateProps = false;
      }
      newTarget = target.copy();
      targets = [];
      ref = target.descendants;
      for (i = 0, len = ref.length; i < len; i++) {
        descendant = ref[i];
        targets[descendant.name] = descendant;
      }
      ref1 = newTarget.descendants;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        descendant = ref1[j];
        descendant.constraintValues = targets[descendant.name].constraintValues;
        if (descendant.constructor.name === "SVGPath" || descendant.constructor.name === "SVGGroup") {
          descendant.states["default"] = targets[descendant.name].states["default"];
        }
      }
      if (ignoredProps.width) {
        newTarget.width = ignoredProps.width;
      }
      if (ignoredProps.height) {
        newTarget.height = ignoredProps.height;
      }
      ref2 = ['x', 'y'];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        prop = ref2[k];
        delete newTarget.states["default"][prop];
      }
      if (ignoredProps) {
        for (prop in ignoredProps) {
          delete newTarget.states["default"][prop];
        }
      }
      if (stateProps.width) {
        newTarget.width = stateProps.width;
      }
      if (stateProps.height) {
        newTarget.height = stateProps.height;
      }
      if (stateProps) {
        for (stateProp in stateProps) {
          stateVal = stateProps[stateProp];
          if (typeof newTarget.props[stateProp] !== 'undefined') {
            newTarget.states["default"][stateProp] = stateVal;
            delete stateProps[stateProp];
          }
        }
      }
      this.states["" + stateName] = newTarget.states["default"];
      if (animationOptions) {
        this.states["" + stateName].animationOptions = animationOptions;
      }
      return copyStatesFromTarget(this, newTarget, stateName, animationOptions, ignoredProps, stateProps);
    };

    Symbol.prototype.stateSwitch = function(stateName) {
      var animCurve, animTime, desc, i, j, len, len1, ref, ref1, results;
      if (this.states[stateName].animationOptions) {
        animTime = this.states[stateName].animationOptions.time;
        animCurve = this.states[stateName].animationOptions.curve;
      } else {
        animTime = this.states.animationOptions.time;
        animCurve = this.states.animationOptions.curve;
      }
      ref = this.descendants;
      for (i = 0, len = ref.length; i < len; i++) {
        desc = ref[i];
        if (desc.states[stateName].animationOptions) {
          desc.states[stateName].animationOptions.time = 0.05;
          desc.states[stateName].animationOptions.curve = "linear";
        } else {
          desc.states.animationOptions.time = 0.05;
          desc.states.animationOptions.curve = "linear";
        }
      }
      this.animate(stateName, {
        time: 0.05,
        curve: "linear"
      });
      ref1 = this.descendants;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        desc = ref1[j];
        if (desc.states[stateName].animationOptions) {
          desc.states[stateName].animationOptions.time = animTime;
          results.push(desc.states[stateName].animationOptions.curve = animCurve);
        } else {
          desc.states.animationOptions.time = animTime;
          results.push(desc.states.animationOptions.curve = animCurve);
        }
      }
      return results;
    };

    Symbol.prototype.replaceLayer = function(layer, resize) {
      var i, len, ref, stateName;
      if (resize == null) {
        resize = false;
      }
      this.parent = layer.parent;
      this.x = layer.x;
      this.y = layer.y;
      if (resize) {
        this.width = layer.width;
        this.height = layer.height;
      }
      ref = this.stateNames;
      for (i = 0, len = ref.length; i < len; i++) {
        stateName = ref[i];
        this.states[stateName].x = layer.x;
        this.states[stateName].y = layer.y;
        if (resize) {
          this.states[stateName].width = layer.width;
          this.states[stateName].height = layer.height;
        }
      }
      return layer.destroy();
    };

    return Symbol;

  })(Layer);
};

exports.createSymbol = function(layer, states, events) {
  return exports.Symbol(layer, states, events);
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3RhaXR3YXlsYW5kL0RvY3VtZW50cy9DYXB0dXJpbmdUcmliYWxLbm93bGVkZ2UvVEstaVBhZC5mcmFtZXIvbW9kdWxlcy9zeW1ib2xzL1N5bWJvbC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy90YWl0d2F5bGFuZC9Eb2N1bWVudHMvQ2FwdHVyaW5nVHJpYmFsS25vd2xlZGdlL1RLLWlQYWQuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIFNldCBHb29nbGUgQW5hbHl0aWNzXG51c2VHQSA9IChib29sID0gdHJ1ZSkgLT5cbiAgaWYgYm9vbCBpcyB0cnVlXG4gICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ3NjcmlwdCdcbiAgICBzLnNldEF0dHJpYnV0ZSAnc3JjJywgJ2h0dHBzOi8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0YWcvanM/aWQ9VUEtMTIyMTQxNjgxLTEnXG4gICAgcy5zZXRBdHRyaWJ1dGUgJ2FzeW5jJywgJydcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkIHNcblxuICAgIHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdXG5cbiAgICB3aW5kb3cuZ3RhZyA9ICgpIC0+IFxuICAgICAgICBkYXRhTGF5ZXIucHVzaCBhcmd1bWVudHNcbiAgICB3aW5kb3cuZ3RhZyAnanMnLCBuZXcgRGF0ZSgpXG4gICAgd2luZG93Lmd0YWcgJ2NvbmZpZycsICdVQS0xMjIxNDE2ODEtMSdcblxuICAgIGlmIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzICdmcmFtZXIuY2xvdWQnXG4gICAgICAgIHdpbmRvdy5ndGFnICdldmVudCcsICdDbG91ZCcsXG4gICAgICAgICAgICAnZXZlbnRfY2F0ZWdvcnknOiAnVmlzaXRvcnMnXG4gICAgZWxzZVxuICAgICAgICB3aW5kb3cuZ3RhZyAnZXZlbnQnLCAnTm9uLUNsb3VkJyxcbiAgICAgICAgICAgICdldmVudF9jYXRlZ29yeSc6ICdWaXNpdG9ycydcblxuIyBHb29nbGUgQW5hbHl0aWNzIGlzIHR1cm5lZCBvbiBieSBkZWZhdWx0IFxuIyBKdXN0IHJlbW92ZSB0aGUgbGluZSBiZWxvdyB0byB0dXJuIGl0IG9mZiFcbnVzZUdBKHRydWUpXG5cbiMgUmVtb3ZlcyBJRHMgZnJvbSBTVkdcbnJlbW92ZUlkcyA9IChodG1sU3RyaW5nKSAtPlxuICBpZHMgPSBVdGlscy5nZXRJZEF0dHJpYnV0ZXNGcm9tU3RyaW5nKGh0bWxTdHJpbmcpXG4gIGZvciBpZCBpbiBpZHNcbiAgICBodG1sU3RyaW5nID0gaHRtbFN0cmluZy5yZXBsYWNlKC8gaWQ9XCIoLio/KVwiL2csIFwiXCIpIDtcbiAgcmV0dXJuIGh0bWxTdHJpbmdcblxuIyBDb3BpZXMgYWxsIGRlc2NlbmRhbnRzIG9mIGEgbGF5ZXJcbmNvcHlTb3VyY2VUb1RhcmdldCA9IChzb3VyY2UsIHRhcmdldCA9IGZhbHNlKSAtPlxuICBpZiBzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgIGZvciBzdWJMYXllciBpbiBzb3VyY2UuZGVzY2VuZGFudHNcbiAgICAgIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdMYXllclwiXG4gICAgICAgIGlmIHN1YkxheWVyLmh0bWw/IGFuZCBzdWJMYXllci5zdmc/XG4gICAgICAgICAgZGVsZXRlIHN1YkxheWVyLnN2Z1xuICAgICAgICBzdWJMYXllci5odG1sID0gcmVtb3ZlSWRzKHN1YkxheWVyLmh0bWwpXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXSA9IHN1YkxheWVyLmNvcHkoKVxuICAgICAgZWxzZSBpZiBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHUGF0aFwiIG9yIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdHcm91cFwiXG4gICAgICAgIHN2Z0NvcHkgPSBzdWJMYXllci5fc3ZnTGF5ZXIuY29weSgpXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXSA9IHN2Z0NvcHlcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdID0gc3ViTGF5ZXIuY29weVNpbmdsZSgpXG5cbiAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXS5uYW1lID0gc3ViTGF5ZXIubmFtZVxuXG4gICAgICBpZiBzdWJMYXllci5wYXJlbnQgaXMgc291cmNlXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXS5wYXJlbnQgPSB0YXJnZXRcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLnBhcmVudCA9IHRhcmdldFtzdWJMYXllci5wYXJlbnQubmFtZV1cblxuICAgICAgaWYgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLmNvbnN0cnVjdG9yLm5hbWUgaXNudCBcIlNWR0xheWVyXCJcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLmNvbnN0cmFpbnRWYWx1ZXMgPSBzdWJMYXllci5jb25zdHJhaW50VmFsdWVzXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXS5sYXlvdXQoKVxuXG4gICAgICAjIENyZWF0ZSByZWZlcmVuY2UgdG8gdGhlIHN5bWJvbCBpbnN0YW5jZVxuICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLl9pbnN0YW5jZSA9IHRhcmdldFxuXG4jIENvcGllcyBkZWZhdWx0LXN0YXRlIG9mIHRhcmdldCBhbmQgYXBwbGllcyBpdCB0byB0aGUgc3ltYm9sJ3MgZGVzY2VuZGFudHNcbmNvcHlTdGF0ZXNGcm9tVGFyZ2V0ID0gKHNvdXJjZSwgdGFyZ2V0LCBzdGF0ZU5hbWUsIGFuaW1hdGlvbk9wdGlvbnMgPSBmYWxzZSwgaWdub3JlZFByb3BzID0gZmFsc2UsIHN0YXRlUHJvcHMgPSBmYWxzZSkgLT5cbiAgdGFyZ2V0cyA9IFtdXG5cbiAgZm9yIGxheWVyIGluIHRhcmdldC5kZXNjZW5kYW50c1xuICAgIGlmIGxheWVyLmNvbnN0cmFpbnRWYWx1ZXNcbiAgICAgIGxheWVyLmZyYW1lID0gVXRpbHMuY2FsY3VsYXRlTGF5b3V0RnJhbWUobGF5ZXIucGFyZW50LmZyYW1lLCBsYXllcilcbiAgICB0YXJnZXRzW2xheWVyLm5hbWVdID0gbGF5ZXJcblxuICBmb3Igc3ViTGF5ZXIgaW4gc291cmNlLmRlc2NlbmRhbnRzXG4gICAgaWYgc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCJcbiAgICAgIGRlbGV0ZSB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLnN0YXRlcy5kZWZhdWx0Lmh0bWxcblxuICAgIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCJcbiAgICAgIHN1YkxheWVyLl9zdmdMYXllci5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0gPSB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLl9zdmdMYXllci5zdGF0ZXMuZGVmYXVsdFxuXG4gICAgaWYgaWdub3JlZFByb3BzXG4gICAgICAjIENoYW5nZSB0aGUgcHJvcHMgb2YgdGhlIGRlc2NlbmRhbnRzIG9mIGEgc3ltYm9sIGluc2lkZSBjb21tb25TdGF0ZXNcbiAgICAgIGZvciBpZ25vcmVkUHJvcCwgaWdub3JlZFZhbCBvZiBpZ25vcmVkUHJvcHNcbiAgICAgICAgaWYgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5uYW1lIGlzIGlnbm9yZWRQcm9wXG4gICAgICAgICAgZm9yIGRlc2NlbmRhbnRQcm9wLCBkZXNjZW5kYW50VmFsIG9mIGlnbm9yZWRWYWxcbiAgICAgICAgICAgIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uc3RhdGVzLmRlZmF1bHRbZGVzY2VuZGFudFByb3BdID0gZGVzY2VuZGFudFZhbFxuXG4gICAgaWYgc3RhdGVQcm9wc1xuICAgICAgIyBDaGFuZ2UgdGhlIHByb3BzIG9mIHRoZSBkZXNjZW5kYW50cyBvZiBhIHN5bWJvbCBpbnNpZGUgY29tbW9uU3RhdGVzXG4gICAgICBmb3Igc3RhdGVQcm9wLCBzdGF0ZVZhbCBvZiBzdGF0ZVByb3BzXG4gICAgICAgIGlmIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0ubmFtZSBpcyBzdGF0ZVByb3BcbiAgICAgICAgICBmb3IgZGVzY2VuZGFudFByb3AsIGRlc2NlbmRhbnRWYWwgb2Ygc3RhdGVWYWxcbiAgICAgICAgICAgIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uc3RhdGVzLmRlZmF1bHRbZGVzY2VuZGFudFByb3BdID0gZGVzY2VuZGFudFZhbFxuXG4gICAgaWYgc3RhdGVOYW1lIGlzbnQgXCJkZWZhdWx0XCIgb3IgKHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCIpXG4gICAgICBzdWJMYXllci5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0gPSB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLnN0YXRlcy5kZWZhdWx0XG5cbiAgICBpZiBhbmltYXRpb25PcHRpb25zXG4gICAgICBzdWJMYXllci5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0uYW5pbWF0aW9uT3B0aW9ucyA9IGFuaW1hdGlvbk9wdGlvbnNcblxuICAgICAgIyBBbHNvIGFkZCB0aGUgYW5pbWF0aW9uT3B0aW9ucyB0byB0aGUgXCJwYXJlbnRcIiBTVkdMYXllciBvZiBhIFNWR1BhdGggb3IgU1ZHR3JvdXBcbiAgICAgIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCJcbiAgICAgICAgc3ViTGF5ZXIuX3N2Z0xheWVyLnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXS5hbmltYXRpb25PcHRpb25zID0gYW5pbWF0aW9uT3B0aW9uc1xuXG4gICAgaWYgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5jb25zdHJ1Y3Rvci5uYW1lIGlzbnQgXCJTVkdQYXRoXCIgb3IgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5jb25zdHJ1Y3Rvci5uYW1lIGlzbnQgXCJTVkdHcm91cFwiXG4gICAgICB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLmxheW91dCgpXG5cbiAgdGFyZ2V0LmRlc3Ryb3koKVxuXG5MYXllcjo6cmVwbGFjZVdpdGhTeW1ib2wgPSAoc3ltYm9sKSAtPlxuICBVdGlscy50aHJvd0luU3R1ZGlvT3JXYXJuSW5Qcm9kdWN0aW9uIFwiRXJyb3I6IGxheWVyLnJlcGxhY2VXaXRoU3ltYm9sKHN5bWJvbEluc3RhbmNlKSBpcyBkZXByZWNhdGVkIC0gdXNlIHN5bWJvbEluc3RhbmNlLnJlcGxhY2VMYXllcihsYXllcikgaW5zdGVhZC5cIlxuICAjIHN5bWJvbC5yZXBsYWNlTGF5ZXIgQFxuXG5leHBvcnRzLlN5bWJvbCA9IChsYXllciwgc3RhdGVzID0gZmFsc2UsIGV2ZW50cyA9IGZhbHNlKSAtPlxuXG4gIGNsYXNzIFN5bWJvbCBleHRlbmRzIExheWVyXG4gICAgY29uc3RydWN0b3I6IChAb3B0aW9ucyA9IHt9KSAtPlxuICAgICAgQG9wdGlvbnMueCA/PSAwXG4gICAgICBAb3B0aW9ucy55ID89IDBcbiAgICAgIEBvcHRpb25zLnJlcGxhY2VMYXllciA/PSBmYWxzZVxuICAgICAgQG9wdGlvbnMuaW5pdGlhbFN0YXRlID89IGZhbHNlXG5cbiAgICAgIGJsYWNrbGlzdCA9IFsncGFyZW50JywgJ3JlcGxhY2VMYXllciddXG4gICAgICBALmlnbm9yZWRQcm9wcyA9IHt9XG5cbiAgICAgIGZvciBrZXksIHZhbCBvZiBAb3B0aW9uc1xuICAgICAgICBALmlnbm9yZWRQcm9wc1trZXldID0gdmFsXG5cbiAgICAgIGZvciBwcm9wIGluIGJsYWNrbGlzdFxuICAgICAgICBkZWxldGUgQC5pZ25vcmVkUHJvcHNbcHJvcF1cblxuICAgICAgc3VwZXIgXy5kZWZhdWx0cyBAb3B0aW9ucywgbGF5ZXIucHJvcHNcblxuICAgICAgQC5jdXN0b21Qcm9wcyA9IEBvcHRpb25zLmN1c3RvbVByb3BzXG4gICAgICBALmluaXRpYWxTdGF0ZSA9IEBvcHRpb25zLmluaXRpYWxTdGF0ZVxuXG4gICAgICBjb3B5U291cmNlVG9UYXJnZXQobGF5ZXIsIEApXG4gICAgICBjb3B5U3RhdGVzRnJvbVRhcmdldChALCBsYXllciwgJ2RlZmF1bHQnLCBmYWxzZSwgQC5pZ25vcmVkUHJvcHMpXG5cbiAgICAgIGlmIEBvcHRpb25zLnJlcGxhY2VMYXllclxuICAgICAgICBALnJlcGxhY2VMYXllciBAb3B0aW9ucy5yZXBsYWNlTGF5ZXJcblxuICAgICAgZm9yIGNoaWxkIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgQFtjaGlsZC5uYW1lXSA9IGNoaWxkXG5cbiAgICAgICAgZm9yIGtleSwgcHJvcHMgb2YgQG9wdGlvbnNcbiAgICAgICAgICBpZiBrZXkgaXMgY2hpbGQubmFtZVxuICAgICAgICAgICAgZm9yIHByb3AsIHZhbHVlIG9mIHByb3BzXG4gICAgICAgICAgICAgIEBba2V5XVtwcm9wXSA9IHZhbHVlXG5cbiAgICAgICMgQXBwbHkgc3RhdGVzIHRvIHN5bWJvbCBpZiBzdXBwbGllZFxuICAgICAgaWYgc3RhdGVzXG4gICAgICAgIG5ld1N0YXRlcyA9IF8uY2xvbmVEZWVwKHN0YXRlcylcbiAgICAgICAgZm9yIHN0YXRlTmFtZSwgc3RhdGVQcm9wcyBvZiBuZXdTdGF0ZXNcbiAgICAgICAgICAjIEZpbHRlciBhbmltYXRpb25PcHRpb25zIG91dCBvZiBzdGF0ZXMgYW5kIGFwcGx5IHRoZW0gdG8gc3ltYm9sXG4gICAgICAgICAgaWYgc3RhdGVOYW1lIGlzIFwiYW5pbWF0aW9uT3B0aW9uc1wiXG4gICAgICAgICAgICBALmFuaW1hdGlvbk9wdGlvbnMgPSBzdGF0ZVByb3BzXG4gICAgICAgICAgICBmb3IgZGVzY2VuZGFudCBpbiBALmRlc2NlbmRhbnRzXG4gICAgICAgICAgICAgIGRlc2NlbmRhbnQuYW5pbWF0aW9uT3B0aW9ucyA9IEAuYW5pbWF0aW9uT3B0aW9uc1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmICFzdGF0ZVByb3BzLnRlbXBsYXRlXG4gICAgICAgICAgICAgIHN0YXRlUHJvcHMudGVtcGxhdGUgPSBsYXllclxuXG4gICAgICAgICAgICBALmFkZFN5bWJvbFN0YXRlKHN0YXRlTmFtZSwgc3RhdGVQcm9wcy50ZW1wbGF0ZSwgc3RhdGVQcm9wcy5hbmltYXRpb25PcHRpb25zLCBALmlnbm9yZWRQcm9wcywgc3RhdGVQcm9wcylcblxuICAgICAgIyBBcHBseSBldmVudHMgdG8gc3ltYm9sIGlmIHN1cHBsaWVkXG4gICAgICBpZiBldmVudHNcbiAgICAgICAgZm9yIHRyaWdnZXIsIGFjdGlvbiBvZiBldmVudHNcbiAgICAgICAgICAjIGlmIGV2ZW50IGxpc3RlbmVyIGlzIGFwcGxpZWQgdG8gdGhlIHN5bWJvbC1pbnN0YW5jZVxuICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbihhY3Rpb24pXG4gICAgICAgICAgICBpZiBFdmVudHNbdHJpZ2dlcl1cbiAgICAgICAgICAgICAgQG9uIEV2ZW50c1t0cmlnZ2VyXSwgYWN0aW9uXG4gICAgICAgICAgIyBpZiBldmVudCBsaXN0ZW5lciBpcyBhcHBsaWVkIHRvIGEgc3ltYm9sJ3MgZGVzY2VuZGFudFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIEBbdHJpZ2dlcl1cbiAgICAgICAgICAgICAgZm9yIHRyaWdnZXJOYW1lLCBhY3Rpb25Qcm9wcyBvZiBhY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBFdmVudHNbdHJpZ2dlck5hbWVdXG4gICAgICAgICAgICAgICAgICBAW3RyaWdnZXJdLm9uIEV2ZW50c1t0cmlnZ2VyTmFtZV0sIGFjdGlvblByb3BzXG5cbiAgICAgICMgUHJldmVudCB3ZWlyZCBnbGl0Y2hlcyBieSBzd2l0Y2hpbmcgU1ZHcyB0byBcImRlZmF1bHRcIiBzdGF0ZSBkaXJlY3RseVxuICAgICAgZm9yIGNoaWxkIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgaWYgY2hpbGQuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCIgb3IgY2hpbGQuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR1BhdGhcIiBvciBjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIlxuICAgICAgICAgIGNoaWxkLnN0YXRlU3dpdGNoIFwiZGVmYXVsdFwiXG5cbiAgICAgICMgSGFuZGxlIHRoZSBzdGF0ZVN3aXRjaCBmb3IgYWxsIGRlc2NlbmRhbnRzXG4gICAgICBALm9uIEV2ZW50cy5TdGF0ZVN3aXRjaFN0YXJ0LCAoZnJvbSwgdG8pIC0+XG4gICAgICAgIGlmIGZyb20gaXMgdG9cbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBmb3IgY2hpbGQgaW4gQC5kZXNjZW5kYW50c1xuICAgICAgICAgICMgU3BlY2lhbCBoYW5kbGluZyBmb3IgVGV4dExheWVyc1xuICAgICAgICAgIGlmIGNoaWxkLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJUZXh0TGF5ZXJcIlxuICAgICAgICAgICAgY2hpbGQuc3RhdGVzW3RvXS50ZXh0ID0gY2hpbGQudGV4dFxuICAgICAgICAgICAgY2hpbGQuc3RhdGVzW3RvXS50ZXh0QWxpZ24gPSBjaGlsZC5wcm9wcy5zdHlsZWRUZXh0T3B0aW9ucy5hbGlnbm1lbnRcblxuICAgICAgICAgICAgaWYgY2hpbGQudGVtcGxhdGUgYW5kIE9iamVjdC5rZXlzKGNoaWxkLnRlbXBsYXRlKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGNoaWxkLnN0YXRlc1t0b10udGVtcGxhdGUgPSBjaGlsZC50ZW1wbGF0ZVxuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgY2hpbGQuaW1hZ2UgYW5kIChjaGlsZC5zdGF0ZXNbdG9dLmltYWdlIGlzbnQgY2hpbGQuaW1hZ2UpXG4gICAgICAgICAgICAgIGNoaWxkLnN0YXRlc1t0b10uaW1hZ2UgPSBjaGlsZC5pbWFnZVxuXG4gICAgICAgICAgIyBLaWNrc3RhcnQgdGhlIHN0YXRlU3dpdGNoXG4gICAgICAgICAgY2hpbGQuYW5pbWF0ZSB0b1xuXG4gICAgICAjIERlc3Ryb3kgc3RhdGUgdGVtcGxhdGUgbGF5ZXJzXG4gICAgICBpZiBzdGF0ZXNcbiAgICAgICAgZm9yIHN0YXRlTmFtZSwgc3RhdGVQcm9wcyBvZiBzdGF0ZXNcbiAgICAgICAgICBpZiBzdGF0ZVByb3BzLnRlbXBsYXRlXG4gICAgICAgICAgICBzdGF0ZVByb3BzLnRlbXBsYXRlLmRlc3Ryb3koKVxuXG4gICAgICBsYXllci5kZXN0cm95KClcblxuICAgICAgIyBJZiB0aGVyZSdzIGFuIGluaXRpYWwgc3RhdGUgZGVmaW5lZCwgc3dpdGNoIHRvIGl0XG4gICAgICBpZiBAb3B0aW9ucy5pbml0aWFsU3RhdGVcbiAgICAgICAgaWYgQC5zdGF0ZXNbQG9wdGlvbnMuaW5pdGlhbFN0YXRlXVxuICAgICAgICAgIEAuc3RhdGVTd2l0Y2ggQG9wdGlvbnMuaW5pdGlhbFN0YXRlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBVdGlscy50aHJvd0luU3R1ZGlvT3JXYXJuSW5Qcm9kdWN0aW9uIFwiVGhlIHN1cHBsaWVkIGluaXRpYWxTdGF0ZSAnI3tAb3B0aW9ucy5pbml0aWFsU3RhdGV9JyBpcyB1bmRlZmluZWRcIlxuXG4gICAgIyBBZGRzIGEgbmV3IHN0YXRlXG4gICAgYWRkU3ltYm9sU3RhdGU6IChzdGF0ZU5hbWUsIHRhcmdldCwgYW5pbWF0aW9uT3B0aW9ucyA9IGZhbHNlLCBpZ25vcmVkUHJvcHMgPSBmYWxzZSwgc3RhdGVQcm9wcyA9IGZhbHNlKSAtPlxuICAgICAgbmV3VGFyZ2V0ID0gdGFyZ2V0LmNvcHkoKVxuICAgICAgdGFyZ2V0cyA9IFtdXG5cbiAgICAgIGZvciBkZXNjZW5kYW50IGluIHRhcmdldC5kZXNjZW5kYW50c1xuICAgICAgICB0YXJnZXRzW2Rlc2NlbmRhbnQubmFtZV0gPSBkZXNjZW5kYW50XG5cbiAgICAgIGZvciBkZXNjZW5kYW50IGluIG5ld1RhcmdldC5kZXNjZW5kYW50c1xuICAgICAgICBkZXNjZW5kYW50LmNvbnN0cmFpbnRWYWx1ZXMgPSB0YXJnZXRzW2Rlc2NlbmRhbnQubmFtZV0uY29uc3RyYWludFZhbHVlc1xuICAgICAgICBpZiBkZXNjZW5kYW50LmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3IgZGVzY2VuZGFudC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIlxuICAgICAgICAgIGRlc2NlbmRhbnQuc3RhdGVzLmRlZmF1bHQgPSB0YXJnZXRzW2Rlc2NlbmRhbnQubmFtZV0uc3RhdGVzLmRlZmF1bHRcblxuICAgICAgIyBSZXNpemUgdGhlIHRlbXBsYXRlIGJlZm9yZSB1c2luZyBpdHMgdmFsdWVzIHRvIHJlc3BlY3QgY29uc3RyYWludC1jaGFuZ2VzXG4gICAgICBpZiBpZ25vcmVkUHJvcHMud2lkdGhcbiAgICAgICAgbmV3VGFyZ2V0LndpZHRoID0gaWdub3JlZFByb3BzLndpZHRoXG4gICAgICBpZiBpZ25vcmVkUHJvcHMuaGVpZ2h0XG4gICAgICAgIG5ld1RhcmdldC5oZWlnaHQgPSBpZ25vcmVkUHJvcHMuaGVpZ2h0XG5cbiAgICAgICMgRGVsZXRlIHgseSBwcm9wcyBmcm9tIHRlbXBsYXRlcyBkZWZhdWx0IHN0YXRlXG4gICAgICBkZWxldGUgbmV3VGFyZ2V0LnN0YXRlcy5kZWZhdWx0W3Byb3BdIGZvciBwcm9wIGluIFsneCcsICd5J11cblxuICAgICAgIyBBcHBseSBhbGwgb3RoZXIgcHJvcHMgdGhhdCBzaG91bGQgc3RheSB0aGUgc2FtZSBmb3IgYWxsIHN0YXRlc1xuICAgICAgaWYgaWdub3JlZFByb3BzXG4gICAgICAgIGRlbGV0ZSBuZXdUYXJnZXQuc3RhdGVzLmRlZmF1bHRbcHJvcF0gZm9yIHByb3Agb2YgaWdub3JlZFByb3BzXG5cbiAgICAgIGlmIHN0YXRlUHJvcHMud2lkdGhcbiAgICAgICAgbmV3VGFyZ2V0LndpZHRoID0gc3RhdGVQcm9wcy53aWR0aFxuICAgICAgaWYgc3RhdGVQcm9wcy5oZWlnaHRcbiAgICAgICAgbmV3VGFyZ2V0LmhlaWdodCA9IHN0YXRlUHJvcHMuaGVpZ2h0XG5cbiAgICAgIGlmIHN0YXRlUHJvcHNcbiAgICAgICAgIyBDaGFuZ2UgdGhlIHByb3BzIG9mIGEgc3ltYm9sIGluc2lkZSBjb21tb25TdGF0ZXNcbiAgICAgICAgZm9yIHN0YXRlUHJvcCwgc3RhdGVWYWwgb2Ygc3RhdGVQcm9wc1xuICAgICAgICAgICMgQ2hlY2sgaWYgaXQncyBhIHByb3BlcnR5XG4gICAgICAgICAgaWYgdHlwZW9mIG5ld1RhcmdldC5wcm9wc1tzdGF0ZVByb3BdIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgIG5ld1RhcmdldC5zdGF0ZXMuZGVmYXVsdFtzdGF0ZVByb3BdID0gc3RhdGVWYWxcblxuICAgICAgICAgICAgZGVsZXRlIHN0YXRlUHJvcHNbc3RhdGVQcm9wXVxuXG4gICAgICAjIENyZWF0ZSBhIG5ldyBzdGF0ZSBmb3IgdGhlIHN5bWJvbCBhbmQgYXNzaWduIHJlbWFpbmluZyBwcm9wc1xuICAgICAgQC5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0gPSBuZXdUYXJnZXQuc3RhdGVzLmRlZmF1bHRcblxuICAgICAgIyBBc3NpZ24gYW5pbWF0aW9uT3B0aW9ucyB0byB0aGUgc3RhdGUgaWYgc3VwcGxpZWRcbiAgICAgIGlmIGFuaW1hdGlvbk9wdGlvbnNcbiAgICAgICAgQC5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0uYW5pbWF0aW9uT3B0aW9ucyA9IGFuaW1hdGlvbk9wdGlvbnNcblxuICAgICAgY29weVN0YXRlc0Zyb21UYXJnZXQoQCwgbmV3VGFyZ2V0LCBzdGF0ZU5hbWUsIGFuaW1hdGlvbk9wdGlvbnMsIGlnbm9yZWRQcm9wcywgc3RhdGVQcm9wcylcblxuICAgICMgT3ZlcnJpZGUgb3JpZ2luYWwgc3RhdGVTd2l0Y2ggdG8gbWFrZSBpdCB3b3JrIHdpdGggc3ltYm9sc1xuICAgIHN0YXRlU3dpdGNoOiAoc3RhdGVOYW1lKSAtPlxuXG4gICAgICAjIE1ha2UgYmFja3VwIG9mIHRoZSBvcmlnaW5hbCBhbmltYXRpb24gdGltZVxuICAgICAgaWYgQC5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zXG4gICAgICAgIGFuaW1UaW1lID0gQC5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLnRpbWVcbiAgICAgICAgYW5pbUN1cnZlID0gQC5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLmN1cnZlXG4gICAgICBlbHNlXG4gICAgICAgIGFuaW1UaW1lID0gQC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy50aW1lXG4gICAgICAgIGFuaW1DdXJ2ZSA9IEAuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMuY3VydmVcblxuICAgICAgIyBTZXQgdGhlIGFuaW1hdGlvbiB0aW1lIG9mIGFsbCBzeW1ib2wgbGF5ZXJzIHRvIHplcm9cbiAgICAgIGZvciBkZXNjIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgaWYgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zXG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLnRpbWUgPSAwLjA1XG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLmN1cnZlID0gXCJsaW5lYXJcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVzYy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy50aW1lID0gMC4wNVxuICAgICAgICAgIGRlc2Muc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMuY3VydmUgPSBcImxpbmVhclwiXG5cbiAgICAgICMgVHJpZ2dlciB0aGUgc3RhdGVTd2l0Y2hcbiAgICAgIEAuYW5pbWF0ZSBzdGF0ZU5hbWUsXG4gICAgICAgIHRpbWU6IDAuMDVcbiAgICAgICAgY3VydmU6IFwibGluZWFyXCJcblxuICAgICAgIyBSZXNldCB0aGUgYW5pbWF0aW9uIHRpbWUgdG8gdGhlIG9yaWdpbmFsIHRpbWVcbiAgICAgIGZvciBkZXNjIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgaWYgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zXG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLnRpbWUgPSBhbmltVGltZVxuICAgICAgICAgIGRlc2Muc3RhdGVzW3N0YXRlTmFtZV0uYW5pbWF0aW9uT3B0aW9ucy5jdXJ2ZSA9IGFuaW1DdXJ2ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVzYy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy50aW1lID0gYW5pbVRpbWVcbiAgICAgICAgICBkZXNjLnN0YXRlcy5hbmltYXRpb25PcHRpb25zLmN1cnZlID0gYW5pbUN1cnZlXG5cbiAgICAjIFJlcGxhY2VtZW50IGZvciByZXBsYWNlV2l0aFN5bWJvbCgpXG4gICAgcmVwbGFjZUxheWVyOiAobGF5ZXIsIHJlc2l6ZSA9IGZhbHNlKSAtPlxuICAgICAgQC5wYXJlbnQgPSBsYXllci5wYXJlbnRcbiAgICAgIEAueCA9IGxheWVyLnhcbiAgICAgIEAueSA9IGxheWVyLnlcblxuICAgICAgaWYgcmVzaXplXG4gICAgICAgIEAud2lkdGggPSBsYXllci53aWR0aFxuICAgICAgICBALmhlaWdodCA9IGxheWVyLmhlaWdodFxuXG4gICAgICBmb3Igc3RhdGVOYW1lIGluIEAuc3RhdGVOYW1lc1xuICAgICAgICBALnN0YXRlc1tzdGF0ZU5hbWVdLnggPSBsYXllci54XG4gICAgICAgIEAuc3RhdGVzW3N0YXRlTmFtZV0ueSA9IGxheWVyLnlcblxuICAgICAgICBpZiByZXNpemVcbiAgICAgICAgICBALnN0YXRlc1tzdGF0ZU5hbWVdLndpZHRoID0gbGF5ZXIud2lkdGhcbiAgICAgICAgICBALnN0YXRlc1tzdGF0ZU5hbWVdLmhlaWdodCA9IGxheWVyLmhlaWdodFxuXG4gICAgICBsYXllci5kZXN0cm95KClcblxuIyBBIGJhY2t1cCBmb3IgdGhlIGRlcHJlY2F0ZWQgd2F5IG9mIGNhbGxpbmcgdGhlIGNsYXNzXG5leHBvcnRzLmNyZWF0ZVN5bWJvbCA9IChsYXllciwgc3RhdGVzLCBldmVudHMpIC0+IGV4cG9ydHMuU3ltYm9sKGxheWVyLCBzdGF0ZXMsIGV2ZW50cylcbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMo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
