import VirtualBuddy from "@/assets/virtualBuddy";
import Vue from "vue";

let vb = new VirtualBuddy({
  scrollbar:{
    color: 'blue'
  }
});

Vue.directive("window", {
  bind: function(el, binding) {
    vb.addWindow(el);
  }
});

Vue.directive("page", {
  inserted: function(el, binding) {
    vb.load()
  }
});

Vue.directive("section", {
  bind: function(el, binding, test) {
    vb.addSection(el, binding.value);
  },
  unbind: function(el){
    vb.removeSection(el)
  }
});

Vue.directive("element", {
  bind: function(el, binding) {
    vb.addElement(el, binding.value);
  },
  unbind: function(el){
    vb.removeElement(el)
  }
});

Object.defineProperty(Vue.prototype, "$virtualbuddy", {value: vb});
