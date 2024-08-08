const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { checkModPermission } = require('../utils/permissionCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cordi')
        .setDescription('En yakın koordinatı bulur')
        .addStringOption(option => option.setName('dünya').setDescription('Dünya adı').setRequired(true))
        .addIntegerOption(option => option.setName('x').setDescription('X koordinatı').setRequired(true))
        .addIntegerOption(option => option.setName('y').setDescription('Y koordinatı').setRequired(true))
        .addIntegerOption(option => option.setName('z').setDescription('Z koordinatı').setRequired(true)),
    async execute(interaction) {
        if (!checkModPermission(interaction)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok. Sadece mod veya owner rolüne sahip kullanıcılar bu komutu kullanabilir.', ephemeral: true });
        }

        const dünya = interaction.options.getString('dünya');
        const x = interaction.options.getInteger('x');
        const y = interaction.options.getInteger('y');
        const z = interaction.options.getInteger('z');

        let data = [];
        try {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
            return interaction.reply('Veri okuma hatası oluştu.');
        }

        const filteredData = data.filter(item => item.dünya.toLowerCase() === dünya.toLowerCase());

        if (filteredData.length === 0) {
            return interaction.reply('Bu dünya için kayıtlı veri bulunamadı.');
        }

        let closest = filteredData[0];
        let minDistance = Infinity;

        for (const item of filteredData) {
            const distance = Math.sqrt(
                Math.pow(item.x - x, 2) +
                Math.pow(item.y - y, 2) +
                Math.pow(item.z - z, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closest = item;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`${dünya} Dünyasında En Yakın Koordinat`)
            .addFields(
                { name: 'Hesap İsmi', value: closest.isim },
                { name: 'Koordinatlar', value: `X: ${closest.x}, Y: ${closest.y}, Z: ${closest.z}` },
                { name: 'Mesafe', value: minDistance.toFixed(2) }
            )
            .setColor('#0099ff')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
