const Base = require('./Base');
const { Model } = require('sequelize');
const {
    GuildSettings,
    GuildDynamicVoice,
    GuildFilter,
    GuildLeave,
    GuildWelcome,
    GuildModeration,
    GuildTags,
    GuildTicket,
    GuildVerification,
    GuildMember,
} = require('../database/database.js');

module.exports = class Guild extends Base {
    /**
     * 
     * @param {String} id 
     * @param {Map<String, Model>} data
     */
    constructor(id, data) {
        super(id);
        this.data = data;
    }
    /**
     * 
     * @brief Reset/Delete Guild's Data from Unicron's Database
     */
    async destroy(includeTags = true, includeMembers = true) {
        if (includeTags) await this.tags({ action: 'reset' });
        if (includeMembers) await GuildMember.destroy({ where: { guild_id: this.id } });
        await GuildSettings.destroy({ where: { guild_id: this.id } });
        await GuildModeration.destroy({ where: { guild_id: this.id } });
        await GuildTicket.destroy({ where: { guild_id: this.id } });
        await GuildFilter.destroy({ where: { guild_id: this.id } });
        await GuildWelcome.destroy({ where: { guild_id: this.id } });
        await GuildLeave.destroy({ where: { guild_id: this.id } });
        await GuildVerification.destroy({ where: { guild_id: this.id } });
        await GuildDynamicVoice.destroy({ where: { guild_id: this.id } });
    }
    /**
     * Values:
     * * prefix
     * * premium
     * * data
     * @param {String|Boolean} value Search value
     * @returns {String|JSON}
     */
    settings(value) {
        const retval = this.data.get('GuildSettings');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * category
     * * waitingRoom
     * * data
     * * enabled
     * @param {String|Boolean} value Search value
     * @returns {String|JSON}
     * 
     */
    dynamicVoice(value) {
        const retval = this.data.get('GuildDynamicVoice');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * channel
     * * role
     * * type
     * * enabled
     * @param {String|Boolean} value Search value
     * @returns {String|JSON}
     */
    verification(value) {
        const retval = this.data.get('GuildVerification');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * category
     * * data
     * * enabled
     * @param {String|Boolean} value Search value
     * @returns {Promise<String>|Promise<Object>}
     */
    ticket(value) {
        const retval = this.data.get('GuildTicket');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * data
     * * moderatorRole
     * * adminRole
     * * mutedRole
     * * modLogChannel
     * * autoModeration
     * * autoModAction
     * * maxWarnTreshhold
     * * warnTresholdAction
     * * warnActionExpiresOn
     * * warningExpiresOn
     * @param {String|Boolean} value Search value
     * @returns {Promise<String>|Promise<Object>}
     */
    moderation(value) {
        const retval = this.data.get('GuildModeration');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * inviteFilter
     * * swearFilter
     * * mentionSpamFilter
     * * data
     * @param {String|Boolean} value Search value
     * @returns {String|JSON}
     */
    filters(value) {
        const retval = this.data.get('GuildFilter');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * channel
     * * message
     * * enabled
     * @param {String|Boolean} value Search value
     * @returns {String|JSON}
     */
    welcomer(value) {
        const retval = this.data.get('GuildWelcome');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * Values:
     * * channel
     * * message
     * * enabled
     * @param {String|Boolean} value Search value
     * @returns {String|JSON}
     */
    leaver(value) {
        const retval = this.data.get('GuildLeave');
        return typeof value === 'boolean' ? retval : retval[value];
    }
    /**
     * 
     * @param {Object} options Options
     * @returns {Promise<String>}
     * 
     * Actions:
     * * fetch
     * * create
     * * edit
     * * remove
     * * reset
     * 
     * ```js
     * // Examples
     * const tagValue = await message.guild.db.tags({ action: 'fetch', name: 'test'});
     * const tags = await message.guild.db.tags;
     * await message.guild.db.tags({ action: 'create', name: 'test', value: 'jhahjajh hka'});
     * await message.guild.db.tags({ action: 'edit', name: 'test', newValue: 'LOLOLOL'});
     * await message.guild.db.tags({ action: 'remove', name: 'test'});
     * ```
     */
    tags(options) {
        return new Promise(async (resolve, reject) => {
            if (options) {
                switch (options.action) {
                    case 'create': {
                        if (!options.value || !options.name) {
                            return resolve('Sorry, you need provide a name and description to create a tag');
                        }
                        try {
                            const tag = await GuildTags.create({
                                guild_id: this.id,
                                tag_name: options.name,
                                value: options.value,
                            });
                            return resolve(`Tag \`${tag.tag_name}\` has been created.`);
                        } catch (err) {
                            if (err.name === 'SequelizeUniqueConstraintError') {
                                return resolve(`Sorry, A tag with that name already exists.`);
                            }
                            return resolve('Sorry, something went wrong creating that tag.');
                        }
                    }
                    case 'edit': {
                        if (!options.newValue || !options.name) return resolve('Sorry, you need to provide the name and description to edit a tag');
                        const affectedRows = await GuildTags.update(
                            { value: options.newValue }, {
                            where: {
                                guild_id: this.id,
                                tag_name: options.name
                            }
                        }
                        );
                        if (affectedRows > 0) return resolve(`Tag \`${options.name}\` was edited.`);
                        return resolve('Sorry, That tag doesn\'t seem to exists');
                    }
                    case 'remove': {
                        if (!options.name) return resolve('Sorry, you need to provide the tag name to delete it.');
                        const rowCount = await GuildTags.destroy({ where: { guild_id: this.id, tag_name: options.name } });
                        if (!rowCount) return resolve('Sorry, That tag doesn\'t seem to exists');
                        return resolve(`Tag \`${options.name}\` has been deleted.`);
                    }
                    case 'reset': {
                        return resolve(await GuildTags.destroy({ where: { guild_id: this.id } }));
                    }
                    case 'fetch': {
                        const tag = await GuildTags.findOne({ where: { guild_id: this.id, tag_name: options.name, } });
                        if (tag) return resolve(tag.get('value'));
                        return resolve('[TAG_DOESNT_EXISTS]');
                    }
                    default: {
                        break;
                    }
                }
            }
            const taglist = await GuildTags.findAll({ where: { guild_id: this.id } });
            return resolve(`\`${taglist.map(t => t.tag_name).join('\`, \`') || 'No tags set.'}\``);
        });
    }
}