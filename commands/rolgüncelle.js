const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { checkBotOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolgüncelle')
        .setDescription('Owner veya Mod rol ID\'sini günceller')
        .addStringOption(option => 
            option.setName('tip')
                .setDescription('Güncellenecek rol tipi')
                .setRequired(true)
                .addChoices(
                    { name: 'Owner', value: 'owner' },
                    { name: 'Mod', value: 'mod' }
                ))
        .addRoleOption(option => 
            option.setName('rol')
                .setDescription('Yeni rol')
                .setRequired(true)),
    async execute(interaction) {
        if (!checkBotOwnerPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
        }

        const tip = interaction.options.getString('tip');
        const yeniRol = interaction.options.getRole('rol');

        let config;
        try {
            config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        } catch (error) {
            console.error('Config dosyası okuma hatası:', error);
            return interaction.reply({ content: 'Yapılandırma dosyası okunamadı.', ephemeral: true });
        }

        if (tip === 'owner') {
            config.ownerRoleId = yeniRol.id;
        } else if (tip === 'mod') {
            config.modRoleId = yeniRol.id;
        }

        try {
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Config dosyası yazma hatası:', error);
            return interaction.reply({ content: 'Yapılandırma dosyası güncellenemedi.', ephemeral: true });
        }

        await interaction.reply({ content: `${tip.charAt(0).toUpperCase() + tip.slice(1)} rolü başarıyla güncellendi. Yeni Rol ID: ${yeniRol.id}`, ephemeral: true });
    },
};