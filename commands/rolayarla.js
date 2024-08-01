const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { checkBotOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayarlaroller')
        .setDescription('Owner ve Mod rol ID\'lerini ayarlar')
        .addRoleOption(option => option.setName('owner').setDescription('Owner rolü').setRequired(true))
        .addRoleOption(option => option.setName('mod').setDescription('Mod rolü').setRequired(true)),
    async execute(interaction) {
        if (!checkBotOwnerPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
        }

        const ownerRole = interaction.options.getRole('owner');
        const modRole = interaction.options.getRole('mod');

        let config;
        try {
            config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        } catch (error) {
            console.error('Config dosyası okuma hatası:', error);
            return interaction.reply({ content: 'Yapılandırma dosyası okunamadı.', ephemeral: true });
        }

        config.ownerRoleId = ownerRole.id;
        config.modRoleId = modRole.id;

        try {
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Config dosyası yazma hatası:', error);
            return interaction.reply({ content: 'Yapılandırma dosyası güncellenemedi.', ephemeral: true });
        }

        await interaction.reply({ content: `Roller başarıyla ayarlandı:\nOwner Rol ID: ${ownerRole.id}\nMod Rol ID: ${modRole.id}`, ephemeral: true });
    },
};