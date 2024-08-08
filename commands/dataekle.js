const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkModPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dataekle')
        .setDescription('Yeni hesap ve koordinat verisi ekler')
        .addStringOption(option => option.setName('isim').setDescription('Hesap ismi').setRequired(true))
        .addStringOption(option => option.setName('şifre').setDescription('Hesap şifresi').setRequired(true))
        .addStringOption(option => option.setName('dünya').setDescription('Dünya adı').setRequired(true))
        .addIntegerOption(option => option.setName('x').setDescription('X koordinatı').setRequired(true))
        .addIntegerOption(option => option.setName('y').setDescription('Y koordinatı').setRequired(true))
        .addIntegerOption(option => option.setName('z').setDescription('Z koordinatı').setRequired(true)),
    async execute(interaction) {
        if (!checkModPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok. Sadece mod veya owner rolüne sahip kullanıcılar bu komutu kullanabilir.', ephemeral: true });
        }

        const isim = interaction.options.getString('isim');
        const şifre = interaction.options.getString('şifre');
        const dünya = interaction.options.getString('dünya');
        const x = interaction.options.getInteger('x');
        const y = interaction.options.getInteger('y');
        const z = interaction.options.getInteger('z');

        let data = [];
        try {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
        }

        if (data.some(item => item.isim === isim)) {
            return interaction.reply({ content: `"${isim}" isimli hesap zaten mevcut. Lütfen farklı bir isim kullanın.`, ephemeral: true });
        }

        const newData = { isim, şifre, dünya, x, y, z };
        data.push(newData);

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Veri Başarıyla Eklendi')
            .addFields(
                { name: 'Hesap İsmi', value: isim, inline: true },
                { name: 'Dünya', value: dünya, inline: true },
                { name: 'Koordinatlar', value: `X: ${x}, Y: ${y}, Z: ${z}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed]});
    },
};
