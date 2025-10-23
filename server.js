class Server {
    async startServer() {
        const colors = require('colors');
        const express = require('express');
        const { displayHeader, accinfo, login, spin } = require('./src/index');
        require('dotenv').config();

        const usernames = [
            'leiamnash',
            'mynameishi',
            'mynameishello',
            'iloveabi'
        ];
        const password = 'Leiamnash0616';

        colors.setTheme({
            info: 'green',
            warn: 'yellow',
            error: 'red',
            verbose: 'cyan'
        });

        const app = express();

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function runTasksForUser(username) {
            try {
                console.log(colors.verbose.bold(`[ ACCOUNT ] Running for ${username}`));
                let cookies = await login(username, password);
                let resp = await spin(cookies);
                if (!resp.message) throw new Error("Timer not ready, try again later.");
                console.log(colors.info.bold(`[ SPIN ] `) + colors.info(resp.message));
                await accinfo(cookies, true);
            } catch (e) {
                console.log(colors.warn.bold(`[ SCRIPT ] `) + colors.error(e.toString()));
                console.log(colors.warn.bold(`[ SCRIPT ] `) + colors.warn(`Retrying ${username} in 60s...`));
                await delay(60000);
                await runTasksForUser(username);
            }
        }

        async function runEveryTenMinutes() {
            while (true) {
                console.log(colors.verbose.bold(`[ SCRIPT ] Running all accounts...`));
                for (const username of usernames) {
                    await runTasksForUser(username);
                    await delay(5000); // 5s pause between accounts
                }
                console.log(colors.verbose.bold(`[ SCRIPT ] Done. Waiting 10 minutes...`));
                await delay(600000); // 10 minutes
            }
        }

        app.get('/', (req, res) => {
            res.send('Multi-account Auto Farm Script is running...');
        });

        app.listen(3000, async () => {
            displayHeader();
            console.log(colors.verbose.bold(`[ SERVER ] Listening on port ${port}`));
            await runEveryTenMinutes();
        });
    }
}

module.exports = new Server();
