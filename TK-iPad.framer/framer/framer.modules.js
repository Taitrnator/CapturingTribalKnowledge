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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3RhaXR3YXlsYW5kL0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9jb21+YXBwbGV+Q2xvdWREb2NzL1RLLWlQYWQuZnJhbWVyL21vZHVsZXMvc3ltYm9scy9TeW1ib2wuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvdGFpdHdheWxhbmQvTGlicmFyeS9Nb2JpbGUgRG9jdW1lbnRzL2NvbX5hcHBsZX5DbG91ZERvY3MvVEstaVBhZC5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgU2V0IEdvb2dsZSBBbmFseXRpY3NcbnVzZUdBID0gKGJvb2wgPSB0cnVlKSAtPlxuICBpZiBib29sIGlzIHRydWVcbiAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnc2NyaXB0J1xuICAgIHMuc2V0QXR0cmlidXRlICdzcmMnLCAnaHR0cHM6Ly93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RhZy9qcz9pZD1VQS0xMjIxNDE2ODEtMSdcbiAgICBzLnNldEF0dHJpYnV0ZSAnYXN5bmMnLCAnJ1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQgc1xuXG4gICAgd2luZG93LmRhdGFMYXllciA9IHdpbmRvdy5kYXRhTGF5ZXIgfHwgW11cblxuICAgIHdpbmRvdy5ndGFnID0gKCkgLT4gXG4gICAgICAgIGRhdGFMYXllci5wdXNoIGFyZ3VtZW50c1xuICAgIHdpbmRvdy5ndGFnICdqcycsIG5ldyBEYXRlKClcbiAgICB3aW5kb3cuZ3RhZyAnY29uZmlnJywgJ1VBLTEyMjE0MTY4MS0xJ1xuXG4gICAgaWYgd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMgJ2ZyYW1lci5jbG91ZCdcbiAgICAgICAgd2luZG93Lmd0YWcgJ2V2ZW50JywgJ0Nsb3VkJyxcbiAgICAgICAgICAgICdldmVudF9jYXRlZ29yeSc6ICdWaXNpdG9ycydcbiAgICBlbHNlXG4gICAgICAgIHdpbmRvdy5ndGFnICdldmVudCcsICdOb24tQ2xvdWQnLFxuICAgICAgICAgICAgJ2V2ZW50X2NhdGVnb3J5JzogJ1Zpc2l0b3JzJ1xuXG4jIEdvb2dsZSBBbmFseXRpY3MgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQgXG4jIEp1c3QgcmVtb3ZlIHRoZSBsaW5lIGJlbG93IHRvIHR1cm4gaXQgb2ZmIVxudXNlR0EodHJ1ZSlcblxuIyBSZW1vdmVzIElEcyBmcm9tIFNWR1xucmVtb3ZlSWRzID0gKGh0bWxTdHJpbmcpIC0+XG4gIGlkcyA9IFV0aWxzLmdldElkQXR0cmlidXRlc0Zyb21TdHJpbmcoaHRtbFN0cmluZylcbiAgZm9yIGlkIGluIGlkc1xuICAgIGh0bWxTdHJpbmcgPSBodG1sU3RyaW5nLnJlcGxhY2UoLyBpZD1cIiguKj8pXCIvZywgXCJcIikgO1xuICByZXR1cm4gaHRtbFN0cmluZ1xuXG4jIENvcGllcyBhbGwgZGVzY2VuZGFudHMgb2YgYSBsYXllclxuY29weVNvdXJjZVRvVGFyZ2V0ID0gKHNvdXJjZSwgdGFyZ2V0ID0gZmFsc2UpIC0+XG4gIGlmIHNvdXJjZS5jaGlsZHJlbi5sZW5ndGggPiAwXG4gICAgZm9yIHN1YkxheWVyIGluIHNvdXJjZS5kZXNjZW5kYW50c1xuICAgICAgaWYgc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0xheWVyXCJcbiAgICAgICAgaWYgc3ViTGF5ZXIuaHRtbD8gYW5kIHN1YkxheWVyLnN2Zz9cbiAgICAgICAgICBkZWxldGUgc3ViTGF5ZXIuc3ZnXG4gICAgICAgIHN1YkxheWVyLmh0bWwgPSByZW1vdmVJZHMoc3ViTGF5ZXIuaHRtbClcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdID0gc3ViTGF5ZXIuY29weSgpXG4gICAgICBlbHNlIGlmIHN1YkxheWVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdQYXRoXCIgb3Igc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR0dyb3VwXCJcbiAgICAgICAgc3ZnQ29weSA9IHN1YkxheWVyLl9zdmdMYXllci5jb3B5KClcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdID0gc3ZnQ29weVxuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXRbc3ViTGF5ZXIubmFtZV0gPSBzdWJMYXllci5jb3B5U2luZ2xlKClcblxuICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLm5hbWUgPSBzdWJMYXllci5uYW1lXG5cbiAgICAgIGlmIHN1YkxheWVyLnBhcmVudCBpcyBzb3VyY2VcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLnBhcmVudCA9IHRhcmdldFxuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXRbc3ViTGF5ZXIubmFtZV0ucGFyZW50ID0gdGFyZ2V0W3N1YkxheWVyLnBhcmVudC5uYW1lXVxuXG4gICAgICBpZiB0YXJnZXRbc3ViTGF5ZXIubmFtZV0uY29uc3RydWN0b3IubmFtZSBpc250IFwiU1ZHTGF5ZXJcIlxuICAgICAgICB0YXJnZXRbc3ViTGF5ZXIubmFtZV0uY29uc3RyYWludFZhbHVlcyA9IHN1YkxheWVyLmNvbnN0cmFpbnRWYWx1ZXNcbiAgICAgICAgdGFyZ2V0W3N1YkxheWVyLm5hbWVdLmxheW91dCgpXG5cbiAgICAgICMgQ3JlYXRlIHJlZmVyZW5jZSB0byB0aGUgc3ltYm9sIGluc3RhbmNlXG4gICAgICB0YXJnZXRbc3ViTGF5ZXIubmFtZV0uX2luc3RhbmNlID0gdGFyZ2V0XG5cbiMgQ29waWVzIGRlZmF1bHQtc3RhdGUgb2YgdGFyZ2V0IGFuZCBhcHBsaWVzIGl0IHRvIHRoZSBzeW1ib2wncyBkZXNjZW5kYW50c1xuY29weVN0YXRlc0Zyb21UYXJnZXQgPSAoc291cmNlLCB0YXJnZXQsIHN0YXRlTmFtZSwgYW5pbWF0aW9uT3B0aW9ucyA9IGZhbHNlLCBpZ25vcmVkUHJvcHMgPSBmYWxzZSwgc3RhdGVQcm9wcyA9IGZhbHNlKSAtPlxuICB0YXJnZXRzID0gW11cblxuICBmb3IgbGF5ZXIgaW4gdGFyZ2V0LmRlc2NlbmRhbnRzXG4gICAgaWYgbGF5ZXIuY29uc3RyYWludFZhbHVlc1xuICAgICAgbGF5ZXIuZnJhbWUgPSBVdGlscy5jYWxjdWxhdGVMYXlvdXRGcmFtZShsYXllci5wYXJlbnQuZnJhbWUsIGxheWVyKVxuICAgIHRhcmdldHNbbGF5ZXIubmFtZV0gPSBsYXllclxuXG4gIGZvciBzdWJMYXllciBpbiBzb3VyY2UuZGVzY2VuZGFudHNcbiAgICBpZiBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHTGF5ZXJcIlxuICAgICAgZGVsZXRlIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uc3RhdGVzLmRlZmF1bHQuaHRtbFxuXG4gICAgaWYgc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR1BhdGhcIiBvciBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIlxuICAgICAgc3ViTGF5ZXIuX3N2Z0xheWVyLnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXSA9IHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uX3N2Z0xheWVyLnN0YXRlcy5kZWZhdWx0XG5cbiAgICBpZiBpZ25vcmVkUHJvcHNcbiAgICAgICMgQ2hhbmdlIHRoZSBwcm9wcyBvZiB0aGUgZGVzY2VuZGFudHMgb2YgYSBzeW1ib2wgaW5zaWRlIGNvbW1vblN0YXRlc1xuICAgICAgZm9yIGlnbm9yZWRQcm9wLCBpZ25vcmVkVmFsIG9mIGlnbm9yZWRQcm9wc1xuICAgICAgICBpZiB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLm5hbWUgaXMgaWdub3JlZFByb3BcbiAgICAgICAgICBmb3IgZGVzY2VuZGFudFByb3AsIGRlc2NlbmRhbnRWYWwgb2YgaWdub3JlZFZhbFxuICAgICAgICAgICAgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5zdGF0ZXMuZGVmYXVsdFtkZXNjZW5kYW50UHJvcF0gPSBkZXNjZW5kYW50VmFsXG5cbiAgICBpZiBzdGF0ZVByb3BzXG4gICAgICAjIENoYW5nZSB0aGUgcHJvcHMgb2YgdGhlIGRlc2NlbmRhbnRzIG9mIGEgc3ltYm9sIGluc2lkZSBjb21tb25TdGF0ZXNcbiAgICAgIGZvciBzdGF0ZVByb3AsIHN0YXRlVmFsIG9mIHN0YXRlUHJvcHNcbiAgICAgICAgaWYgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5uYW1lIGlzIHN0YXRlUHJvcFxuICAgICAgICAgIGZvciBkZXNjZW5kYW50UHJvcCwgZGVzY2VuZGFudFZhbCBvZiBzdGF0ZVZhbFxuICAgICAgICAgICAgdGFyZ2V0c1tzdWJMYXllci5uYW1lXS5zdGF0ZXMuZGVmYXVsdFtkZXNjZW5kYW50UHJvcF0gPSBkZXNjZW5kYW50VmFsXG5cbiAgICBpZiBzdGF0ZU5hbWUgaXNudCBcImRlZmF1bHRcIiBvciAoc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR1BhdGhcIiBvciBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIiBvciBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHTGF5ZXJcIilcbiAgICAgIHN1YkxheWVyLnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXSA9IHRhcmdldHNbc3ViTGF5ZXIubmFtZV0uc3RhdGVzLmRlZmF1bHRcblxuICAgIGlmIGFuaW1hdGlvbk9wdGlvbnNcbiAgICAgIHN1YkxheWVyLnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXS5hbmltYXRpb25PcHRpb25zID0gYW5pbWF0aW9uT3B0aW9uc1xuXG4gICAgICAjIEFsc28gYWRkIHRoZSBhbmltYXRpb25PcHRpb25zIHRvIHRoZSBcInBhcmVudFwiIFNWR0xheWVyIG9mIGEgU1ZHUGF0aCBvciBTVkdHcm91cFxuICAgICAgaWYgc3ViTGF5ZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR1BhdGhcIiBvciBzdWJMYXllci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHR3JvdXBcIlxuICAgICAgICBzdWJMYXllci5fc3ZnTGF5ZXIuc3RhdGVzW1wiI3tzdGF0ZU5hbWV9XCJdLmFuaW1hdGlvbk9wdGlvbnMgPSBhbmltYXRpb25PcHRpb25zXG5cbiAgICBpZiB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLmNvbnN0cnVjdG9yLm5hbWUgaXNudCBcIlNWR1BhdGhcIiBvciB0YXJnZXRzW3N1YkxheWVyLm5hbWVdLmNvbnN0cnVjdG9yLm5hbWUgaXNudCBcIlNWR0dyb3VwXCJcbiAgICAgIHRhcmdldHNbc3ViTGF5ZXIubmFtZV0ubGF5b3V0KClcblxuICB0YXJnZXQuZGVzdHJveSgpXG5cbkxheWVyOjpyZXBsYWNlV2l0aFN5bWJvbCA9IChzeW1ib2wpIC0+XG4gIFV0aWxzLnRocm93SW5TdHVkaW9Pcldhcm5JblByb2R1Y3Rpb24gXCJFcnJvcjogbGF5ZXIucmVwbGFjZVdpdGhTeW1ib2woc3ltYm9sSW5zdGFuY2UpIGlzIGRlcHJlY2F0ZWQgLSB1c2Ugc3ltYm9sSW5zdGFuY2UucmVwbGFjZUxheWVyKGxheWVyKSBpbnN0ZWFkLlwiXG4gICMgc3ltYm9sLnJlcGxhY2VMYXllciBAXG5cbmV4cG9ydHMuU3ltYm9sID0gKGxheWVyLCBzdGF0ZXMgPSBmYWxzZSwgZXZlbnRzID0gZmFsc2UpIC0+XG5cbiAgY2xhc3MgU3ltYm9sIGV4dGVuZHMgTGF5ZXJcbiAgICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zID0ge30pIC0+XG4gICAgICBAb3B0aW9ucy54ID89IDBcbiAgICAgIEBvcHRpb25zLnkgPz0gMFxuICAgICAgQG9wdGlvbnMucmVwbGFjZUxheWVyID89IGZhbHNlXG4gICAgICBAb3B0aW9ucy5pbml0aWFsU3RhdGUgPz0gZmFsc2VcblxuICAgICAgYmxhY2tsaXN0ID0gWydwYXJlbnQnLCAncmVwbGFjZUxheWVyJ11cbiAgICAgIEAuaWdub3JlZFByb3BzID0ge31cblxuICAgICAgZm9yIGtleSwgdmFsIG9mIEBvcHRpb25zXG4gICAgICAgIEAuaWdub3JlZFByb3BzW2tleV0gPSB2YWxcblxuICAgICAgZm9yIHByb3AgaW4gYmxhY2tsaXN0XG4gICAgICAgIGRlbGV0ZSBALmlnbm9yZWRQcm9wc1twcm9wXVxuXG4gICAgICBzdXBlciBfLmRlZmF1bHRzIEBvcHRpb25zLCBsYXllci5wcm9wc1xuXG4gICAgICBALmN1c3RvbVByb3BzID0gQG9wdGlvbnMuY3VzdG9tUHJvcHNcbiAgICAgIEAuaW5pdGlhbFN0YXRlID0gQG9wdGlvbnMuaW5pdGlhbFN0YXRlXG5cbiAgICAgIGNvcHlTb3VyY2VUb1RhcmdldChsYXllciwgQClcbiAgICAgIGNvcHlTdGF0ZXNGcm9tVGFyZ2V0KEAsIGxheWVyLCAnZGVmYXVsdCcsIGZhbHNlLCBALmlnbm9yZWRQcm9wcylcblxuICAgICAgaWYgQG9wdGlvbnMucmVwbGFjZUxheWVyXG4gICAgICAgIEAucmVwbGFjZUxheWVyIEBvcHRpb25zLnJlcGxhY2VMYXllclxuXG4gICAgICBmb3IgY2hpbGQgaW4gQC5kZXNjZW5kYW50c1xuICAgICAgICBAW2NoaWxkLm5hbWVdID0gY2hpbGRcblxuICAgICAgICBmb3Iga2V5LCBwcm9wcyBvZiBAb3B0aW9uc1xuICAgICAgICAgIGlmIGtleSBpcyBjaGlsZC5uYW1lXG4gICAgICAgICAgICBmb3IgcHJvcCwgdmFsdWUgb2YgcHJvcHNcbiAgICAgICAgICAgICAgQFtrZXldW3Byb3BdID0gdmFsdWVcblxuICAgICAgIyBBcHBseSBzdGF0ZXMgdG8gc3ltYm9sIGlmIHN1cHBsaWVkXG4gICAgICBpZiBzdGF0ZXNcbiAgICAgICAgbmV3U3RhdGVzID0gXy5jbG9uZURlZXAoc3RhdGVzKVxuICAgICAgICBmb3Igc3RhdGVOYW1lLCBzdGF0ZVByb3BzIG9mIG5ld1N0YXRlc1xuICAgICAgICAgICMgRmlsdGVyIGFuaW1hdGlvbk9wdGlvbnMgb3V0IG9mIHN0YXRlcyBhbmQgYXBwbHkgdGhlbSB0byBzeW1ib2xcbiAgICAgICAgICBpZiBzdGF0ZU5hbWUgaXMgXCJhbmltYXRpb25PcHRpb25zXCJcbiAgICAgICAgICAgIEAuYW5pbWF0aW9uT3B0aW9ucyA9IHN0YXRlUHJvcHNcbiAgICAgICAgICAgIGZvciBkZXNjZW5kYW50IGluIEAuZGVzY2VuZGFudHNcbiAgICAgICAgICAgICAgZGVzY2VuZGFudC5hbmltYXRpb25PcHRpb25zID0gQC5hbmltYXRpb25PcHRpb25zXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgIXN0YXRlUHJvcHMudGVtcGxhdGVcbiAgICAgICAgICAgICAgc3RhdGVQcm9wcy50ZW1wbGF0ZSA9IGxheWVyXG5cbiAgICAgICAgICAgIEAuYWRkU3ltYm9sU3RhdGUoc3RhdGVOYW1lLCBzdGF0ZVByb3BzLnRlbXBsYXRlLCBzdGF0ZVByb3BzLmFuaW1hdGlvbk9wdGlvbnMsIEAuaWdub3JlZFByb3BzLCBzdGF0ZVByb3BzKVxuXG4gICAgICAjIEFwcGx5IGV2ZW50cyB0byBzeW1ib2wgaWYgc3VwcGxpZWRcbiAgICAgIGlmIGV2ZW50c1xuICAgICAgICBmb3IgdHJpZ2dlciwgYWN0aW9uIG9mIGV2ZW50c1xuICAgICAgICAgICMgaWYgZXZlbnQgbGlzdGVuZXIgaXMgYXBwbGllZCB0byB0aGUgc3ltYm9sLWluc3RhbmNlXG4gICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uKGFjdGlvbilcbiAgICAgICAgICAgIGlmIEV2ZW50c1t0cmlnZ2VyXVxuICAgICAgICAgICAgICBAb24gRXZlbnRzW3RyaWdnZXJdLCBhY3Rpb25cbiAgICAgICAgICAjIGlmIGV2ZW50IGxpc3RlbmVyIGlzIGFwcGxpZWQgdG8gYSBzeW1ib2wncyBkZXNjZW5kYW50XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgQFt0cmlnZ2VyXVxuICAgICAgICAgICAgICBmb3IgdHJpZ2dlck5hbWUsIGFjdGlvblByb3BzIG9mIGFjdGlvblxuICAgICAgICAgICAgICAgIGlmIEV2ZW50c1t0cmlnZ2VyTmFtZV1cbiAgICAgICAgICAgICAgICAgIEBbdHJpZ2dlcl0ub24gRXZlbnRzW3RyaWdnZXJOYW1lXSwgYWN0aW9uUHJvcHNcblxuICAgICAgIyBQcmV2ZW50IHdlaXJkIGdsaXRjaGVzIGJ5IHN3aXRjaGluZyBTVkdzIHRvIFwiZGVmYXVsdFwiIHN0YXRlIGRpcmVjdGx5XG4gICAgICBmb3IgY2hpbGQgaW4gQC5kZXNjZW5kYW50c1xuICAgICAgICBpZiBjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHTGF5ZXJcIiBvciBjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiU1ZHUGF0aFwiIG9yIGNoaWxkLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdHcm91cFwiXG4gICAgICAgICAgY2hpbGQuc3RhdGVTd2l0Y2ggXCJkZWZhdWx0XCJcblxuICAgICAgIyBIYW5kbGUgdGhlIHN0YXRlU3dpdGNoIGZvciBhbGwgZGVzY2VuZGFudHNcbiAgICAgIEAub24gRXZlbnRzLlN0YXRlU3dpdGNoU3RhcnQsIChmcm9tLCB0bykgLT5cbiAgICAgICAgaWYgZnJvbSBpcyB0b1xuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGZvciBjaGlsZCBpbiBALmRlc2NlbmRhbnRzXG4gICAgICAgICAgIyBTcGVjaWFsIGhhbmRsaW5nIGZvciBUZXh0TGF5ZXJzXG4gICAgICAgICAgaWYgY2hpbGQuY29uc3RydWN0b3IubmFtZSBpcyBcIlRleHRMYXllclwiXG4gICAgICAgICAgICBjaGlsZC5zdGF0ZXNbdG9dLnRleHQgPSBjaGlsZC50ZXh0XG4gICAgICAgICAgICBjaGlsZC5zdGF0ZXNbdG9dLnRleHRBbGlnbiA9IGNoaWxkLnByb3BzLnN0eWxlZFRleHRPcHRpb25zLmFsaWdubWVudFxuXG4gICAgICAgICAgICBpZiBjaGlsZC50ZW1wbGF0ZSBhbmQgT2JqZWN0LmtleXMoY2hpbGQudGVtcGxhdGUpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgY2hpbGQuc3RhdGVzW3RvXS50ZW1wbGF0ZSA9IGNoaWxkLnRlbXBsYXRlXG5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBjaGlsZC5pbWFnZSBhbmQgKGNoaWxkLnN0YXRlc1t0b10uaW1hZ2UgaXNudCBjaGlsZC5pbWFnZSlcbiAgICAgICAgICAgICAgY2hpbGQuc3RhdGVzW3RvXS5pbWFnZSA9IGNoaWxkLmltYWdlXG5cbiAgICAgICAgICAjIEtpY2tzdGFydCB0aGUgc3RhdGVTd2l0Y2hcbiAgICAgICAgICBjaGlsZC5hbmltYXRlIHRvXG5cbiAgICAgICMgRGVzdHJveSBzdGF0ZSB0ZW1wbGF0ZSBsYXllcnNcbiAgICAgIGlmIHN0YXRlc1xuICAgICAgICBmb3Igc3RhdGVOYW1lLCBzdGF0ZVByb3BzIG9mIHN0YXRlc1xuICAgICAgICAgIGlmIHN0YXRlUHJvcHMudGVtcGxhdGVcbiAgICAgICAgICAgIHN0YXRlUHJvcHMudGVtcGxhdGUuZGVzdHJveSgpXG5cbiAgICAgIGxheWVyLmRlc3Ryb3koKVxuXG4gICAgICAjIElmIHRoZXJlJ3MgYW4gaW5pdGlhbCBzdGF0ZSBkZWZpbmVkLCBzd2l0Y2ggdG8gaXRcbiAgICAgIGlmIEBvcHRpb25zLmluaXRpYWxTdGF0ZVxuICAgICAgICBpZiBALnN0YXRlc1tAb3B0aW9ucy5pbml0aWFsU3RhdGVdXG4gICAgICAgICAgQC5zdGF0ZVN3aXRjaCBAb3B0aW9ucy5pbml0aWFsU3RhdGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFV0aWxzLnRocm93SW5TdHVkaW9Pcldhcm5JblByb2R1Y3Rpb24gXCJUaGUgc3VwcGxpZWQgaW5pdGlhbFN0YXRlICcje0BvcHRpb25zLmluaXRpYWxTdGF0ZX0nIGlzIHVuZGVmaW5lZFwiXG5cbiAgICAjIEFkZHMgYSBuZXcgc3RhdGVcbiAgICBhZGRTeW1ib2xTdGF0ZTogKHN0YXRlTmFtZSwgdGFyZ2V0LCBhbmltYXRpb25PcHRpb25zID0gZmFsc2UsIGlnbm9yZWRQcm9wcyA9IGZhbHNlLCBzdGF0ZVByb3BzID0gZmFsc2UpIC0+XG4gICAgICBuZXdUYXJnZXQgPSB0YXJnZXQuY29weSgpXG4gICAgICB0YXJnZXRzID0gW11cblxuICAgICAgZm9yIGRlc2NlbmRhbnQgaW4gdGFyZ2V0LmRlc2NlbmRhbnRzXG4gICAgICAgIHRhcmdldHNbZGVzY2VuZGFudC5uYW1lXSA9IGRlc2NlbmRhbnRcblxuICAgICAgZm9yIGRlc2NlbmRhbnQgaW4gbmV3VGFyZ2V0LmRlc2NlbmRhbnRzXG4gICAgICAgIGRlc2NlbmRhbnQuY29uc3RyYWludFZhbHVlcyA9IHRhcmdldHNbZGVzY2VuZGFudC5uYW1lXS5jb25zdHJhaW50VmFsdWVzXG4gICAgICAgIGlmIGRlc2NlbmRhbnQuY29uc3RydWN0b3IubmFtZSBpcyBcIlNWR1BhdGhcIiBvciBkZXNjZW5kYW50LmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJTVkdHcm91cFwiXG4gICAgICAgICAgZGVzY2VuZGFudC5zdGF0ZXMuZGVmYXVsdCA9IHRhcmdldHNbZGVzY2VuZGFudC5uYW1lXS5zdGF0ZXMuZGVmYXVsdFxuXG4gICAgICAjIFJlc2l6ZSB0aGUgdGVtcGxhdGUgYmVmb3JlIHVzaW5nIGl0cyB2YWx1ZXMgdG8gcmVzcGVjdCBjb25zdHJhaW50LWNoYW5nZXNcbiAgICAgIGlmIGlnbm9yZWRQcm9wcy53aWR0aFxuICAgICAgICBuZXdUYXJnZXQud2lkdGggPSBpZ25vcmVkUHJvcHMud2lkdGhcbiAgICAgIGlmIGlnbm9yZWRQcm9wcy5oZWlnaHRcbiAgICAgICAgbmV3VGFyZ2V0LmhlaWdodCA9IGlnbm9yZWRQcm9wcy5oZWlnaHRcblxuICAgICAgIyBEZWxldGUgeCx5IHByb3BzIGZyb20gdGVtcGxhdGVzIGRlZmF1bHQgc3RhdGVcbiAgICAgIGRlbGV0ZSBuZXdUYXJnZXQuc3RhdGVzLmRlZmF1bHRbcHJvcF0gZm9yIHByb3AgaW4gWyd4JywgJ3knXVxuXG4gICAgICAjIEFwcGx5IGFsbCBvdGhlciBwcm9wcyB0aGF0IHNob3VsZCBzdGF5IHRoZSBzYW1lIGZvciBhbGwgc3RhdGVzXG4gICAgICBpZiBpZ25vcmVkUHJvcHNcbiAgICAgICAgZGVsZXRlIG5ld1RhcmdldC5zdGF0ZXMuZGVmYXVsdFtwcm9wXSBmb3IgcHJvcCBvZiBpZ25vcmVkUHJvcHNcblxuICAgICAgaWYgc3RhdGVQcm9wcy53aWR0aFxuICAgICAgICBuZXdUYXJnZXQud2lkdGggPSBzdGF0ZVByb3BzLndpZHRoXG4gICAgICBpZiBzdGF0ZVByb3BzLmhlaWdodFxuICAgICAgICBuZXdUYXJnZXQuaGVpZ2h0ID0gc3RhdGVQcm9wcy5oZWlnaHRcblxuICAgICAgaWYgc3RhdGVQcm9wc1xuICAgICAgICAjIENoYW5nZSB0aGUgcHJvcHMgb2YgYSBzeW1ib2wgaW5zaWRlIGNvbW1vblN0YXRlc1xuICAgICAgICBmb3Igc3RhdGVQcm9wLCBzdGF0ZVZhbCBvZiBzdGF0ZVByb3BzXG4gICAgICAgICAgIyBDaGVjayBpZiBpdCdzIGEgcHJvcGVydHlcbiAgICAgICAgICBpZiB0eXBlb2YgbmV3VGFyZ2V0LnByb3BzW3N0YXRlUHJvcF0gaXNudCAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgbmV3VGFyZ2V0LnN0YXRlcy5kZWZhdWx0W3N0YXRlUHJvcF0gPSBzdGF0ZVZhbFxuXG4gICAgICAgICAgICBkZWxldGUgc3RhdGVQcm9wc1tzdGF0ZVByb3BdXG5cbiAgICAgICMgQ3JlYXRlIGEgbmV3IHN0YXRlIGZvciB0aGUgc3ltYm9sIGFuZCBhc3NpZ24gcmVtYWluaW5nIHByb3BzXG4gICAgICBALnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXSA9IG5ld1RhcmdldC5zdGF0ZXMuZGVmYXVsdFxuXG4gICAgICAjIEFzc2lnbiBhbmltYXRpb25PcHRpb25zIHRvIHRoZSBzdGF0ZSBpZiBzdXBwbGllZFxuICAgICAgaWYgYW5pbWF0aW9uT3B0aW9uc1xuICAgICAgICBALnN0YXRlc1tcIiN7c3RhdGVOYW1lfVwiXS5hbmltYXRpb25PcHRpb25zID0gYW5pbWF0aW9uT3B0aW9uc1xuXG4gICAgICBjb3B5U3RhdGVzRnJvbVRhcmdldChALCBuZXdUYXJnZXQsIHN0YXRlTmFtZSwgYW5pbWF0aW9uT3B0aW9ucywgaWdub3JlZFByb3BzLCBzdGF0ZVByb3BzKVxuXG4gICAgIyBPdmVycmlkZSBvcmlnaW5hbCBzdGF0ZVN3aXRjaCB0byBtYWtlIGl0IHdvcmsgd2l0aCBzeW1ib2xzXG4gICAgc3RhdGVTd2l0Y2g6IChzdGF0ZU5hbWUpIC0+XG5cbiAgICAgICMgTWFrZSBiYWNrdXAgb2YgdGhlIG9yaWdpbmFsIGFuaW1hdGlvbiB0aW1lXG4gICAgICBpZiBALnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnNcbiAgICAgICAgYW5pbVRpbWUgPSBALnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnMudGltZVxuICAgICAgICBhbmltQ3VydmUgPSBALnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnMuY3VydmVcbiAgICAgIGVsc2VcbiAgICAgICAgYW5pbVRpbWUgPSBALnN0YXRlcy5hbmltYXRpb25PcHRpb25zLnRpbWVcbiAgICAgICAgYW5pbUN1cnZlID0gQC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy5jdXJ2ZVxuXG4gICAgICAjIFNldCB0aGUgYW5pbWF0aW9uIHRpbWUgb2YgYWxsIHN5bWJvbCBsYXllcnMgdG8gemVyb1xuICAgICAgZm9yIGRlc2MgaW4gQC5kZXNjZW5kYW50c1xuICAgICAgICBpZiBkZXNjLnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnNcbiAgICAgICAgICBkZXNjLnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnMudGltZSA9IDAuMDVcbiAgICAgICAgICBkZXNjLnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnMuY3VydmUgPSBcImxpbmVhclwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZXNjLnN0YXRlcy5hbmltYXRpb25PcHRpb25zLnRpbWUgPSAwLjA1XG4gICAgICAgICAgZGVzYy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucy5jdXJ2ZSA9IFwibGluZWFyXCJcblxuICAgICAgIyBUcmlnZ2VyIHRoZSBzdGF0ZVN3aXRjaFxuICAgICAgQC5hbmltYXRlIHN0YXRlTmFtZSxcbiAgICAgICAgdGltZTogMC4wNVxuICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuXG4gICAgICAjIFJlc2V0IHRoZSBhbmltYXRpb24gdGltZSB0byB0aGUgb3JpZ2luYWwgdGltZVxuICAgICAgZm9yIGRlc2MgaW4gQC5kZXNjZW5kYW50c1xuICAgICAgICBpZiBkZXNjLnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnNcbiAgICAgICAgICBkZXNjLnN0YXRlc1tzdGF0ZU5hbWVdLmFuaW1hdGlvbk9wdGlvbnMudGltZSA9IGFuaW1UaW1lXG4gICAgICAgICAgZGVzYy5zdGF0ZXNbc3RhdGVOYW1lXS5hbmltYXRpb25PcHRpb25zLmN1cnZlID0gYW5pbUN1cnZlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZXNjLnN0YXRlcy5hbmltYXRpb25PcHRpb25zLnRpbWUgPSBhbmltVGltZVxuICAgICAgICAgIGRlc2Muc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMuY3VydmUgPSBhbmltQ3VydmVcblxuICAgICMgUmVwbGFjZW1lbnQgZm9yIHJlcGxhY2VXaXRoU3ltYm9sKClcbiAgICByZXBsYWNlTGF5ZXI6IChsYXllciwgcmVzaXplID0gZmFsc2UpIC0+XG4gICAgICBALnBhcmVudCA9IGxheWVyLnBhcmVudFxuICAgICAgQC54ID0gbGF5ZXIueFxuICAgICAgQC55ID0gbGF5ZXIueVxuXG4gICAgICBpZiByZXNpemVcbiAgICAgICAgQC53aWR0aCA9IGxheWVyLndpZHRoXG4gICAgICAgIEAuaGVpZ2h0ID0gbGF5ZXIuaGVpZ2h0XG5cbiAgICAgIGZvciBzdGF0ZU5hbWUgaW4gQC5zdGF0ZU5hbWVzXG4gICAgICAgIEAuc3RhdGVzW3N0YXRlTmFtZV0ueCA9IGxheWVyLnhcbiAgICAgICAgQC5zdGF0ZXNbc3RhdGVOYW1lXS55ID0gbGF5ZXIueVxuXG4gICAgICAgIGlmIHJlc2l6ZVxuICAgICAgICAgIEAuc3RhdGVzW3N0YXRlTmFtZV0ud2lkdGggPSBsYXllci53aWR0aFxuICAgICAgICAgIEAuc3RhdGVzW3N0YXRlTmFtZV0uaGVpZ2h0ID0gbGF5ZXIuaGVpZ2h0XG5cbiAgICAgIGxheWVyLmRlc3Ryb3koKVxuXG4jIEEgYmFja3VwIGZvciB0aGUgZGVwcmVjYXRlZCB3YXkgb2YgY2FsbGluZyB0aGUgY2xhc3NcbmV4cG9ydHMuY3JlYXRlU3ltYm9sID0gKGxheWVyLCBzdGF0ZXMsIGV2ZW50cykgLT4gZXhwb3J0cy5TeW1ib2wobGF5ZXIsIHN0YXRlcywgZXZlbnRzKVxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBv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
