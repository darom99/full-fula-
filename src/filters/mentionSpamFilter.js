
const { Message, MessageEmbed } = require('discord.js');
const AutoModeration = require('../modules/AutoModeration');
const Client = require('../classes/Unicron');
/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const status = await message.guild.db.filters('mentionSpamFilter');
            const strat = (status && (message.author.permLevel < 2) && ((message.mentions.users.size > 6) || (message.mentions.roles.size > 6))) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) message.delete();
            message.channel.send(`Don't mention too many people! ${message.author}.`)
                .then(msg => msg.delete({ timeout: 5000}));
            const mChannel = message.guild.channels.resolve(await message.guild.db.moderation('modLogChannel'));
            if (mChannel) {
                mChannel.send(new MessageEmbed()
                    .setTimestamp()
                    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle('Mention Spam Blocker')
                    .setDescription(`Member: ${message.author.tag} / ${message.author.id}`)
                );
            }
            await AutoModeration(client, message);
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}