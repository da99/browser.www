
if (typeof window !== 'undefined') {
  window.document.querySelector("#Spec_Stage").innerHTML = "All specs <span class=\"passed\">PASSED</span>.";
}

// try {

//   Dum_Dum_Boom_Boom.common.spec.spec(function (msg) {
//     "use strict";
//     alite({url: "/all-specs-pass", method: "POST", data: msg}).then(
//       function (result) {
//         var dt = new Date();
//         Dum_Dum_Boom_Boom.common.spec.spec.default_msg(msg);
//         Dum_Dum_Boom_Boom.common.base.log(dt.toLocaleString('en-US'));
//       }
//     ).catch(function (err) {
//       Dum_Dum_Boom_Boom.common.base.log(err);
//     });
//   });

// } catch (e) {

//   alite(
//     {
//       url: "/client-error-to-stdout",
//       method: "POST",
//       data: {
//         stack: e.stack,
//         message: e.message
//       }
//     }
//   );

//   throw e;
// }

