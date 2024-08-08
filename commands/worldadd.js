const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkModPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dünyaekle')
        .setDescription('Yeni hesap konumu ekler')
        .addStringOption(option => option.setName('isim').setDescription('Hesap ismi').setRequired(true))
        .addStringOption(option => option.setName('dünya').setDescription('Dünya adı').setRequired(true))
        .addIntegerOption(option => option.setName('x').setDescription('X koordinatı').setRequired(true))
        .addIntegerOption(option => option.setName('y').setDescription('Y koordinatı').setRequired(true))
        .addIntegerOption(option => option.setName('z').setDescription('Z koordinatı').setRequired(true)),
    async execute(interaction) {
        if (!checkModPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok. Sadece mod veya owner rolüne sahip kullanıcılar bu komutu kullanabilir.', ephemeral: true });
        }

        const isim = interaction.options.getString('isim');
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

        const existingEntry = data.find(item => item.isim === isim && item.dünya === dünya);
        if (existingEntry) {
            existingEntry.x = x;
            existingEntry.y = y;
            existingEntry.z = z;
        } else {
            const newData = { isim, dünya, x, y, z };
            data.push(newData);
        }

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Konum Başarıyla Eklendi/Güncellendi')
            .addFields(
                { name: 'Hesap İsmi', value: isim, inline: true },
                { name: 'Dünya', value: dünya, inline: true },
                { name: 'Koordinatlar', value: `X: ${x}, Y: ${y}, Z: ${z}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed]});
    },
};