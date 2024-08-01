const { botOwnerId, ownerRoleId, modRoleId } = require('../config.json');

function checkBotOwnerPermission(interaction) {
    return interaction.user.id === botOwnerId;
}

function checkOwnerPermission(interaction) {
    return interaction.member.roles.cache.has(ownerRoleId) || checkBotOwnerPermission(interaction);
}

function checkModPermission(interaction) {
    return interaction.member.roles.cache.has(modRoleId) || checkOwnerPermission(interaction);
}

module.exports = { checkBotOwnerPermission, checkOwnerPermission, checkModPermission };