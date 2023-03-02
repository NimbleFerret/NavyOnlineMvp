"use strict";
exports.__esModule = true;
function default_1(job, cb) {
    console.log("[".concat(process.pid, "] ").concat(JSON.stringify(job.data)));
    cb(null, 'It works');
}
exports["default"] = default_1;
