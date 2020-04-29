import VirtualBuddy from "@/assets/virtualBuddy";
import Vue from "vue";

let vb = new VirtualBuddy()

Object.defineProperty(Vue.prototype, "$vb", {value: vb});
