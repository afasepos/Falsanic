const { GiveawaysManager } = require("discord-giveaways");
const giveawayModel = require("../Models/giveawaySchema.js");

module.exports = (client) => {
    const GiveawayManagerWithOwnDatase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return await giveawayModel.find().lean().exec();
        }

        async saveGiveaway(messageId, giveawayData) {
            await giveawayModel.create(giveawayData);
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
            return true;
        }

        async deleteGiveaway(messageId, giveawayData) {
            await giveawayModel.deleteOne( { messageId }).exec();
            return true;
        }
    };

    const manager = new GiveawayManagerWithOwnDatase(client, {
        default: {
            botsCanWin: false,
            embedColor: '#FF0000',
            embedColorEnd:  '#FF0000',
            reaction: client.giveawayConfig.giveawayManager.reaction
        }
    });
    client.giveawaysManager = manager;
}