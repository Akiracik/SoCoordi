const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cordi')
        .setDescription('En yakın koordinatı bulur')
        .addStringOption(option => option.setName('dünya').setDescription('Dünya adı').setRequired(true))
        .addStringOption(option => option.setName('coordinat').setDescription('X Y Z koordinatları').setRequired(true)),
    async execute(interaction) {
        const dünya = interaction.options.getString('dünya');
        const coordinat = interaction.options.getString('coordinat').split(' ').map(Number);

        if (coordinat.length !== 3 || coordinat.some(isNaN)) {
            return interaction.reply('Geçersiz koordinat formatı. Lütfen "X Y Z" şeklinde girin.');
        }

        const [x, y, z] = coordinat;

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