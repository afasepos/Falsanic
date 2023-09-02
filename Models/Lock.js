const { model, Schema } = require("mongoose");

let LockdownSchema = new Schema({
    GuildID: String,
    ChannelD: String,
    Time: String
})

module.exports = model("Lock", LockdownSchema)