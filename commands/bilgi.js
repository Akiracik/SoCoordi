const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkOwnerPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bilgi')
        .setDescription('Hesap bilgilerini gösterir')
        .addStringOption(option => option.setName('isim').setDescription('Hesap ismi').setRequired(true)),
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
    
            const hesap = data.find(item => item.isim === isim);
    
            if (hesap) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Hesap Bilgileri')
                    .addFields(
                        { name: 'Hesap İsmi', value: hesap.isim },
                        { name: 'Şifre', value: hesap.şifre },
                        { name: 'Dünya', value: hesap.dünya },
                        { name: 'Koordinatlar', value: `X: ${hesap.x}, Y: ${hesap.y}, Z: ${hesap.z}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Bu bilgiler gizlidir, lütfen paylaşmayın.' });
    
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({ content: `${isim} için kayıtlı hesap bulunamadı.`, ephemeral: true });
            }
        },
    };
