const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('datasil')
        .setDescription('Belirtilen hesabı sistemden siler')
        .addStringOption(option => 
            option.setName('isim')
                .setDescription('Silinecek hesabın ismi')
                .setRequired(true)),
    async execute(interaction) {
        if (!checkOwnerPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok. Sadece owner rolüne sahip kullanıcılar bu komutu kullanabilir.', ephemeral: true });
        }

        const isim = interaction.options.getString('isim');

        let data = [];
        try {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
            return interaction.reply({ content: 'Veri okuma hatası oluştu.', ephemeral: true });
        }

        const hesapIndex = data.findIndex(item => item.isim === isim);
        if (hesapIndex === -1) {
            return interaction.reply({ content: `"${isim}" isimli hesap bulunamadı.`, ephemeral: true });
        }

        const silinecekHesap = data[hesapIndex];
        data.splice(hesapIndex, 1);

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Hesap Başarıyla Silindi')
            .addFields(
                { name: 'Hesap İsmi', value: silinecekHesap.isim, inline: true },
                { name: 'Dünya', value: silinecekHesap.dünya, inline: true },
                { name: 'Koordinatlar', value: `X: ${silinecekHesap.x}, Y: ${silinecekHesap.y}, Z: ${silinecekHesap.z}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};