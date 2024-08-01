const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { authorizedUsers } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('şifre')
        .setDescription('Hesap şifresini gösterir')
        .addStringOption(option => option.setName('isim').setDescription('Hesap ismi').setRequired(true)),
    async execute(interaction) {
        if (!authorizedUsers.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', ephemeral: true });
        }

        const isim = interaction.options.getString('isim');

        let data = [];
        try {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
            return interaction.reply({ content: 'Veri okuma hatası oluştu.', ephemeral: true });
        }

        const account = data.find(item => item.isim === isim);

        if (account) {
            await interaction.reply({ content: `${isim} hesabının şifresi: ${account.şifre}`, ephemeral: true });
        } else {
            await interaction.reply({ content: `${isim} için kayıtlı hesap bulunamadı.`, ephemeral: true });
        }
    },
};