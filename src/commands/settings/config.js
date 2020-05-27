
const Discord = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Discord.Client} client Client
     * @param {Discord.Message} message Message
     * @param {Array} args Arguments
     */
    run: async function (client, message, [action, key, ...value]) {
        const db = message.guild.db;
        if (action === 'view') {
            let embed = new Discord.MessageEmbed()
                .setColor(0x00FFFF)
                .setTimestamp();
            switch (key) {
                case '2': {
                    const inviteFilter = await db.filters('inviteFilter') ? 'ON' : 'OFF';
                    const mentionSpamFilter = await db.filters('mentionSpamFilter') ? 'ON' : 'OFF';
                    const swearFilter = await db.filters('swearFilter') ? 'ON' : 'OFF';
                    embed.setFooter('Page 2 of 4', message.guild.iconURL() || client.user.displayAvatarURL())
                        .addField('Key', `
                    \`inviteFilter\`
                    \`swearFilter\`
                    \`mentionSpamFilter\`
                    `, true)
                        .addField('Value', `
                    \`${inviteFilter}\`
                    \`${swearFilter}\`
                    \`${mentionSpamFilter}\`
                    `, true);
                    break;
                }
                case '3': {
                    const welcomeChannel = await db.welcomer('channel') ? `<#${await db.welcomer('channel')}>` : '\`none\`';
                    const welcomeMessage = await db.welcomer('message');
                    const welcomer = await db.welcomer('enabled') ? 'ON' : 'OFF';
                    const leaveChannel = await db.leaver('channel') ? `<#${await db.leaver('channel')}>` : '\`none\`';
                    const leaveMessage = await db.leaver('message');
                    const leaver = await db.leaver('enabled') ? 'ON' : 'OFF';
                    embed.setFooter('Page 3 of 4', message.guild.iconURL() || client.user.displayAvatarURL())
                        .addField('Key', `
                    \`welcomer\`
                    \`welcomeChannel\`
                    \`welcomeMessage\`
                    \`farewell\`
                    \`farewellChannel\`
                    \`farewellMessage\`
                    `, true)
                        .addField('Value', `
                    \`${welcomer}\`
                    ${welcomeChannel}
                    \`${welcomeMessage}\`
                    \`${leaver}\`
                    ${leaveChannel}
                    \`${leaveMessage}\`
                    `, true);
                    break;
                }
                case '4': {
                    const memberVerification = await db.verification('enabled') ? 'ON' : 'OFF';
                    const verificationChannel = await db.verification('channel') ? `<#${await db.verification('channel')}>` : '\`none\`';
                    const verifiedRole = await db.verification('role') ? `<@&${await db.verification('role')}>` : '\`none\`';
                    const verificationType = await db.verification('type');
                    const ticketSystem = await db.ticket('enabled') ? 'ON' : 'OFF';
                    const ticketCategory = await db.ticket('category') ? `<#${await db.ticket('category')}>` : '\`none\`';
                    embed.setFooter('Page 4 of 4', message.guild.iconURL() || client.user.displayAvatarURL())
                        .addField('Key', `
                    \`memberVerification\`
                    \`verificationChannel\`
                    \`verifiedRole\`
                    \`verificationType\`
                    \`ticketSystem\`
                    \`ticketCategory\`
                    `, true)
                        .addField('Value', `
                    \`${memberVerification}\`
                    ${verificationChannel}
                    ${verifiedRole}
                    \`${verificationType}\`
                    \`${ticketSystem}\`
                    ${ticketCategory}
                    `, true)
                    break;
                }
                case '1':
                default: {
                    const prefix = await db.settings('prefix');
                    const moderatorRole = await db.moderation('moderatorRole') ? `<@&${await db.moderation('moderatorRole')}>` : '\`none\`';
                    const adminRole = await db.moderation('adminRole') ? `<@&${await db.moderation('adminRole')}>` : '\`none\`';
                    const mutedRole = await db.moderation('mutedRole') ? `<@&${await db.moderation('mutedRole')}>` : '\`none\`';
                    const modLogChannel = await db.moderation('modLogChannel') ? `<#${await db.moderation('modLogChannel')}>` : '\`none\`';
                    const autoModeration = await db.moderation('autoModeration') ? 'ON' : 'OFF';
                    const autoModAction = `${await db.moderation('autoModAction')} MEMBER`;
                    const maxWarnTreshold = await db.moderation('maxWarnTreshold');
                    const warnActionExpiresOn = await db.moderation('warnActionExpiresOn') ? await db.moderation('warnActionExpiresOn').toHumanString() : '0s';
                    const warningExpiresOn = await db.moderation('warningExpiresOn') ? await db.moderation('warningExpiresOn').toHumanString() : '0s';
                    embed.addField('Key', `
                    \`prefix\`
                    \`moderatorRole\`
                    \`adminRole\`
                    \`mutedRole\`
                    \`modLogChannel\`
                    \`autoModeration\`
                    \`autoModAction\`
                    \`maxWarnTreshold\`
                    \`warnActionExpiresOn\`
                    \`warningExpiresOn\`
                    `, true)
                        .addField('Value', `
                    \`${prefix}\`
                    ${moderatorRole}
                    ${adminRole}
                    ${mutedRole}
                    ${modLogChannel}
                    \`${autoModeration}\`
                    \`${autoModAction}\`
                    \`${maxWarnTreshold}\`
                    \`${warnActionExpiresOn}\`
                    \`${warningExpiresOn}\`
                    `, true).setFooter('Page 1 of 4', message.guild.iconURL() || client.user.displayAvatarURL());
                    break;
                }
            }
            return message.channel.send(embed);
        } else if (action === 'reset') {
            switch (key) {
                case 'all': {
                    const yn = await client.awaitReply(message, 'Are you sure to reset Unicron\'s configurations for this server (yes/no)? _You have 15 seconds to comply_', 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    Promise.all([db.destroy(false, false)]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s configurations for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'prefix': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.settings(true);
                    settings.prefix = '?';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'welcomeChannel': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.welcomer(true);
                    settings.channel = '';
                    settings.enabled = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'welcomeMessage': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.welcomer(true);
                    settings.message = 'Welcome {user} to the server!';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'farewellChannel': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.leaver(true);
                    settings.channel = '';
                    settings.enabled = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'farewellMessage': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.leaver(true);
                    settings.message = '{user} has left the server.';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'modLogChannel': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.modLogChannel = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'moderatorRole': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.moderatorRole = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'adminRole': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.adminRole = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'mutedRole': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.mutedRole = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'autoModeration': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.autoModeration = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'autoModAction': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.autoModAction = 'WARN';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'maxWarnTreshold': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.maxWarnTreshold = Number(0);
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'warnActionExpiresOn': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.warnActionExpiresOn = Number(0);
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'warningExpiresOn': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.moderation(true);
                    settings.autoModeration = Number(0);
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'memberVerification': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.verification(true);
                    settings.enabled = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'verificationChannel': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.verification(true);
                    settings.enabled = false;
                    settings.channel = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'verifiedRole': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.verification(true);
                    settings.enabled = false;
                    settings.role = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'verificationType': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.verification(true);
                    settings.type = 'discrim';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'ticketSystem': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.ticket(true);
                    settings.enabled = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'ticketCategory': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.ticket(true);
                    settings.enabled = false;
                    settings.category = '';
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'inviteFilter': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.filters(true);
                    settings.inviteFilter = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'swearFilter': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.filters(true);
                    settings.swearFilter = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'mentionSpamFilter': {
                    const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
                    if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
                    const settings = await db.filters(true);
                    settings.mentionSpamFilter = false;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully reseted Unicron\'s \`${key}\` for this server.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on reseting settings for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while reseting.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                default: {
                    return message.channel.send(new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription('Error: Invalid Arguments')
                    );
                }
            }
        } else if (action === 'set') {
            switch (key) {
                case 'prefix': {
                    if (value[0].length > 3) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription('Error: Prefix length must not exceed 3 characters.')
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.settings(true);
                    settings.prefix = value[0];
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to \`${value[0]}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'welcomeMessage': {
                    if (!value.join(' ').includes('{user}')) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription('Error: Missing placeholder \`{user}\`')
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const v = value.join(' ');
                    const settings = await db.welcomer(true);
                    settings.message = v;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to \`${v}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'farewellMessage': {
                    if (!value.join(' ').includes('{user}')) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription('Error: Missing placeholder \`{user}\`')
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const v = value.join(' ');
                    const settings = await db.leaver(true);
                    settings.message = v;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to \`${v}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'moderatorRole':
                case 'adminRole':
                case 'mutedRole': {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(value[0]) || message.guild.roles.cache.find(r => r.name === value[0]);
                    if (!role) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [RoleMention|RoleID|RoleName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.moderation(true);
                    settings[key] = role.id;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <@&${role.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'verifiedRole': {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(value[0]) || message.guild.roles.cache.find(r => r.name === value[0]);
                    if (!role) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [RoleMention|RoleID|RoleName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.verification(true);
                    settings.role = role.id;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <@&${role.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'welcomeChannel': {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(value[0]) || message.guild.channels.cache.find(c => c.name === value[0]);
                    if (!channel) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [ChannelMention|ChannelID|ChannelName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    if (channel.type !== 'text') {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: That is not a text channel`)
                        );
                    }
                    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: Unicron doesn't have access to that channel`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.welcomer(true);
                    settings.channel = channel.id;
                    Promise.all([await settings.save()]).then(() => {
                        channel.send(`${key} synced`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <#${channel.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'farewellChannel': {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(value[0]) || message.guild.channels.cache.find(c => c.name === value[0]);
                    if (!channel) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [ChannelMention|ChannelID|ChannelName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    if (channel.type !== 'text') {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: That is not a text channel`)
                        );
                    }
                    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: Unicron doesn't have access to that channel`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.leaver(true);
                    settings.channel = channel.id;
                    Promise.all([await settings.save()]).then(() => {
                        channel.send(`${key} synced`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <#${channel.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'modLogChannel': {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(value[0]) || message.guild.channels.cache.find(c => c.name === value[0]);
                    if (!channel) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [ChannelMention|ChannelID|ChannelName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: Unicron doesn't have access to that channel`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.moderation(true);
                    settings.modLogChannel = channel.id;
                    Promise.all([await settings.save()]).then(() => {
                        channel.send(`${key} synced`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <#${channel.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'verificationChannel': {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(value[0]) || message.guild.channels.cache.find(c => c.name === value[0]);
                    if (!channel) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [ChannelMention|ChannelID|ChannelName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    if (channel.type !== 'text') {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: That is not a text channel`)
                        );
                    }
                    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: Unicron doesn't have access to that channel : SEND_MESSAGES, MANAGE_MESSAGES`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.verification(true);
                    settings.channel = channel.id;
                    Promise.all([await settings.save()]).then(() => {
                        channel.send(`${key} synced`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <#${channel.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'ticketCategory': {
                    const channel = message.guild.channels.cache.get(value[0]) || message.guild.channels.cache.find(c => c.name === value[0]);
                    if (!channel) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [CategoryID|CategoryName]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    if (channel.type !== 'category') {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: That is not a category`)
                        );
                    }
                    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS'])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Error: Unicron doesn't have access to that category.
                            Unicron must have SEND_MESSAGES | MANAGE_MESSAGES | MANAGE_CHANNELS permission(s)`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const settings = await db.ticket(true);
                    settings.category = channel.id;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to <#${channel.id}>.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                case 'autoModeration': {
                    if (!['on', 'off'].includes(value[0])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [on|off]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const bool = (value[0] === 'on') ? true : false;
                    const settings = await db.moderation(true);
                    settings.autoModeration = bool;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to \`${bool ? 'on' : 'off'}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                /**
                 * numbers + string
                 */
                case 'swearFilter':
                case 'mentionSpamFilter':
                case 'inviteFilter': {
                    if (!['on', 'off'].includes(value[0])) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`Incorrect Arguments: Use \`config set ${key} [on|off]\``)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }
                    const bool = (value[0] === 'on') ? true : false;
                    const settings = await db.filters(true);
                    settings[key] = bool;
                    Promise.all([await settings.save()]).then(() => {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`Successfully set \`${key}\` to \`${bool ? 'on' : 'off'}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    }).catch(e => {
                        client.logger.error(`Error on setting configurations for ${message.guild.name}/${message.guild.id} : ${e}`);
                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`An error occured while setting \`${key}\`.`)
                            .setTimestamp()
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                        );
                    });
                    break;
                }
                default: {
                    return message.channel.send(new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription('Error: Invalid Arguments')
                    );
                }
            }
        }
    },
    config: {
        name: 'config',
        description: 'Configure Unicron\'s settings for this server.',
        permission: 'Server Administrator',
    },
    options: {
        aliases: ['conf'],
        cooldown: 3,
        nsfwCommand: false,
        args: true,
        usage: 'config view\nconfig view [page]\nconfig set [key] [value]\nconfig reset\nconfig reset [key]',
        donatorOnly: false,
    }
}