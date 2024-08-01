const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { checkBotOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolsil')
        .setDescription('Owner veya Mod rol ID\'sini siler')
        .addStringOption(option => 
            option.setName('tip')
                .setDescription('Silinecek rol tipi')
                .setRequired(true)
                .addChoices(
                    { name: 'Owner', value: 'owner' },
                    { name: 'Mod', value: 'mod' }
                )),
    async execute(interaction) {
        if (!checkBotOwnerPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
        }

        const tip = interaction.options.getString('tip');

        let config;
        try {
            config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        } catch (error) {
            console.error('Config dosyası okuma hatası:', error);
            return interaction.reply({ content: 'Yapılandırma dosyası okunamadı.', ephemeral: true });
        }

        let message;
        if (tip === 'owner') {
            if (!config.ownerRoleId) {
                message = 'Owner rolü silinmiş ya da ayarlanmamış.';
            } else {
                config.ownerRoleId = '';
                message = 'Owner rolü başarıyla silindi.';
            }
        } else if (tip === 'mod') {
            if (!config.modRoleId) {
                message = 'Mod rolü silinmiş ya da ayarlanmamış.';
            } else {
                config.modRoleId = '';
                message = 'Mod rolü başarıyla silindi.';
            }
        }

        try {
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Config dosyası yazma hatası:', error);
            return interaction.reply({ content: 'Yapılandırma dosyası güncellenemedi.', ephemeral: true });
        }

        await interaction.reply({ content: message, ephemeral: true });
    },
};