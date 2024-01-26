const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'birthday',
    description: 'Set your birthday. Format: `mm/dd/yyyy`',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'day',
            description: 'The day of your birthday.',
            type: 4,
            required: false,
            autocomplete: true
        },
        {
            name: 'month',
            description: 'The month of your birthday.',
            type: 4,
            required: false,
            autocomplete: true
        },
        {
            name: 'year',
            description: 'The year of your birthday.',
            type: 4,
            required: false,
            autocomplete: true
        }
    ],
    autocomplete: async (interaction, choices) => {
        // depending on the month, there are 28-31 days
        // depending on the month, diplays the correct number of days

        console.log(interaction.options)

        const days = [];
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();
        const day = date.getDate();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const selectedMonth = interaction.options.getInteger('month') || month;

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                name: i.toString(),
                value: i.toString()
            });
        }

        choices.push({
            name: 'Day',
            type: 3,
            options: days
        });

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const selectedYear = interaction.options.getInteger('year') || year;

        if (interaction.options.getInteger('month')) {
            months.forEach((month, index) => {
                choices.push({
                    name: month,
                    value: index.valueOf()
                });
            });

            console.log(choices);

            await interaction.respond(choices).catch(console.error);
        }
    },
    slash: async (client, interaction) => {
        console.log("Birthday slash command")
    }
};