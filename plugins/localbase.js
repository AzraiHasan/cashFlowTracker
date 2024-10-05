// plugins/localbase.ts
import { defineNuxtPlugin } from "#app";
import Localbase from "localbase";

let db = new Localbase("db");

export default defineNuxtPlugin(() => {
  return {
    provide: {
      db,
    },
  };
});
