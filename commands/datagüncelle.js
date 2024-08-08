const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('datagüncelle')
        .setDescription('Mevcut hesap bilgilerini günceller')
        .addStringOption(option => option.setName('isim').setDescription('Güncellenecek hesap ismi').setRequired(true))
        .addStringOption(option => option.setName('şifre').setDescription('Yeni şifre (opsiyonel)'))
        .addStringOption(option => option.setName('dünya').setDescription('Yeni dünya adı (opsiyonel)'))
        .addIntegerOption(option => option.setName('x').setDescription('Yeni X koordinatı (opsiyonel)'))
        .addIntegerOption(option => option.setName('y').setDescription('Yeni Y koordinatı (opsiyonel)'))
        .addIntegerOption(option => option.setName('z').setDescription('Yeni Z koordinatı (opsiyonel)')),
    async execute(interaction) {
        if (!checkOwnerPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok. Sadece owner rolüne sahip kullanıcılar bu komutu kullanabilir.', ephemeral: true });
        }

        const isim = interaction.options.getString('isim');
        const yeniŞifre = interaction.options.getString('şifre');
        const yeniDünya = interaction.options.getString('dünya');
        const yeniX = interaction.options.getInteger('x');
        const yeniY = interaction.options.getInteger('y');
        const yeniZ = interaction.options.getInteger('z');

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

        let güncellemeler = [];

        if (yeniŞifre) {
            data[hesapIndex].şifre = yeniŞifre;
            güncellemeler.push('Şifre');
        }

        if (yeniDünya) {
            data[hesapIndex].dünya = yeniDünya;
            güncellemeler.push('Dünya');
        }

        if (yeniX !== null) {
            data[hesapIndex].x = yeniX;
            güncellemeler.push('X koordinatı');
        }

        if (yeniY !== null) {
            data[hesapIndex].y = yeniY;
            güncellemeler.push('Y koordinatı');
        }

        if (yeniZ !== null) {
            data[hesapIndex].z = yeniZ;
            güncellemeler.push('Z koordinatı');
        }

        if (güncellemeler.length === 0) {
            return interaction.reply({ content: 'Hiçbir güncelleme yapılmadı.', ephemeral: true });
        }

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Hesap Bilgileri Güncellendi')
            .addFields(
                { name: 'Hesap İsmi', value: isim, inline: true },
                { name: 'Güncellenen Bilgiler', value: güncellemeler.join(', '), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Güncelleme işlemi tamamlandı' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
