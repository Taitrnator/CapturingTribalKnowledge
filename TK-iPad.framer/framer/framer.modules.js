require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Pointer":[function(require,module,exports){
exports.Pointer = (function() {
  var clientCoords, coords, offsetArgumentError, offsetCoords, screenArgumentError;

  function Pointer() {}

  Pointer.screen = function(event, layer) {
    var e, screenCoords;
    if (!((event != null) && (layer != null))) {
      screenArgumentError();
    }
    e = offsetCoords(event);
    if (e.x && e.y) {
      screenCoords = layer.screenFrame;
      e.x += screenCoords.x;
      e.y += screenCoords.y;
    } else {
      e = clientCoords(event);
    }
    return e;
  };

  Pointer.offset = function(event, layer) {
    var e, targetScreenCoords;
    if (!((event != null) && (layer != null))) {
      offsetArgumentError();
    }
    e = offsetCoords(event);
    if (!((e.x != null) && (e.y != null))) {
      e = clientCoords(event);
      targetScreenCoords = layer.screenFrame;
      e.x -= targetScreenCoords.x;
      e.y -= targetScreenCoords.y;
    }
    return e;
  };

  offsetCoords = function(ev) {
    var e;
    e = Events.touchEvent(ev);
    return coords(e.offsetX, e.offsetY);
  };

  clientCoords = function(ev) {
    var e;
    e = Events.touchEvent(ev);
    return coords(e.clientX, e.clientY);
  };

  coords = function(x, y) {
    return {
      x: x,
      y: y
    };
  };

  screenArgumentError = function() {
    error(null);
    return console.error("Pointer.screen() Error: You must pass event & layer arguments. \n\nExample: layer.on Events.TouchStart,(event,layer) -> Pointer.screen(event, layer)");
  };

  offsetArgumentError = function() {
    error(null);
    return console.error("Pointer.offset() Error: You must pass event & layer arguments. \n\nExample: layer.on Events.TouchStart,(event,layer) -> Pointer.offset(event, layer)");
  };

  return Pointer;

})();


},{}],"myModule":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3RhaXR3YXlsYW5kL0RvY3VtZW50cy9DYXB0dXJpbmdUcmliYWxLbm93bGVkZ2UvVEstaVBhZC5mcmFtZXIvbW9kdWxlcy9zeW1ib2xzL1N5bWJvbC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy90YWl0d2F5bGFuZC9Eb2N1bWVudHMvQ2FwdHVyaW5nVHJpYmFsS25vd2xlZGdlL1RLLWlQYWQuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvdGFpdHdheWxhbmQvRG9jdW1lbnRzL0NhcHR1cmluZ1RyaWJhbEtub3dsZWRnZS9USy1pUGFkLmZyYW1lci9tb2R1bGVzL1BvaW50ZXIuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIFNldCBHb29nbGUgQW5hbHl0aWNzXG51c2VHQSA9IChib29sID0gdHJ1ZSkgLT5cbiAgaWYgYm9vbCBpcyB0cnVlXG4gICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ3NjcmlwdCdcbiAgICBzLnNldEF0dHJpYnV0ZSAnc3JjJywgJ2h0dHBzOi8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0YWcvanM/aWQ9VUEtMTIyMTQxNjgxLTEnXG4gICAgcy5zZXRBdHRyaWJ1dGUgJ2FzeW5jJywgJydcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkIHNcblxuICAgIHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdXG5cbiAgICB3aW5kb3cuZ3RhZyA9ICgpIC0+IFxuICAgICAgICBkYXRhTGF5ZXIucHVzaCBhcmd1bWVudHNcbiAgICB3aW5kb3cuZ3RhZyAnanMnLCBuZXcgRGF0ZSgpXG4gICAgd2luZG93Lmd0YWcgJ2NvbmZpZycsICdVQS0xMjIxNDE2ODEtMSdcblxuICAgIGlmIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzICdmcmFtZXIuY2xvdWQnXG4gICAgICAgIHdpbmRvdy5ndGFnICdldmVudCcsICdDbG91ZCcsXG4gICAgICAgICAgICAnZXZlbnRfY2F0ZWdvcnknOiAnVmlzaXRvcnMnXG4gICAgZWxzZVxuICAgICAgICB3aW5kb3cuZ3RhZyAnZXZlbnQnLCAnTm9uLUNsb3VkJyxcbiAgICAgICAgICAgICdldmVudF9jYXRlZ29yeSc6ICdWaXNpdG9ycydcblxuIyBHb29nbGUgQW5hbHl0aWNzIGlzIHR1cm5lZCBvbiBieSBkZWZhdWx0IFxuIyBKdXN0IHJlbW92ZSB0aGUgbGluZSBiZWxvdyB0byB0dXJuIGl0IG9mZiFcbnVzZUdBKHRydWUpXG5cbiMgUmVtb3ZlcyBJRHMgZnJvbSBTVkdcbnJlbW92ZUlkcyA9IChodG1sU3RyaW5nKSAtPlxuICBpZHMgPSBVdGlscy5nZXRJZEF0dHJpYnV0ZXNGcm9tU3RyaW5nKGh0bWxTdHJpbmcpXG4gIGZvciBpZCBpbiBpZHNcbiAgICBodG1sU3RyaW5nID0gaHRtbFN0cmluZy5yZXBsYWNlKC8gaWQ9XCIoLio/KVwiL2csIFwiXCIpIDtcbiAgcmV0dXJuIGh0bWxTdHJpbmdcblxuIyBDb3BpZXMgYWxsIGRlc2NlbmRhbnRzIG9mIGEgbGF5ZXJcbmNvcHlTb3VyY2VUb1RhcmdldCA9IChzb3VyY2UsIHRhcmdldCA9IGZhbHNlKSAtPlxuICBpZiBzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgIGZvciBzdWJMYXllciBpbiBzb3VyY2UuZGVzY2VuZGFudHNcbiAgICAgIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdMYXllclwiXG4gICAgICAgIGlmIHN1YkxheWVyLmh0bWw/IGFuZCBzdWJMYXllci5zdmc/XG4gICAgICAgICAgZGVsZXRlIHN1YkxheWVyLnN2Z1xuICAgICAgICBzdWJMYXllci5odG1sID0gcmVtb3ZlSWRzKHN1YkxheWVyLmh0bWwpXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXSA9IHN1YkxheWVyLmNvcHkoKVxuICAgICAgZWxzZSBpZiBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHUGF0aFwiIG9yIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdHcm91cFwiXG4gICAgICAgIHN2Z0NvcHkgPSBzdWJMYXllci5fc3ZnTGF5ZXIuY29weSgpXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXSA9IHN2Z0NvcHlcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdID0gc3ViTGF5ZXIuY29weVNpbmdsZSgpXG5cbiAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXS5uYW1lID0gc3ViTGF5ZXIubmFtZVxuXG4gICAgICBpZiBzdWJMYXllci5wYXJlbnQgaXMgc291cmNlXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXS5wYXJlbnQgPSB0YXJnZXRcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLnBhcmVudCA9IHRhcmdldFtzdWJMYXllci5wYXJlbnQubmFtZV1cblxuICAgICAgaWYgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLmNvbnN0cnVjdG9yLm5hbWUgaXNudCBcIlNWR0xheWVyXCJcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLmNvbnN0cmFpbnRWYWx1ZXMgPSBzdWJMYXllci5jb25zdHJhaW50VmFsdWVzXG4gICAgICAgIHRhcmdldFtzdWJMYXllci5uYW1lXS5sYXlvdXQoKVxuXG4gICAgICAjIENyZWF0ZSByZWZlcmVuY2UgdG8gdGhlIHN5bWJvbCBpbnN0YW5jZVxuICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLl9pbnN0YW5jZSA9IHRhcmdldFxuXG4jIENvcGllcyBkZWZhdWx0LXN0YXRlIG9mIHRhcmdldCBhbmQgYXBwbGllcyBpdCB0byB0aGUgc3ltYm9sJ3MgZGVzY2VuZGFudHNcbmNvcHlTdGF0ZXNGcm9tVGFyZ2V0ID0gKHNvdXJjZSwgdGFyZ2V0LCBzdGF0ZU5hbWUsIGFuaW1hdGlvbk9wdGlvbnMgPSBmYWxzZSwgaWdub3JlZFByb3BzID0gZmFsc2UsIHN0YXRlUHJvcHMgPSBmYWxzZSkgLT5cbiAgdGFyZ2V0cyA9IFtdXG5cbiAgZm9yIGxheWVyIGluIHRhcmdldC5kZXNjZW5kYW50c1xuICAgIGlmIGxheWVyLmNvbnN0cmFpbnRWYWx1ZXNcbiAgICAgIGxheWVyLmZyYW1lID0gVXRpbHMuY2FsY3VsYXRlTGF5b3V0RnJhbWUobGF5ZXIucGFyZW50LmZyYW1lLCBsYXllcilcbiAgICB0YXJnZXRzW2xheWVyLm5hbWVdID0gbGF5ZXJcblxuICBmb3Igc3ViTGF5ZXIgaW4gc291cmNlLmRlc2NlbmRhbnRzXG4gICAgaWYgc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCJcbiAgICAgIGRlbGV0ZSB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLnN0YXRlcy5kZWZhdWx0Lmh0bWxcblxuICAgIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCJcbiAgICAgIHN1YkxheWVyLl9zdmdMYXllci5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0gPSB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLl9zdmdMYXllci5zdGF0ZXMuZGVmYXVsdFxuXG4gICAgaWYgaWdub3JlZFByb3BzXG4gICAgICAjIENoYW5nZSB0aGUgcHJvcHMgb2YgdGhlIGRlc2NlbmRhbnRzIG9mIGEgc3ltYm9sIGluc2lkZSBjb21tb25TdGF0ZXNcbiAgICAgIGZvciBpZ25vcmVkUHJvcCwgaWdub3JlZFZhbCBvZiBpZ25vcmVkUHJvcHNcbiAgICAgICAgaWYgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5uYW1lIGlzIGlnbm9yZWRQcm9wXG4gICAgICAgICAgZm9yIGRlc2NlbmRhbnRQcm9wLCBkZXNjZW5kYW50VmFsIG9mIGlnbm9yZWRWYWxcbiAgICAgICAgICAgIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uc3RhdGVzLmRlZmF1bHRbZGVzY2VuZGFudFByb3BdID0gZGVzY2VuZGFudFZhbFxuXG4gICAgaWYgc3RhdGVQcm9wc1xuICAgICAgIyBDaGFuZ2UgdGhlIHByb3BzIG9mIHRoZSBkZXNjZW5kYW50cyBvZiBhIHN5bWJvbCBpbnNpZGUgY29tbW9uU3RhdGVzXG4gICAgICBmb3Igc3RhdGVQcm9wLCBzdGF0ZVZhbCBvZiBzdGF0ZVByb3BzXG4gICAgICAgIGlmIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0ubmFtZSBpcyBzdGF0ZVByb3BcbiAgICAgICAgICBmb3IgZGVzY2VuZGFudFByb3AsIGRlc2NlbmRhbnRWYWwgb2Ygc3RhdGVWYWxcbiAgICAgICAgICAgIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uc3RhdGVzLmRlZmF1bHRbZGVzY2VuZGFudFByb3BdID0gZGVzY2VuZGFudFZhbFxuXG4gICAgaWYgc3RhdGVOYW1lIGlzbnQgXCJkZWZhdWx0XCIgb3IgKHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCIpXG4gICAgICBzdWJMYXllci5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0gPSB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLnN0YXRlcy5kZWZhdWx0XG5cbiAgICBpZiBhbmltYXRpb25PcHRpb25zXG4gICAgICBzdWJMYXllci5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0uYW5pbWF0aW9uT3B0aW9ucyA9IGFuaW1hdGlvbk9wdGlvbnNcblxuICAgICAgIyBBbHNvIGFkZCB0aGUgYW5pbWF0aW9uT3B0aW9ucyB0byB0aGUgXCJwYXJlbnRcIiBTVkdMYXllciBvZiBhIFNWR1BhdGggb3IgU1ZHR3JvdXBcbiAgICAgIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCJcbiAgICAgICAgc3ViTGF5ZXIuX3N2Z0xheWVyLnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXS5hbmltYXRpb25PcHRpb25zID0gYW5pbWF0aW9uT3B0aW9uc1xuXG4gICAgaWYgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5jb25zdHJ1Y3Rvci5uYW1lIGlzbnQgXCJTVkdQYXRoXCIgb3IgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5jb25zdHJ1Y3Rvci5uYW1lIGlzbnQgXCJTVkdHcm91cFwiXG4gICAgICB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLmxheW91dCgpXG5cbiAgdGFyZ2V0LmRlc3Ryb3koKVxuXG5MYXllcjo6cmVwbGFjZVdpdGhTeW1ib2wgPSAoc3ltYm9sKSAtPlxuICBVdGlscy50aHJvd0luU3R1ZGlvT3JXYXJuSW5Qcm9kdWN0aW9uIFwiRXJyb3I6IGxheWVyLnJlcGxhY2VXaXRoU3ltYm9sKHN5bWJvbEluc3RhbmNlKSBpcyBkZXByZWNhdGVkIC0gdXNlIHN5bWJvbEluc3RhbmNlLnJlcGxhY2VMYXllcihsYXllcikgaW5zdGVhZC5cIlxuICAjIHN5bWJvbC5yZXBsYWNlTGF5ZXIgQFxuXG5leHBvcnRzLlN5bWJvbCA9IChsYXllciwgc3RhdGVzID0gZmFsc2UsIGV2ZW50cyA9IGZhbHNlKSAtPlxuXG4gIGNsYXNzIFN5bWJvbCBleHRlbmRzIExheWVyXG4gICAgY29uc3RydWN0b3I6IChAb3B0aW9ucyA9IHt9KSAtPlxuICAgICAgQG9wdGlvbnMueCA/PSAwXG4gICAgICBAb3B0aW9ucy55ID89IDBcbiAgICAgIEBvcHRpb25zLnJlcGxhY2VMYXllciA/PSBmYWxzZVxuICAgICAgQG9wdGlvbnMuaW5pdGlhbFN0YXRlID89IGZhbHNlXG5cbiAgICAgIGJsYWNrbGlzdCA9IFsncGFyZW50JywgJ3JlcGxhY2VMYXllciddXG4gICAgICBALmlnbm9yZWRQcm9wcyA9IHt9XG5cbiAgICAgIGZvciBrZXksIHZhbCBvZiBAb3B0aW9uc1xuICAgICAgICBALmlnbm9yZWRQcm9wc1trZXldID0gdmFsXG5cbiAgICAgIGZvciBwcm9wIGluIGJsYWNrbGlzdFxuICAgICAgICBkZWxldGUgQC5pZ25vcmVkUHJvcHNbcHJvcF1cblxuICAgICAgc3VwZXIgXy5kZWZhdWx0cyBAb3B0aW9ucywgbGF5ZXIucHJvcHNcblxuICAgICAgQC5jdXN0b21Qcm9wcyA9IEBvcHRpb25zLmN1c3RvbVByb3BzXG4gICAgICBALmluaXRpYWxTdGF0ZSA9IEBvcHRpb25zLmluaXRpYWxTdGF0ZVxuXG4gICAgICBjb3B5U291cmNlVG9UYXJnZXQobGF5ZXIsIEApXG4gICAgICBjb3B5U3RhdGVzRnJvbVRhcmdldChALCBsYXllciwgJ2RlZmF1bHQnLCBmYWxzZSwgQC5pZ25vcmVkUHJvcHMpXG5cbiAgICAgIGlmIEBvcHRpb25zLnJlcGxhY2VMYXllclxuICAgICAgICBALnJlcGxhY2VMYXllciBAb3B0aW9ucy5yZXBsYWNlTGF5ZXJcblxuICAgICAgZm9yIGNoaWxkIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgQFtjaGlsZC5uYW1lXSA9IGNoaWxkXG5cbiAgICAgICAgZm9yIGtleSwgcHJvcHMgb2YgQG9wdGlvbnNcbiAgICAgICAgICBpZiBrZXkgaXMgY2hpbGQubmFtZVxuICAgICAgICAgICAgZm9yIHByb3AsIHZhbHVlIG9mIHByb3BzXG4gICAgICAgICAgICAgIEBba2V5XVtwcm9wXSA9IHZhbHVlXG5cbiAgICAgICMgQXBwbHkgc3RhdGVzIHRvIHN5bWJvbCBpZiBzdXBwbGllZFxuICAgICAgaWYgc3RhdGVzXG4gICAgICAgIG5ld1N0YXRlcyA9IF8uY2xvbmVEZWVwKHN0YXRlcylcbiAgICAgICAgZm9yIHN0YXRlTmFtZSwgc3RhdGVQcm9wcyBvZiBuZXdTdGF0ZXNcbiAgICAgICAgICAjIEZpbHRlciBhbmltYXRpb25PcHRpb25zIG91dCBvZiBzdGF0ZXMgYW5kIGFwcGx5IHRoZW0gdG8gc3ltYm9sXG4gICAgICAgICAgaWYgc3RhdGVOYW1lIGlzIFwiYW5pbWF0aW9uT3B0aW9uc1wiXG4gICAgICAgICAgICBALmFuaW1hdGlvbk9wdGlvbnMgPSBzdGF0ZVByb3BzXG4gICAgICAgICAgICBmb3IgZGVzY2VuZGFudCBpbiBALmRlc2NlbmRhbnRzXG4gICAgICAgICAgICAgIGRlc2NlbmRhbnQuYW5pbWF0aW9uT3B0aW9ucyA9IEAuYW5pbWF0aW9uT3B0aW9uc1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmICFzdGF0ZVByb3BzLnRlbXBsYXRlXG4gICAgICAgICAgICAgIHN0YXRlUHJvcHMudGVtcGxhdGUgPSBsYXllclxuXG4gICAgICAgICAgICBALmFkZFN5bWJvbFN0YXRlKHN0YXRlTmFtZSwgc3RhdGVQcm9wcy50ZW1wbGF0ZSwgc3RhdGVQcm9wcy5hbmltYXRpb25PcHRpb25zLCBALmlnbm9yZWRQcm9wcywgc3RhdGVQcm9wcylcblxuICAgICAgIyBBcHBseSBldmVudHMgdG8gc3ltYm9sIGlmIHN1cHBsaWVkXG4gICAgICBpZiBldmVudHNcbiAgICAgICAgZm9yIHRyaWdnZXIsIGFjdGlvbiBvZiBldmVudHNcbiAgICAgICAgICAjIGlmIGV2ZW50IGxpc3RlbmVyIGlzIGFwcGxpZWQgdG8gdGhlIHN5bWJvbC1pbnN0YW5jZVxuICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbihhY3Rpb24pXG4gICAgICAgICAgICBpZiBFdmVudHNbdHJpZ2dlcl1cbiAgICAgICAgICAgICAgQG9uIEV2ZW50c1t0cmlnZ2VyXSwgYWN0aW9uXG4gICAgICAgICAgIyBpZiBldmVudCBsaXN0ZW5lciBpcyBhcHBsaWVkIHRvIGEgc3ltYm9sJ3MgZGVzY2VuZGFudFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIEBbdHJpZ2dlcl1cbiAgICAgICAgICAgICAgZm9yIHRyaWdnZXJOYW1lLCBhY3Rpb25Qcm9wcyBvZiBhY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBFdmVudHNbdHJpZ2dlck5hbWVdXG4gICAgICAgICAgICAgICAgICBAW3RyaWdnZXJdLm9uIEV2ZW50c1t0cmlnZ2VyTmFtZV0sIGFjdGlvblByb3BzXG5cbiAgICAgICMgUHJldmVudCB3ZWlyZCBnbGl0Y2hlcyBieSBzd2l0Y2hpbmcgU1ZHcyB0byBcImRlZmF1bHRcIiBzdGF0ZSBkaXJlY3RseVxuICAgICAgZm9yIGNoaWxkIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgaWYgY2hpbGQuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCIgb3IgY2hpbGQuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR1BhdGhcIiBvciBjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIlxuICAgICAgICAgIGNoaWxkLnN0YXRlU3dpdGNoIFwiZGVmYXVsdFwiXG5cbiAgICAgICMgSGFuZGxlIHRoZSBzdGF0ZVN3aXRjaCBmb3IgYWxsIGRlc2NlbmRhbnRzXG4gICAgICBALm9uIEV2ZW50cy5TdGF0ZVN3aXRjaFN0YXJ0LCAoZnJvbSwgdG8pIC0+XG4gICAgICAgIGlmIGZyb20gaXMgdG9cbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBmb3IgY2hpbGQgaW4gQC5kZXNjZW5kYW50c1xuICAgICAgICAgICMgU3BlY2lhbCBoYW5kbGluZyBmb3IgVGV4dExheWVyc1xuICAgICAgICAgIGlmIGNoaWxkLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJUZXh0TGF5ZXJcIlxuICAgICAgICAgICAgY2hpbGQuc3RhdGVzW3RvXS50ZXh0ID0gY2hpbGQudGV4dFxuICAgICAgICAgICAgY2hpbGQuc3RhdGVzW3RvXS50ZXh0QWxpZ24gPSBjaGlsZC5wcm9wcy5zdHlsZWRUZXh0T3B0aW9ucy5hbGlnbm1lbnRcblxuICAgICAgICAgICAgaWYgY2hpbGQudGVtcGxhdGUgYW5kIE9iamVjdC5rZXlzKGNoaWxkLnRlbXBsYXRlKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGNoaWxkLnN0YXRlc1t0b10udGVtcGxhdGUgPSBjaGlsZC50ZW1wbGF0ZVxuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgY2hpbGQuaW1hZ2UgYW5kIChjaGlsZC5zdGF0ZXNbdG9dLmltYWdlIGlzbnQgY2hpbGQuaW1hZ2UpXG4gICAgICAgICAgICAgIGNoaWxkLnN0YXRlc1t0b10uaW1hZ2UgPSBjaGlsZC5pbWFnZVxuXG4gICAgICAgICAgIyBLaWNrc3RhcnQgdGhlIHN0YXRlU3dpdGNoXG4gICAgICAgICAgY2hpbGQuYW5pbWF0ZSB0b1xuXG4gICAgICAjIERlc3Ryb3kgc3RhdGUgdGVtcGxhdGUgbGF5ZXJzXG4gICAgICBpZiBzdGF0ZXNcbiAgICAgICAgZm9yIHN0YXRlTmFtZSwgc3RhdGVQcm9wcyBvZiBzdGF0ZXNcbiAgICAgICAgICBpZiBzdGF0ZVByb3BzLnRlbXBsYXRlXG4gICAgICAgICAgICBzdGF0ZVByb3BzLnRlbXBsYXRlLmRlc3Ryb3koKVxuXG4gICAgICBsYXllci5kZXN0cm95KClcblxuICAgICAgIyBJZiB0aGVyZSdzIGFuIGluaXRpYWwgc3RhdGUgZGVmaW5lZCwgc3dpdGNoIHRvIGl0XG4gICAgICBpZiBAb3B0aW9ucy5pbml0aWFsU3RhdGVcbiAgICAgICAgaWYgQC5zdGF0ZXNbQG9wdGlvbnMuaW5pdGlhbFN0YXRlXVxuICAgICAgICAgIEAuc3RhdGVTd2l0Y2ggQG9wdGlvbnMuaW5pdGlhbFN0YXRlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBVdGlscy50aHJvd0luU3R1ZGlvT3JXYXJuSW5Qcm9kdWN0aW9uIFwiVGhlIHN1cHBsaWVkIGluaXRpYWxTdGF0ZSAnI3tAb3B0aW9ucy5pbml0aWFsU3RhdGV9JyBpcyB1bmRlZmluZWRcIlxuXG4gICAgIyBBZGRzIGEgbmV3IHN0YXRlXG4gICAgYWRkU3ltYm9sU3RhdGU6IChzdGF0ZU5hbWUsIHRhcmdldCwgYW5pbWF0aW9uT3B0aW9ucyA9IGZhbHNlLCBpZ25vcmVkUHJvcHMgPSBmYWxzZSwgc3RhdGVQcm9wcyA9IGZhbHNlKSAtPlxuICAgICAgbmV3VGFyZ2V0ID0gdGFyZ2V0LmNvcHkoKVxuICAgICAgdGFyZ2V0cyA9IFtdXG5cbiAgICAgIGZvciBkZXNjZW5kYW50IGluIHRhcmdldC5kZXNjZW5kYW50c1xuICAgICAgICB0YXJnZXRzW2Rlc2NlbmRhbnQubmFtZV0gPSBkZXNjZW5kYW50XG5cbiAgICAgIGZvciBkZXNjZW5kYW50IGluIG5ld1RhcmdldC5kZXNjZW5kYW50c1xuICAgICAgICBkZXNjZW5kYW50LmNvbnN0cmFpbnRWYWx1ZXMgPSB0YXJnZXRzW2Rlc2NlbmRhbnQubmFtZV0uY29uc3RyYWludFZhbHVlc1xuICAgICAgICBpZiBkZXNjZW5kYW50LmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3IgZGVzY2VuZGFudC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIlxuICAgICAgICAgIGRlc2NlbmRhbnQuc3RhdGVzLmRlZmF1bHQgPSB0YXJnZXRzW2Rlc2NlbmRhbnQubmFtZV0uc3RhdGVzLmRlZmF1bHRcblxuICAgICAgIyBSZXNpemUgdGhlIHRlbXBsYXRlIGJlZm9yZSB1c2luZyBpdHMgdmFsdWVzIHRvIHJlc3BlY3QgY29uc3RyYWludC1jaGFuZ2VzXG4gICAgICBpZiBpZ25vcmVkUHJvcHMud2lkdGhcbiAgICAgICAgbmV3VGFyZ2V0LndpZHRoID0gaWdub3JlZFByb3BzLndpZHRoXG4gICAgICBpZiBpZ25vcmVkUHJvcHMuaGVpZ2h0XG4gICAgICAgIG5ld1RhcmdldC5oZWlnaHQgPSBpZ25vcmVkUHJvcHMuaGVpZ2h0XG5cbiAgICAgICMgRGVsZXRlIHgseSBwcm9wcyBmcm9tIHRlbXBsYXRlcyBkZWZhdWx0IHN0YXRlXG4gICAgICBkZWxldGUgbmV3VGFyZ2V0LnN0YXRlcy5kZWZhdWx0W3Byb3BdIGZvciBwcm9wIGluIFsneCcsICd5J11cblxuICAgICAgIyBBcHBseSBhbGwgb3RoZXIgcHJvcHMgdGhhdCBzaG91bGQgc3RheSB0aGUgc2FtZSBmb3IgYWxsIHN0YXRlc1xuICAgICAgaWYgaWdub3JlZFByb3BzXG4gICAgICAgIGRlbGV0ZSBuZXdUYXJnZXQuc3RhdGVzLmRlZmF1bHRbcHJvcF0gZm9yIHByb3Agb2YgaWdub3JlZFByb3BzXG5cbiAgICAgIGlmIHN0YXRlUHJvcHMud2lkdGhcbiAgICAgICAgbmV3VGFyZ2V0LndpZHRoID0gc3RhdGVQcm9wcy53aWR0aFxuICAgICAgaWYgc3RhdGVQcm9wcy5oZWlnaHRcbiAgICAgICAgbmV3VGFyZ2V0LmhlaWdodCA9IHN0YXRlUHJvcHMuaGVpZ2h0XG5cbiAgICAgIGlmIHN0YXRlUHJvcHNcbiAgICAgICAgIyBDaGFuZ2UgdGhlIHByb3BzIG9mIGEgc3ltYm9sIGluc2lkZSBjb21tb25TdGF0ZXNcbiAgICAgICAgZm9yIHN0YXRlUHJvcCwgc3RhdGVWYWwgb2Ygc3RhdGVQcm9wc1xuICAgICAgICAgICMgQ2hlY2sgaWYgaXQncyBhIHByb3BlcnR5XG4gICAgICAgICAgaWYgdHlwZW9mIG5ld1RhcmdldC5wcm9wc1tzdGF0ZVByb3BdIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgIG5ld1RhcmdldC5zdGF0ZXMuZGVmYXVsdFtzdGF0ZVByb3BdID0gc3RhdGVWYWxcblxuICAgICAgICAgICAgZGVsZXRlIHN0YXRlUHJvcHNbc3RhdGVQcm9wXVxuXG4gICAgICAjIENyZWF0ZSBhIG5ldyBzdGF0ZSBmb3IgdGhlIHN5bWJvbCBhbmQgYXNzaWduIHJlbWFpbmluZyBwcm9wc1xuICAgICAgQC5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0gPSBuZXdUYXJnZXQuc3RhdGVzLmRlZmF1bHRcblxuICAgICAgIyBBc3NpZ24gYW5pbWF0aW9uT3B0aW9ucyB0byB0aGUgc3RhdGUgaWYgc3VwcGxpZWRcbiAgICAgIGlmIGFuaW1hdGlvbk9wdGlvbnNcbiAgICAgICAgQC5zdGF0ZXNbXCIje3N0YXRlTmFtZX1cIl0uYW5pbWF0aW9uT3B0aW9ucyA9IGFuaW1hdGlvbk9wdGlvbnNcblxuICAgICAgY29weVN0YXRlc0Zyb21UYXJnZXQoQCwgbmV3VGFyZ2V0LCBzdGF0ZU5hbWUsIGFuaW1hdGlvbk9wdGlvbnMsIGlnbm9yZWRQcm9wcywgc3RhdGVQcm9wcylcblxuICAgICMgT3ZlcnJpZGUgb3JpZ2luYWwgc3RhdGVTd2l0Y2ggdG8gbWFrZSBpdCB3b3JrIHdpdGggc3ltYm9sc1xuICAgIHN0YXRlU3dpdGNoOiAoc3RhdGVOYW1lKSAtPlxuXG4gICAgICAjIE1ha2UgYmFja3VwIG9mIHRoZSBvcmlnaW5hbCBhbmltYXRpb24gdGltZVxuICAgICAgaWYgQC5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zXG4gICAgICAgIGFuaW1UaW1lID0gQC5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLnRpbWVcbiAgICAgICAgYW5pbUN1cnZlID0gQC5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLmN1cnZlXG4gICAgICBlbHNlXG4gICAgICAgIGFuaW1UaW1lID0gQC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy50aW1lXG4gICAgICAgIGFuaW1DdXJ2ZSA9IEAuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMuY3VydmVcblxuICAgICAgIyBTZXQgdGhlIGFuaW1hdGlvbiB0aW1lIG9mIGFsbCBzeW1ib2wgbGF5ZXJzIHRvIHplcm9cbiAgICAgIGZvciBkZXNjIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgaWYgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zXG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLnRpbWUgPSAwLjA1XG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLmN1cnZlID0gXCJsaW5lYXJcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVzYy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy50aW1lID0gMC4wNVxuICAgICAgICAgIGRlc2Muc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMuY3VydmUgPSBcImxpbmVhclwiXG5cbiAgICAgICMgVHJpZ2dlciB0aGUgc3RhdGVTd2l0Y2hcbiAgICAgIEAuYW5pbWF0ZSBzdGF0ZU5hbWUsXG4gICAgICAgIHRpbWU6IDAuMDVcbiAgICAgICAgY3VydmU6IFwibGluZWFyXCJcblxuICAgICAgIyBSZXNldCB0aGUgYW5pbWF0aW9uIHRpbWUgdG8gdGhlIG9yaWdpbmFsIHRpbWVcbiAgICAgIGZvciBkZXNjIGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgaWYgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zXG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLnRpbWUgPSBhbmltVGltZVxuICAgICAgICAgIGRlc2Muc3RhdGVzW3N0YXRlTmFtZV0uYW5pbWF0aW9uT3B0aW9ucy5jdXJ2ZSA9IGFuaW1DdXJ2ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVzYy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy50aW1lID0gYW5pbVRpbWVcbiAgICAgICAgICBkZXNjLnN0YXRlcy5hbmltYXRpb25PcHRpb25zLmN1cnZlID0gYW5pbUN1cnZlXG5cbiAgICAjIFJlcGxhY2VtZW50IGZvciByZXBsYWNlV2l0aFN5bWJvbCgpXG4gICAgcmVwbGFjZUxheWVyOiAobGF5ZXIsIHJlc2l6ZSA9IGZhbHNlKSAtPlxuICAgICAgQC5wYXJlbnQgPSBsYXllci5wYXJlbnRcbiAgICAgIEAueCA9IGxheWVyLnhcbiAgICAgIEAueSA9IGxheWVyLnlcblxuICAgICAgaWYgcmVzaXplXG4gICAgICAgIEAud2lkdGggPSBsYXllci53aWR0aFxuICAgICAgICBALmhlaWdodCA9IGxheWVyLmhlaWdodFxuXG4gICAgICBmb3Igc3RhdGVOYW1lIGluIEAuc3RhdGVOYW1lc1xuICAgICAgICBALnN0YXRlc1tzdGF0ZU5hbWVdLnggPSBsYXllci54XG4gICAgICAgIEAuc3RhdGVzW3N0YXRlTmFtZV0ueSA9IGxheWVyLnlcblxuICAgICAgICBpZiByZXNpemVcbiAgICAgICAgICBALnN0YXRlc1tzdGF0ZU5hbWVdLndpZHRoID0gbGF5ZXIud2lkdGhcbiAgICAgICAgICBALnN0YXRlc1tzdGF0ZU5hbWVdLmhlaWdodCA9IGxheWVyLmhlaWdodFxuXG4gICAgICBsYXllci5kZXN0cm95KClcblxuIyBBIGJhY2t1cCBmb3IgdGhlIGRlcHJlY2F0ZWQgd2F5IG9mIGNhbGxpbmcgdGhlIGNsYXNzXG5leHBvcnRzLmNyZWF0ZVN5bWJvbCA9IChsYXllciwgc3RhdGVzLCBldmVudHMpIC0+IGV4cG9ydHMuU3ltYm9sKGxheWVyLCBzdGF0ZXMsIGV2ZW50cylcbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgQ3JlYXRlZCBieSBKb3JkYW4gUm9iZXJ0IERvYnNvbiBvbiAxNCBBdWd1c3QgMjAxNVxuIyBcbiMgVXNlIHRvIG5vcm1hbGl6ZSBzY3JlZW4gJiBvZmZzZXQgeCx5IHZhbHVlcyBmcm9tIGNsaWNrIG9yIHRvdWNoIGV2ZW50cy5cbiNcbiMgVG8gR2V0IFN0YXJ0ZWQuLi5cbiNcbiMgMS4gUGxhY2UgdGhpcyBmaWxlIGluIEZyYW1lciBTdHVkaW8gbW9kdWxlcyBkaXJlY3RvcnlcbiNcbiMgMi4gSW4geW91ciBwcm9qZWN0IGluY2x1ZGU6XG4jICAgICB7UG9pbnRlcn0gPSByZXF1aXJlIFwiUG9pbnRlclwiXG4jXG4jIDMuIEZvciBzY3JlZW4gY29vcmRpbmF0ZXM6IFxuIyAgICAgYnRuLm9uIEV2ZW50cy5DbGljaywgKGV2ZW50LCBsYXllcikgLT4gcHJpbnQgUG9pbnRlci5zY3JlZW4oZXZlbnQsIGxheWVyKVxuIyBcbiMgNC4gRm9yIGxheWVyIG9mZnNldCBjb29yZGluYXRlczogXG4jICAgICBidG4ub24gRXZlbnRzLkNsaWNrLCAoZXZlbnQsIGxheWVyKSAtPiBwcmludCBQb2ludGVyLm9mZnNldChldmVudCwgbGF5ZXIpXG4jXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuY2xhc3MgZXhwb3J0cy5Qb2ludGVyXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdCMgUHVibGljIE1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdEBzY3JlZW4gPSAoZXZlbnQsIGxheWVyKSAtPlxuXHRcdHNjcmVlbkFyZ3VtZW50RXJyb3IoKSB1bmxlc3MgZXZlbnQ/IGFuZCBsYXllcj9cblx0XHRlID0gb2Zmc2V0Q29vcmRzIGV2ZW50XG5cdFx0aWYgZS54IGFuZCBlLnlcblx0XHRcdCMgTW91c2UgRXZlbnRcblx0XHRcdHNjcmVlbkNvb3JkcyA9IGxheWVyLnNjcmVlbkZyYW1lXG5cdFx0XHRlLnggKz0gc2NyZWVuQ29vcmRzLnhcblx0XHRcdGUueSArPSBzY3JlZW5Db29yZHMueVxuXHRcdGVsc2Vcblx0XHRcdCMgVG91Y2ggRXZlbnRcblx0XHRcdGUgPSBjbGllbnRDb29yZHMgZXZlbnRcblx0XHRyZXR1cm4gZVxuXHRcdFx0XG5cdEBvZmZzZXQgPSAoZXZlbnQsIGxheWVyKSAtPlxuXHRcdG9mZnNldEFyZ3VtZW50RXJyb3IoKSB1bmxlc3MgZXZlbnQ/IGFuZCBsYXllcj9cblx0XHRlID0gb2Zmc2V0Q29vcmRzIGV2ZW50XG5cdFx0dW5sZXNzIGUueD8gYW5kIGUueT9cblx0XHRcdCMgVG91Y2ggRXZlbnRcblx0XHRcdGUgPSBjbGllbnRDb29yZHMgZXZlbnRcblx0XHRcdHRhcmdldFNjcmVlbkNvb3JkcyA9IGxheWVyLnNjcmVlbkZyYW1lXG5cdFx0XHRlLnggLT0gdGFyZ2V0U2NyZWVuQ29vcmRzLnhcblx0XHRcdGUueSAtPSB0YXJnZXRTY3JlZW5Db29yZHMueVxuXHRcdHJldHVybiBlXG5cdFxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBQcml2YXRlIEhlbHBlciBNZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdFxuXHRvZmZzZXRDb29yZHMgPSAoZXYpICAtPiBlID0gRXZlbnRzLnRvdWNoRXZlbnQgZXY7IHJldHVybiBjb29yZHMgZS5vZmZzZXRYLCBlLm9mZnNldFlcblx0Y2xpZW50Q29vcmRzID0gKGV2KSAgLT4gZSA9IEV2ZW50cy50b3VjaEV2ZW50IGV2OyByZXR1cm4gY29vcmRzIGUuY2xpZW50WCwgZS5jbGllbnRZXG5cdGNvb3JkcyAgICAgICA9ICh4LHkpIC0+IHJldHVybiB4OngsIHk6eVxuXHRcblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdCMgRXJyb3IgSGFuZGxlciBNZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHRcblx0c2NyZWVuQXJndW1lbnRFcnJvciA9IC0+XG5cdFx0ZXJyb3IgbnVsbFxuXHRcdGNvbnNvbGUuZXJyb3IgXCJcIlwiXG5cdFx0XHRQb2ludGVyLnNjcmVlbigpIEVycm9yOiBZb3UgbXVzdCBwYXNzIGV2ZW50ICYgbGF5ZXIgYXJndW1lbnRzLiBcXG5cblx0XHRcdEV4YW1wbGU6IGxheWVyLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LChldmVudCxsYXllcikgLT4gUG9pbnRlci5zY3JlZW4oZXZlbnQsIGxheWVyKVwiXCJcIlxuXHRcdFx0XG5cdG9mZnNldEFyZ3VtZW50RXJyb3IgPSAtPlxuXHRcdGVycm9yIG51bGxcblx0XHRjb25zb2xlLmVycm9yIFwiXCJcIlxuXHRcdFx0UG9pbnRlci5vZmZzZXQoKSBFcnJvcjogWW91IG11c3QgcGFzcyBldmVudCAmIGxheWVyIGFyZ3VtZW50cy4gXFxuXG5cdFx0XHRFeGFtcGxlOiBsYXllci5vbiBFdmVudHMuVG91Y2hTdGFydCwoZXZlbnQsbGF5ZXIpIC0+IFBvaW50ZXIub2Zmc2V0KGV2ZW50LCBsYXllcilcIlwiXCIiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0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
