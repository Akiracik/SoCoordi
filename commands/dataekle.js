const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dataekle')
        .setDescription('Yeni hesap ve koordinat verisi ekler')
        .addStringOption(option => option.setName('isim').setDescription('Hesap ismi').setRequired(true))
        .addStringOption(option => option.setName('şifre').setDescription('Hesap şifresi').setRequired(true))
        .addStringOption(option => option.setName('dünya').setDescription('Dünya adı').setRequired(true))
        .addStringOption(option => option.setName('coordinat').setDescription('X Y Z koordinatları').setRequired(true)),
    async execute(interaction) {
        const isim = interaction.options.getString('isim');
        const şifre = interaction.options.getString('şifre');
        const dünya = interaction.options.getString('dünya');
        const coordinat = interaction.options.getString('coordinat').split(' ').map(Number);

        if (coordinat.length !== 3 || coordinat.some(isNaN)) {
            return interaction.reply({ content: 'Geçersiz koordinat formatı. Lütfen "X Y Z" şeklinde girin.', ephemeral: true });
        }

        const [x, y, z] = coordinat;

        let data = [];
        try {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
        }

        // Aynı isimli hesap kontrolü
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
            .setTimestamp()

        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};