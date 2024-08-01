const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hesaplar')
        .setDescription('Kayıtlı hesapların listesini gösterir')
        .addStringOption(option => 
            option.setName('dünya')
                .setDescription('Belirli bir dünyadaki hesapları listeler (opsiyonel)')
                .setRequired(false)),
    async execute(interaction) {
        if (!checkOwnerPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok. Sadece owner rolüne sahip kullanıcılar bu komutu kullanabilir.', ephemeral: true });
        }

        const seçilenDünya = interaction.options.getString('dünya');

        let data = [];
        try {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
            return interaction.reply({ content: 'Veri okuma hatası oluştu.', ephemeral: true });
        }

        if (seçilenDünya) {
            data = data.filter(hesap => hesap.dünya.toLowerCase() === seçilenDünya.toLowerCase());
        }

        if (data.length === 0) {
            return interaction.reply({ content: 'Hiç hesap bulunamadı.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(seçilenDünya ? `${seçilenDünya} Dünyasındaki Hesaplar` : 'Tüm Hesaplar')
            .setTimestamp()
            .setFooter({ text: `Toplam ${data.length} hesap bulundu` });

        data.forEach((hesap, index) => {
            embed.addFields({ 
                name: `${index + 1}. ${hesap.isim}`, 
                value: `Şifre: ${hesap.şifre}\nDünya: ${hesap.dünya}\nKoordinatlar: X:${hesap.x} Y:${hesap.y} Z:${hesap.z}` 
            });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};