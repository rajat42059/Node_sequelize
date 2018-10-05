const password_generator = require("password-generator");
const md5 = require("md5");

exports.tokenize = function(text) {
    return md5(md5(text) + password_generator(4, true));
};

function md5Function(text) {
    return md5(md5(text));
}
exports.md5Function = md5Function;


exports.getDateWithHyphens = function(date) {
    if (date) {
        date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year + "-" + month + "-" + day;
    }
    return null;
};

function updateSessionExpiry(device_id, user_id) {
    var session_expiry = new Date();
    session_expiry.setMinutes(session_expiry.getMinutes() + 30);
    if (device_id) {
        var sql = "UPDATE `user_device` SET `session_expiry` = ? WHERE `device_id` = ? LIMIT 1";
        connection.query(sql, [session_expiry, device_id], function(err) {
            if (err) {
                console.log(err);
            }
        });
    } else if (user_id) {
        var sql = "UPDATE `user_device` SET `session_expiry` = ? WHERE `user_id` = ? LIMIT 1";
        connection.query(sql, [session_expiry, user_id], function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.updateSessionExpiry = updateSessionExpiry;